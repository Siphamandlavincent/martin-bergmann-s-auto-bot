import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";
import { chatComplete, type ChatMessage } from "./ai.server";

export type Part = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  fitment: string;
  price: number;
  in_stock: boolean;
  image_url: string | null;
};


function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const listParts = createServerFn({ method: "GET" }).handler(async (): Promise<Part[]> => {
  const { data, error } = await publicClient()
    .from("parts")
    .select("id, name, brand, category, description, fitment, price, in_stock, image_url")
    .order("category")
    .order("name");

  if (error) {
    console.error("listParts failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({ ...row, price: Number(row.price) }));
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
});

const OrderSchema = z.object({
  customer_name: z.string().min(1).max(120),
  customer_phone: z.string().max(40).optional().default(""),
  customer_email: z.string().max(160).optional().default(""),
  vehicle: z.string().max(200).optional().default(""),
  notes: z.string().max(1000).optional().default(""),
  items: z
    .array(
      z.object({
        name: z.string().min(1).max(200),
        quantity: z.number().int().min(1).max(99).optional().default(1),
        price: z.number().min(0).max(1000000).optional().default(0),
      }),
    )
    .min(1)
    .max(25),
});

const ORDER_PATTERN = /\[ORDER\]([\s\S]*?)\[\/ORDER\]/;

export const chatWithBot = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const parts = await listParts();
    const catalog = parts
      .map(
        (p) =>
          `- ${p.name} | ${p.brand} | ${p.category} | R${p.price.toFixed(2)} | fits: ${p.fitment || "various"} | ${p.in_stock ? "in stock" : "on order"}`,
      )
      .join("\n");

    const system = `You are "Bergie", the order-taking assistant for MARTIN BERGMANN Electrical Diagnostics and Car Parts.
You help customers find car parts, quote prices in South African Rand (R), and take their orders in the chat.

Catalog you can sell from:
${catalog}

Rules:
- Be brief, friendly and practical, like a helpful parts counter person.
- Always ask for the vehicle (make, model, year, engine) before confirming fitment.
- Before placing an order you MUST have: customer full name, phone number, email address, vehicle, and the parts with quantities.
- Give a clear total before asking the customer to confirm.
- Only when the customer explicitly confirms the order, end your reply with an order block on its own line, exactly in this format:
[ORDER]{"customer_name":"...","customer_phone":"...","customer_email":"...","vehicle":"...","notes":"...","items":[{"name":"...","quantity":1,"price":0}]}[/ORDER]
- Never show the order block content to the customer in any other way, and never invent parts that are not in the catalog.
- If a part is not in the catalog, offer to log the request as a special-order enquiry using the same order block with a note.`;

    const messages: ChatMessage[] = [{ role: "system", content: system }, ...data.messages];
    const raw = await chatComplete(messages);

    const match = raw.match(ORDER_PATTERN);
    let reply = raw.replace(ORDER_PATTERN, "").trim();
    let orderPlaced = false;
    let orderReference: string | null = null;

    if (match) {
      try {
        const parsed = OrderSchema.parse(JSON.parse(match[1]!.trim()));
        const total = parsed.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: inserted, error } = await supabaseAdmin
          .from("orders")
          .insert({
            customer_name: parsed.customer_name,
            customer_phone: parsed.customer_phone,
            customer_email: parsed.customer_email,
            vehicle: parsed.vehicle,
            notes: parsed.notes,
            items: parsed.items,
            total,
            source: "chatbot",
          })
          .select("id")
          .single();

        if (error) throw new Error(error.message);

        orderPlaced = true;
        orderReference = inserted.id.slice(0, 8).toUpperCase();
        console.log(
          `NEW ORDER ${orderReference} for owner (autorepairsandparts@gmail.com):`,
          JSON.stringify({ ...parsed, total }),
        );
        reply = `${reply}\n\nOrder reference: **${orderReference}** — it has been sent through to the store.`.trim();
      } catch (error) {
        console.error("Order capture failed:", (error as Error).message);
        reply = `${reply}\n\nI couldn't finalise that order automatically — please call the store on the number below and quote your parts list.`.trim();
      }
    }

    return { reply, orderPlaced, orderReference };
  });
