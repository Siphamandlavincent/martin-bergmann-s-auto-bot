import { useMemo, useState } from "react";
import { Search, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { productImage } from "@/lib/product-images";
import type { Part } from "@/lib/store.functions";


export function PartsCatalog({ parts }: { parts: Part[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(parts.map((p) => p.category))).sort()],
    [parts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parts.filter((p) => {
      const inCategory = category === "All" || p.category === category;
      const matches =
        q.length === 0 ||
        `${p.name} ${p.brand} ${p.category} ${p.fitment} ${p.description}`
          .toLowerCase()
          .includes(q);
      return inCategory && matches;
    });
  }, [parts, query, category]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brake pads, alternator, Hilux..."
            className="pl-9"
            aria-label="Search car parts"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={item === category ? "default" : "outline"}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((part) => {
          const image = productImage(part.image_url);
          return (
          <Card
            key={part.id}
            className="flex h-full flex-col gap-0 overflow-hidden border-2 py-0 transition-shadow hover:shadow-hard"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center border-b-2 border-ink bg-surface">
              {image ? (
                <img
                  src={image}
                  alt={`${part.brand} ${part.name}`}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="size-full object-contain p-4 mix-blend-multiply"
                />
              ) : (
                <>
                  <Wrench className="size-10 text-muted-foreground/60" />
                  <div className="racing-stripe absolute inset-x-0 bottom-0 h-1.5 opacity-60" />
                </>
              )}
            </div>
            <CardContent className="flex flex-1 flex-col space-y-3 p-5">

              <div className="flex items-start justify-between gap-3">
                <Badge variant="secondary" className="uppercase">
                  {part.category}
                </Badge>
                <Badge variant={part.in_stock ? "default" : "outline"}>
                  {part.in_stock ? "In stock" : "On order"}
                </Badge>
              </div>

              <h3 className="text-lg leading-tight">{part.name}</h3>
              <p className="text-sm text-muted-foreground">{part.description}</p>
              <dl className="space-y-1 text-xs text-muted-foreground">
                <div>
                  <dt className="inline font-semibold">Brand: </dt>
                  <dd className="inline">{part.brand || "OE"}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Fits: </dt>
                  <dd className="inline">{part.fitment || "Various"}</dd>
                </div>
              </dl>
              <p className="font-display text-2xl text-primary">R {part.price.toFixed(2)}</p>
            </CardContent>
          </Card>
          );
        })}

      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">
          No parts match that search — ask Bergie in the chat and we&apos;ll source it for you.
        </p>
      )}
    </div>
  );
}
