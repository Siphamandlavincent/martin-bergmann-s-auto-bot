import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Clock, Mail, MapPin, Phone, ShieldCheck, Truck, Zap } from "lucide-react";

import heroImage from "@/assets/hero-workshop.jpg";
import { Button } from "@/components/ui/button";
import { OrderChat } from "@/components/OrderChat";
import { PartsCatalog } from "@/components/PartsCatalog";
import { listParts } from "@/lib/store.functions";

const partsQuery = queryOptions({
  queryKey: ["parts"],
  queryFn: () => listParts(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(partsQuery),
  head: () => ({
    meta: [
      { title: "Martin Bergmann | Car Parts & Electrical Diagnostics" },
      {
        name: "description",
        content:
          "Shop car parts online and order in chat. Martin Bergmann Electrical Diagnostics and Car Parts — brakes, filters, alternators, starters and full auto electrical fault finding.",
      },
      { property: "og:title", content: "Martin Bergmann | Car Parts & Electrical Diagnostics" },
      {
        property: "og:description",
        content:
          "Genuine-quality car parts, honest prices and expert auto electrical diagnostics. Order instantly through our chat assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const highlights = [
  {
    icon: Zap,
    title: "Auto electrical diagnostics",
    body: "Full ECU scans, wiring fault finding and no-start diagnosis on all makes.",
  },
  {
    icon: ShieldCheck,
    title: "Quality parts only",
    body: "Bosch, NGK, SKF, Gates, Valeo and more — with warranty on every part.",
  },
  {
    icon: Truck,
    title: "Fast countrywide delivery",
    body: "Same-day dispatch on in-stock items, collection welcome at the workshop.",
  },
];

function Home() {
  const { data: parts } = useSuspenseQuery(partsQuery);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-display text-lg leading-none sm:text-xl">Martin Bergmann</p>
            <p className="text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
              Electrical Diagnostics &amp; Car Parts
            </p>
          </div>
          <nav className="hidden gap-6 text-sm font-semibold uppercase md:flex">
            <a href="#catalog" className="hover:text-primary">
              Parts
            </a>
            <a href="#services" className="hover:text-primary">
              Services
            </a>
            <a href="#contact" className="hover:text-primary">
              Contact
            </a>
          </nav>
          <Button asChild>
            <a href="#catalog">Shop parts</a>
          </Button>
        </div>
        <div className="racing-stripe h-1.5" />
      </header>

      <main>
        <section className="relative overflow-hidden bg-ink text-ink-foreground">
          <img
            src={heroImage}
            alt="Technician running an electrical diagnostic scan on a car engine"
            width={1600}
            height={1008}
            className="absolute inset-0 size-full object-cover opacity-35"
          />
          <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
            <p className="mb-4 inline-block bg-primary px-3 py-1 text-xs font-bold tracking-[0.2em] text-primary-foreground uppercase">
              Est. workshop &amp; parts counter
            </p>
            <h1 className="max-w-3xl text-4xl leading-[0.95] sm:text-6xl lg:text-7xl">
              MARTIN BERGMANN
              <span className="mt-3 block text-primary">Electrical Diagnostics</span>
              <span className="block">and Car Parts</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg opacity-85">
              Shop quality car parts online, or just tell our chat assistant what you drive — it
              quotes you, checks fitment and sends your order straight to the workshop.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#catalog">Browse the catalog</a>
              </Button>
              <Button size="lg" variant="hero" asChild>
                <a href="#contact">Book a diagnostic</a>
              </Button>

            </div>
          </div>
        </section>

        <section id="services" className="border-b-2 border-ink bg-surface">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-2 border-ink bg-card p-6">
                <Icon className="size-8 text-primary" />
                <h2 className="mt-4 text-lg">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="catalog" className="mx-auto max-w-6xl px-5 py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl">Parts catalog</h2>
            <p className="mt-3 text-muted-foreground">
              Prices include VAT. Not sure it fits? Ask in the chat with your make, model and year.
            </p>
          </div>
          <PartsCatalog parts={parts} />
        </section>

        <section id="contact" className="bg-ink text-ink-foreground">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2">
            <div>
              <h2 className="text-3xl">Talk to the workshop</h2>
              <p className="mt-3 max-w-md opacity-80">
                Orders taken in the chat land with us instantly. For diagnostics bookings, drop us a
                mail or give us a call.
              </p>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="size-5 text-primary" />
                <a href="mailto:autorepairsandparts@gmail.com" className="hover:underline">
                  autorepairsandparts@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-5 text-primary" />
                Call or WhatsApp the parts counter
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-5 text-primary" />
                Workshop collections welcome
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-5 text-primary" />
                Mon–Fri 08:00–17:00 · Sat 08:00–13:00
              </li>
            </ul>
          </div>
          <div className="racing-stripe h-1.5" />
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-5 py-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Martin Bergmann Electrical Diagnostics and Car Parts.
      </footer>

      <OrderChat />
    </div>
  );
}
