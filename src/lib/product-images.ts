import agmBattery from "@/assets/products/agm-battery.webp";
import airFilterPanel from "@/assets/products/air-filter-panel.webp";
import brakeFluid from "@/assets/products/brake-fluid-dot4.webp";
import clutchKit from "@/assets/products/clutch-kit.jpg";
import cvJointKit from "@/assets/products/cv-joint-kit.jpg";
import frontBrakePads from "@/assets/products/front-brake-pads.webp";
import frontShocks from "@/assets/products/front-shocks.jpg";
import fuelFilterDiesel from "@/assets/products/fuel-filter-diesel.jpg";
import headlightLeft from "@/assets/products/headlight-left.webp";
import helixHx5 from "@/assets/products/helix-hx5.jpg";
import helixHx7 from "@/assets/products/helix-hx7.jpg";
import ignitionCoilPack from "@/assets/products/ignition-coil-pack.webp";
import ledBulbKit from "@/assets/products/led-bulb-kit.jpg";
import obd2Scan from "@/assets/products/obd2-scan.jpg";
import oilFilter from "@/assets/products/oil-filter.jpg";
import radiatorAssembly from "@/assets/products/radiator-assembly.jpg";
import rearBrakeDiscs from "@/assets/products/rear-brake-discs.webp";
import serviceKit from "@/assets/products/service-kit.jpg";
import sparkPlugSet from "@/assets/products/spark-plug-set.jpg";
import starterMotor from "@/assets/products/starter-motor.webp";
import suspensionSet from "@/assets/products/suspension-set.jpg";
import thermostatHousing from "@/assets/products/thermostat-housing.avif";
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
  "fuel-filter-diesel": fuelFilterDiesel,
  "headlight-left": headlightLeft,
  "helix-hx5": helixHx5,
  "helix-hx7": helixHx7,
  "ignition-coil-pack": ignitionCoilPack,
  "led-bulb-kit": ledBulbKit,
  "obd2-scan": obd2Scan,
  "oil-filter": oilFilter,
  "radiator-assembly": radiatorAssembly,
  "rear-brake-discs": rearBrakeDiscs,
  "service-kit": serviceKit,
  "spark-plug-set": sparkPlugSet,
  "starter-motor": starterMotor,
  "suspension-set": suspensionSet,
  "thermostat-housing": thermostatHousing,
  "wheel-bearing-kit": wheelBearingKit,
};

/** Resolve a parts.image_url slug to a bundled asset URL, if we have a photo. */
export function productImage(slug: string | null | undefined): string | undefined {
  if (!slug) return undefined;
  return productImages[slug];
}
