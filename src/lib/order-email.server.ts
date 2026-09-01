/** Owner order notification email (server-only). */

const OWNER_EMAIL = "autorepairsandparts@gmail.com";

export type OrderEmailPayload = {
  reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  vehicle: string;
  notes: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
};

const rand = (n: number) => `R${n.toFixed(2)}`;

function renderHtml(order: OrderEmailPayload) {
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${rand(i.price * i.quantity)}</td></tr>`,
    )
    .join("");

  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#111">
    <div style="background:#111;color:#fff;padding:16px 20px">
      <strong style="font-size:18px;letter-spacing:1px">MARTIN BERGMANN</strong><br/>
      <span style="color:#e11d2a;font-size:12px">Electrical Diagnostics and Car Parts</span>
    </div>
    <div style="padding:20px">
      <h2 style="margin:0 0 4px">New chat order ${order.reference}</h2>
      <p style="margin:0 0 16px;color:#555">Taken by Bergie, the website chat assistant.</p>
      <table style="border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:2px 12px 2px 0"><b>Customer</b></td><td>${order.customer_name || "-"}</td></tr>
        <tr><td style="padding:2px 12px 2px 0"><b>Phone</b></td><td>${order.customer_phone || "-"}</td></tr>
        <tr><td style="padding:2px 12px 2px 0"><b>Email</b></td><td>${order.customer_email || "-"}</td></tr>
        <tr><td style="padding:2px 12px 2px 0"><b>Vehicle</b></td><td>${order.vehicle || "-"}</td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#f5f5f5"><th style="padding:8px;text-align:left">Part</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Line total</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td colspan="2" style="padding:8px;text-align:right"><b>Total</b></td><td style="padding:8px;text-align:right"><b>${rand(order.total)}</b></td></tr></tfoot>
      </table>
      ${order.notes ? `<p style="margin-top:16px"><b>Notes:</b> ${order.notes}</p>` : ""}
    </div>
  </div>`;
}

function renderText(order: OrderEmailPayload) {
  const lines = order.items.map((i) => `- ${i.quantity} x ${i.name} = ${rand(i.price * i.quantity)}`);
  return [
    `New chat order ${order.reference}`,
    `Customer: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Email: ${order.customer_email}`,
    `Vehicle: ${order.vehicle}`,
    "",
    ...lines,
    `Total: ${rand(order.total)}`,
    order.notes ? `Notes: ${order.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Emails the order to the store owner. Returns true when the mail provider
 * accepted the message; never throws so the order itself is never lost.
 */
export async function sendOrderEmail(order: OrderEmailPayload): Promise<boolean> {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["ORDER_EMAIL_FROM"] || "orders@martinbergmann.co.za";

  if (!apiKey) {
    console.warn(`Order ${order.reference}: no mail provider configured, logging only.`);
    console.log(renderText(order));
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `MARTIN BERGMANN Orders <${from}>`,
        to: [OWNER_EMAIL],
        ...(order.customer_email ? { reply_to: order.customer_email } : {}),
        subject: `New order ${order.reference} — ${order.customer_name} (${rand(order.total)})`,
        html: renderHtml(order),
        text: renderText(order),
      }),
    });

    if (!res.ok) {
      console.error(`Order ${order.reference} email failed: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Order ${order.reference} email error:`, (error as Error).message);
    return false;
  }
}
