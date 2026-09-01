import alternator120a from "@/assets/products/alternator-120a.jpg";
import cabinPollenFilter from "@/assets/products/cabin-pollen-filter.jpg";
import agmBattery from "@/assets/products/agm-battery.jpg";
import airFilterPanel from "@/assets/products/air-filter-panel.jpg";
import brakeFluid from "@/assets/products/brake-fluid-dot4.jpg";
import clutchKit from "@/assets/products/clutch-kit.jpg";
import cvJointKit from "@/assets/products/cv-joint-kit.jpg";
import frontBrakePads from "@/assets/products/front-brake-pads.jpg";
import frontShocks from "@/assets/products/front-shocks.jpg";
import fuelFilterDiesel from "@/assets/products/fuel-filter-diesel.jpg";
import headlightLeft from "@/assets/products/headlight-left.jpg";
import helixHx5 from "@/assets/products/helix-hx5.jpg";
import helixHx7 from "@/assets/products/helix-hx7.jpg";
import ignitionCoilPack from "@/assets/products/ignition-coil-pack.jpg";
import ledBulbKit from "@/assets/products/led-bulb-kit.jpg";
import obd2Scan from "@/assets/products/obd2-scan.jpg";
import oilFilter from "@/assets/products/oil-filter.jpg";
import radiatorAssembly from "@/assets/products/radiator-assembly.jpg";
import rearBrakeDiscs from "@/assets/products/rear-brake-discs.jpg";
import serviceKit from "@/assets/products/service-kit.jpg";
import sparkPlugSet from "@/assets/products/spark-plug-set.jpg";
import starterMotor from "@/assets/products/starter-motor.jpg";
import suspensionSet from "@/assets/products/suspension-set.jpg";
import thermostatHousing from "@/assets/products/thermostat-housing.jpg";
import timingBeltKit from "@/assets/products/timing-belt-kit.jpg";
import waterPump from "@/assets/products/water-pump.jpg";
import wheelBearingKit from "@/assets/products/wheel-bearing-kit.jpg";
import wheelBearingKitGeneric from "@/assets/products/wheel-bearing-kit-generic.jpg";

/** Slugs stored in parts.image_url map to bundled studio product photos. */
export const productImages: Record<string, string> = {
  "agm-battery": agmBattery,
  "alternator-120a": alternator120a,
  "cabin-pollen-filter": cabinPollenFilter,
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
  "timing-belt-kit": timingBeltKit,
  "water-pump": waterPump,
  "wheel-bearing-kit": wheelBearingKit,
  "wheel-bearing-kit-generic": wheelBearingKitGeneric,
};

/** Resolve a parts.image_url slug to a bundled asset URL, if we have a photo. */
export function productImage(slug: string | null | undefined): string | undefined {
  if (!slug) return undefined;
  return productImages[slug];
}
