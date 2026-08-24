import helixHx5 from "@/assets/products/helix-hx5.jpg";
import helixHx7 from "@/assets/products/helix-hx7.jpg";
import serviceKit from "@/assets/products/service-kit.jpg";
import suspensionSet from "@/assets/products/suspension-set.jpg";
import wheelBearingKit from "@/assets/products/wheel-bearing-kit.jpg";

/** Slugs stored in parts.image_url map to bundled studio product photos. */
export const productImages: Record<string, string> = {
  "helix-hx5": helixHx5,
  "helix-hx7": helixHx7,
  "service-kit": serviceKit,
  "suspension-set": suspensionSet,
  "wheel-bearing-kit": wheelBearingKit,
};

export function productImage(slug?: string | null): string | undefined {
  if (!slug) return undefined;
  return productImages[slug] ?? (slug.startsWith("http") ? slug : undefined);
}
