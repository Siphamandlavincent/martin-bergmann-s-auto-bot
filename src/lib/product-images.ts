import agmBattery from "@/assets/products/agm-battery.webp";
import airFilterPanel from "@/assets/products/air-filter-panel.webp";
import brakeFluid from "@/assets/products/brake-fluid-dot4.webp";
import clutchKit from "@/assets/products/clutch-kit.jpg";
import cvJointKit from "@/assets/products/cv-joint-kit.jpg";
import frontBrakePads from "@/assets/products/front-brake-pads.webp";
import frontShocks from "@/assets/products/front-shocks.jpg";
import headlightLeft from "@/assets/products/headlight-left.webp";
import helixHx5 from "@/assets/products/helix-hx5.jpg";
import helixHx7 from "@/assets/products/helix-hx7.jpg";
import serviceKit from "@/assets/products/service-kit.jpg";
import suspensionSet from "@/assets/products/suspension-set.jpg";
import wheelBearingKit from "@/assets/products/wheel-bearing-kit.jpg";

/** Slugs stored in parts.image_url map to bundled studio product photos. */
export const productImages: Record<string, string> = {
  "agm-battery": agmBattery,
  "air-filter-panel": airFilterPanel,
  "brake-fluid-dot4": brakeFluid,
  "clutch-kit": clutchKit,
  "cv-joint-kit": cvJointKit,
  "front-brake-pads": frontBrakePads,
  "front-shocks": frontShocks,
  "headlight-left": headlightLeft,
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
