import heroPavilionImg from '../assets/images/hero_pavilion_architecture_1793851041837.jpg';
import kyotoResidenceImg from '../assets/images/project_kyoto_residence_1793851041965.jpg';
import zurichGalleryImg from '../assets/images/project_zurich_gallery_1793851042262.jpg';
import portlandAtelierImg from '../assets/images/project_portland_atelier_1793851042217.jpg';
import nordicBathhouseImg from '../assets/images/project_nordic_bathhouse_1793851043531.jpg';

export type ProjectCategory = 'Residential' | 'Cultural' | 'Commercial';

export interface ProjectCommission {
  id: string;
  title: string;
  category: ProjectCategory;
  location: string;
  year: string;
  areaSqm: number;
  primaryStructure: string;
  embodiedCarbonDelta: string;
  daylightFactor: string;
  summary: string;
  architecturalBrief: string;
  structuralNotes: string;
  materials: string[];
  image: string;
  imageAlt: string;
  coordinates: string;
}

export interface PracticeDiscipline {
  number: string;
  title: string;
  description: string;
  outcomeMetric: string;
  spanClass: string;
}

export interface MaterialSpec {
  id: string;
  name: string;
  classification: string;
  origin: string;
  thermalConductivity: string;
  embodiedCarbon: string;
  acousticRating: string;
  application: string;
  notes: string;
}

export interface JournalEssay {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  paragraphs: string[];
}

export const HERO_MEDIA = {
  image: heroPavilionImg,
  imageAlt:
    'Aethel Cultural Pavilion overlooking a calm alpine lake at morning light, built with board-formed concrete and warm oak soffits.',
  caption: 'Aethel Cultural Pavilion · Graubünden, Switzerland',
};

export const PRACTICE_METRICS = [
  { value: '42', label: 'Completed Commissions' },
  { value: '18', label: 'International Design Awards' },
  { value: '-38%', label: 'Embodied Carbon vs. Baseline' },
  { value: '3', label: 'Studios: Zurich · Kyoto · Portland' },
];

export const PROJECTS: ProjectCommission[] = [
  {
    id: 'higashiyama-courtyard-house',
    title: 'Higashiyama Courtyard House',
    category: 'Residential',
    location: 'Kyoto, Japan',
    year: '2025',
    areaSqm: 480,
    primaryStructure: 'Charred Sugi & Cast Concrete',
    embodiedCarbonDelta: '-34% CO₂e',
    daylightFactor: '4.2% DF',
    summary:
      'A stepped hillside residence organized around a sheltered moss courtyard, filtering mountain light through vertical charred cedar louvers.',
    architecturalBrief:
      'Set on a 24-degree granite slope in eastern Kyoto, the residence balances privacy from neighboring roofs with uninterrupted views toward the wooded ridge. Living spaces step down the terrain in three split-level pavilions connected by a continuous engawa.',
    structuralNotes:
      'A post-tensioned concrete retaining base anchors the upper Douglas fir and sugi timber frame, allowing 6.4-meter corner-free sliding glass openings that dissolve the boundary between interior tatami rooms and the moss garden.',
    materials: [
      'Yakisugi Charred Cedar',
      'Board-Formed Concrete',
      'Hinoki Cypress Millwork',
      'Aji Granite Pavers',
    ],
    image: kyotoResidenceImg,
    imageAlt:
      'Higashiyama Courtyard House in Kyoto featuring vertical charred cedar louvers, smooth concrete retaining walls, and a moss garden.',
    coordinates: '35.0037° N, 135.7785° E',
  },
  {
    id: 'kunsthalle-limmat-wing',
    title: 'Kunsthalle Limmat North Wing',
    category: 'Cultural',
    location: 'Zurich, Switzerland',
    year: '2025',
    areaSqm: 3420,
    primaryStructure: 'Honed Jura Limestone & Steel Truss',
    embodiedCarbonDelta: '-41% CO₂e',
    daylightFactor: '5.8% DF',
    summary:
      'An adaptive museum expansion crowned by a diagrid north-facing skylight that delivers glare-free, museum-grade daylight across 14 galleries.',
    architecturalBrief:
      'Commissioned to house large-scale contemporary sculpture and works on paper, the North Wing replaces a former industrial warehouse while preserving 78% of the existing foundation pile network.',
    structuralNotes:
      'A long-span acoustic steel diagrid roof supports triple-glazed prismatic skylights calibrated to block direct summer sun while maintaining 98 CRI natural illumination throughout winter.',
    materials: [
      'Honed Jura Limestone',
      'White Oak Gallery Benches',
      'Acoustic Lime Plaster',
      'Low-Iron Prismatic Glass',
    ],
    image: zurichGalleryImg,
    imageAlt:
      'Kunsthalle Limmat North Wing interior in Zurich with a soaring geometric skylight, honed limestone walls, and pale oak benches.',
    coordinates: '47.3769° N, 8.5417° E',
  },
  {
    id: 'willamette-timber-atelier',
    title: 'Willamette Mass-Timber Atelier',
    category: 'Commercial',
    location: 'Portland, United States',
    year: '2024',
    areaSqm: 2850,
    primaryStructure: '5-Ply CLT & Glulam Portal Frame',
    embodiedCarbonDelta: '-46% CO₂e',
    daylightFactor: '4.9% DF',
    summary:
      'A three-story zero-operational-carbon design studio and fabrication workshop framed entirely in regional FSC-certified Douglas fir.',
    architecturalBrief:
      'Designed for an interdisciplinary industrial design and robotics practice, the building pairs a heavy-timber fabrication hall on the ground floor with open-plan drafting studios above.',
    structuralNotes:
      'Prefabricated 5-ply cross-laminated timber floor cassettes span 9.2 meters between glulam columns, erected in 19 working days with concealed knife-plate steel connectors and radiant hydronic slabs.',
    materials: [
      'FSC Douglas Fir Glulam',
      'Cross-Laminated Timber',
      'Triple-Glazed Curtain Wall',
      'Perforated Birch Acoustic Panels',
    ],
    image: portlandAtelierImg,
    imageAlt:
      'Willamette Mass-Timber Atelier in Portland at twilight showing exposed Douglas fir beams and warm interior studio lighting.',
    coordinates: '45.5152° N, 122.6784° W',
  },
  {
    id: 'skagerrak-tidal-bathhouse',
    title: 'Skagerrak Tidal Bathhouse',
    category: 'Cultural',
    location: 'Bohuslän, Sweden',
    year: '2024',
    areaSqm: 620,
    primaryStructure: 'Honed Basalt & Siberian Larch',
    embodiedCarbonDelta: '-31% CO₂e',
    daylightFactor: '3.6% DF',
    summary:
      'A coastal thermal bathhouse and cold-water plunge pavilion anchored directly into granite sea ledges along the Skagerrak strait.',
    architecturalBrief:
      'Built to withstand salt-spray gales and seasonal tidal surges, the bathhouse offers three-stage thermal bathing—wood-fired sauna, tepidarium, and direct sea plunge—for a coastal municipality.',
    structuralNotes:
      'Load-bearing honed basalt masonry walls provide high thermal mass and salt resistance, paired with an untreated Siberian larch changing pavilion that weathers to silver-grey.',
    materials: [
      'Honed Nordic Basalt',
      'Untreated Siberian Larch',
      'Marine-Grade Brushed Bronze',
      'Geothermal Heat Exchange',
    ],
    image: nordicBathhouseImg,
    imageAlt:
      'Skagerrak Tidal Bathhouse built of dark honed basalt stone and larch wood beside calm coastal water under overcast sky.',
    coordinates: '58.3489° N, 11.2281° E',
  },
];

export const PRACTICE_DISCIPLINES: PracticeDiscipline[] = [
  {
    number: '01',
    title: 'Site & Solar Topography',
    description:
      'Every commission begins with a 12-month microclimate, wind-rose, and solar-path simulation. We orient building massing to harvest passive winter heat and natural cross-ventilation before drawing a single wall.',
    outcomeMetric: '32% average reduction in mechanical HVAC load',
    spanClass: 'lg:col-span-7',
  },
  {
    number: '02',
    title: 'Mass-Timber Structural Engineering',
    description:
      'Our in-house structural engineers detail long-span glulam, CLT, and post-tensioned timber frames fabricated off-site to millimeter tolerances.',
    outcomeMetric: '40% faster structural erection on site',
    spanClass: 'lg:col-span-5',
  },
  {
    number: '03',
    title: 'Adaptive Reuse & Low-Carbon Envelopes',
    description:
      'We prioritize retaining existing foundations and primary frames, pairing them with triple-glazed curtain walls, lime-hemp insulation, and high-slag concrete mixes.',
    outcomeMetric: 'Minergie-P & Passivhaus Plus certified',
    spanClass: 'lg:col-span-5',
  },
  {
    number: '04',
    title: 'Bespoke Millwork & Acoustic Tuning',
    description:
      'From gallery benches to residential joinery, we design custom furniture, hardware, and perforated timber acoustic ceilings calibrated to each room’s reverberation profile.',
    outcomeMetric: 'RT60 0.45s speech & gallery acoustic clarity',
    spanClass: 'lg:col-span-7',
  },
];

export const MATERIAL_SPECS: MaterialSpec[] = [
  {
    id: 'charred-sugi',
    name: 'Charred Sugi Cedar',
    classification: 'Exterior Cladding & Louvers',
    origin: 'Yoshino Forestry District, Japan',
    thermalConductivity: '0.11 W/m·K',
    embodiedCarbon: '-14.2 kgCO₂e/m² (biogenic)',
    acousticRating: '0.35 NRC',
    application: 'Ventilated rainscreen facades, solar shading fins, and courtyard soffits.',
    notes:
      'Kiln-charred using traditional Yakisugi surface carbonization, creating a naturally rot-resistant, Class-A flame-spread exterior skin that requires zero chemical sealants.',
  },
  {
    id: 'low-carbon-concrete',
    name: 'Board-Formed Slag Concrete',
    classification: 'Primary Retaining & Thermal Mass',
    origin: 'Aargau Quarry & Cement Works, Switzerland',
    thermalConductivity: '1.35 W/m·K',
    embodiedCarbon: '148 kgCO₂e/m² (-42% vs. OPC)',
    acousticRating: '0.05 NRC',
    application: 'Hillside retaining walls, radiant hydronic floor slabs, and structural cores.',
    notes:
      'Formulated with 55% ground granulated blast-furnace slag and recycled aggregate, cast against rough-sawn Douglas fir boards to transfer timber grain onto the cured surface.',
  },
  {
    id: 'honed-basalt',
    name: 'Honed Alpine Basalt',
    classification: 'Load-Bearing Masonry & Paving',
    origin: 'Valais Alpine Quarry, Switzerland',
    thermalConductivity: '1.80 W/m·K',
    embodiedCarbon: '62 kgCO₂e/m²',
    acousticRating: '0.08 NRC',
    application: 'Coastal bathhouses, museum plinths, and heated stone thresholds.',
    notes:
      'Dense volcanic stone honed to a matte 220-grit finish. Impervious to freeze-thaw cycles and marine salt spray while offering high specific heat capacity.',
  },
  {
    id: 'brushed-bronze',
    name: 'Brushed Architectural Bronze',
    classification: 'Fenestration & Custom Hardware',
    origin: 'Recycled European Foundry Alloy',
    thermalConductivity: '58.0 W/m·K (thermally broken)',
    embodiedCarbon: '94 kgCO₂e/m² (85% recycled)',
    acousticRating: 'N/A (Structural Mullion)',
    application: 'Thermally broken window mullions, pivot door pulls, and drip flashings.',
    notes:
      'Extruded with polyamide thermal breaks and hand-rubbed with microcrystalline wax, developing a uniform dark umber patina over decades of exposure.',
  },
];

export const JOURNAL_ESSAYS: JournalEssay[] = [
  {
    id: 'daylight-as-structural-material',
    title: 'Daylight as a Structural Material in Northern Latitudes',
    category: 'Research',
    date: 'October 2026',
    readTime: '6 min read',
    excerpt:
      'How prismatic roof geometry and honed limestone surfaces eliminate artificial lighting during 82% of gallery operating hours.',
    paragraphs: [
      'In latitudes above 47 degrees north, winter daylight is brief, low-angled, and predominantly diffuse. Conventional museum design treats this scarcity as a liability, sealing galleries behind opaque roofs and relying on continuous artificial track lighting.',
      'At the Kunsthalle Limmat North Wing in Zurich, we inverted this assumption. By modeling sky-dome luminance across 8,760 hours of the year, our team calibrated a steel diagrid roof with north-facing prismatic clerestories that capture zenithal sky light while rejecting direct southern glare.',
      'Paired with honed Jura limestone walls—chosen for their 64% diffuse light reflectance—the galleries achieve a consistent 5.8% Daylight Factor. Visitors experience subtle shifts in cloud cover and seasonal color temperature without exposing sensitive works on paper to ultraviolet degradation.',
    ],
  },
  {
    id: 'timber-joinery-without-steel',
    title: 'Reversible Timber Joinery for Century-Scale Buildings',
    category: 'Engineering',
    date: 'August 2026',
    readTime: '5 min read',
    excerpt:
      'Lessons from 17th-century Japanese temple carpentry applied to modern CNC-milled cross-laminated timber.',
    paragraphs: [
      'Most contemporary mass-timber buildings rely on epoxy-grouted steel rods and ratusan of self-tapping screws. While structurally efficient, adhesive-bonded connections make future disassembly or component replacement nearly impossible.',
      'Working between our Kyoto and Portland studios, we have adapted traditional Kanawa-tsugi scarf joints and wedged mortise-and-tenon connections for 5-axis CNC fabrication in Douglas fir glulam.',
      'By pre-stressing timber-to-timber connections with kiln-dried white oak wedges, our frames achieve full moment resistance without synthetic resins—allowing every beam and floor cassette to be unbolted, inspected, or relocated at the end of a building’s first century.',
    ],
  },
  {
    id: 'thermal-mass-and-night-flushing',
    title: 'Passive Cooling Through Exposed Slag Concrete & Night Flushing',
    category: 'Sustainability',
    date: 'June 2026',
    readTime: '4 min read',
    excerpt:
      'Replacing energy-intensive chillers with automated clerestory louvers and high-slag thermal mass slabs.',
    paragraphs: [
      'As summer peak temperatures rise across Central Europe and the Pacific Northwest, commercial buildings face mounting cooling loads. Mechanical chillers not only consume peak grid electricity but also exhaust waste heat into urban microclimates.',
      'In our Willamette Mass-Timber Atelier, we paired lightweight CLT floor panels with a 120mm topping slab of low-carbon slag concrete. During occupied hours, the slab absorbs internal heat gains from workstations and studio equipment.',
      'At night, automated clerestory louvers open when outdoor temperatures drop below 18°C, drawing cool river air across the exposed concrete soffits and purging stored heat before morning arrival.',
    ],
  },
];
