CREATE TABLE IF NOT EXISTS public.parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  fitment TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.parts TO anon;
GRANT SELECT ON public.parts TO authenticated;
GRANT ALL ON public.parts TO service_role;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Parts are publicly viewable" ON public.parts;
CREATE POLICY "Parts are publicly viewable" ON public.parts FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL DEFAULT '',
  customer_email TEXT NOT NULL DEFAULT '',
  vehicle TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT NOT NULL DEFAULT '',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'chatbot',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

INSERT INTO public.parts (name, brand, category, description, fitment, price, in_stock, image_url)
SELECT * FROM (VALUES
('Front Brake Pad Set', 'Bosch', 'Brakes', 'Low-dust ceramic front brake pads with wear indicators.', 'VW Polo / Golf 5-7', 899.00, true, NULL),
('Rear Brake Discs (Pair)', 'ATE', 'Brakes', 'Vented rear brake discs, precision balanced.', 'BMW 3 Series E90/F30', 1750.00, true, NULL),
('Brake Fluid DOT 4 1L', 'Castrol', 'Brakes', 'High boiling point synthetic brake fluid.', 'Universal', 189.00, true, NULL),
('Alternator 120A', 'Valeo', 'Electrical', 'Remanufactured alternator, bench tested.', 'Toyota Hilux 2.5 D4D', 4250.00, true, NULL),
('Starter Motor', 'Denso', 'Electrical', 'OE-spec starter motor with new solenoid.', 'Ford Ranger 3.2 TDCi', 3890.00, true, NULL),
('AGM Battery 70Ah', 'Exide', 'Electrical', 'Start-stop rated AGM battery, 24-month warranty.', 'Universal Group 27', 2650.00, true, NULL),
('Ignition Coil Pack', 'NGK', 'Electrical', 'Direct-fit coil pack, resolves misfire codes.', 'VW/Audi 1.4 TSI', 1120.00, true, NULL),
('Spark Plug Set (4)', 'NGK', 'Engine', 'Iridium spark plugs for longer service intervals.', 'Most 4-cylinder petrol', 640.00, true, NULL),
('Timing Belt Kit', 'Gates', 'Engine', 'Belt, tensioner and idler pulleys in one kit.', 'Opel Corsa 1.4', 2980.00, true, NULL),
('Water Pump', 'SKF', 'Engine', 'Cast impeller water pump with gasket.', 'Nissan NP200 1.6', 1240.00, true, NULL),
('Oil Filter', 'Mann', 'Filters', 'Full-flow oil filter with anti-drain valve.', 'Universal spin-on', 145.00, true, NULL),
('Air Filter Panel', 'Mahle', 'Filters', 'High-flow panel air filter element.', 'Hyundai i20 / Accent', 265.00, true, NULL),
('Cabin Pollen Filter', 'Bosch', 'Filters', 'Activated carbon cabin filter.', 'Toyota Corolla 2014+', 310.00, true, NULL),
('Fuel Filter Diesel', 'Mann', 'Filters', 'Diesel fuel filter with water separator.', 'Isuzu KB 300', 520.00, true, NULL),
('Front Shock Absorbers (Pair)', 'Monroe', 'Suspension', 'Gas-charged front shocks for restored ride comfort.', 'Toyota Corolla 2008-2018', 2340.00, true, NULL),
('Control Arm Bushes', 'Lemforder', 'Suspension', 'Rubber-bonded control arm bush set.', 'VW Golf 6', 690.00, true, 'suspension-set'),
('Wheel Bearing Kit', 'SKF', 'Suspension', 'Sealed wheel bearing with retaining hardware.', 'Ford Fiesta 1.4', 780.00, true, 'wheel-bearing-kit'),
('Clutch Kit 3-Piece', 'Luk', 'Transmission', 'Clutch plate, cover and release bearing.', 'Nissan Navara 2.5', 5450.00, true, NULL),
('CV Joint Kit', 'GKN', 'Transmission', 'Outer CV joint with boot and grease.', 'Chevrolet Aveo', 940.00, true, NULL),
('Radiator Assembly', 'Nissens', 'Cooling', 'Aluminium core radiator with plastic tanks.', 'Mazda 3 1.6', 2790.00, true, NULL),
('Thermostat & Housing', 'Gates', 'Cooling', 'Complete thermostat housing with sensor port.', 'Renault Duster 1.6', 860.00, true, NULL),
('Headlight Assembly Left', 'Depo', 'Body & Lighting', 'Clear lens headlight unit, OE mounting points.', 'Toyota Hilux 2016-2020', 3120.00, true, NULL),
('LED Bulb Kit H4', 'Osram', 'Body & Lighting', 'Plug-and-play LED upgrade, 6000K.', 'Universal H4', 780.00, true, NULL),
('OBD2 Diagnostic Scan', 'Martin Bergmann', 'Diagnostics', 'In-store full electrical diagnostic scan and fault report.', 'All makes', 450.00, true, NULL),
('FK1 Filter Service Kit (Oil, Air, Fuel)', 'GUD', 'Filters', 'Complete service kit with oil, air and fuel filters in one box.', 'Toyota Hilux D4D', 1150.00, true, 'service-kit'),
('Shell Helix HX7 10W-40 5L', 'Shell', 'Oils & Fluids', 'Synthetic technology motor oil for petrol and diesel engines.', 'Universal 10W-40', 749.00, true, 'helix-hx7'),
('Shell Helix HX5 15W-40 5L', 'Shell', 'Oils & Fluids', 'Premium multi-grade motor oil with active cleansing technology.', 'Universal 15W-40', 589.00, true, 'helix-hx5'),
('Front Wheel Bearing Hub Kit', 'Partquip', 'Suspension', 'Complete hub flange with sealed bearing, ABS ring and studs.', 'Hyundai Accent / i30 / Kia Cerato', 1290.00, true, 'wheel-bearing-kit')
) AS seed(name, brand, category, description, fitment, price, in_stock, image_url)
WHERE NOT EXISTS (SELECT 1 FROM public.parts p WHERE p.name = seed.name);