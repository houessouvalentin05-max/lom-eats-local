export type Category = "street" | "maquis" | "restaurant" | "patisserie" | "cafe";

export const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "street", label: "Street food", emoji: "🍢" },
  { id: "maquis", label: "Maquis", emoji: "🍻" },
  { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { id: "patisserie", label: "Pâtisserie", emoji: "🥐" },
  { id: "cafe", label: "Café", emoji: "☕" },
];

export type PriceRange = "$" | "$$" | "$$$";

export interface Review {
  id: string;
  spot_id: string;
  user_name: string;
  avatar?: string;
  rating: number;
  text: string;
  visited_tag: boolean;
  date: string;
}

export interface Spot {
  id: string;
  name: string;
  category: Category;
  price_range: PriceRange;
  address_description: string;
  neighborhood: string;
  lat: number;
  lng: number;
  photo: string;
  description: string;
  opening_hours: string;
  rating: number;
  review_count: number;
  trending?: boolean;
  added_by: string;
}

export const SPOTS: Spot[] = [
  {
    id: "1",
    name: "Chez Maman Ayaba",
    category: "maquis",
    price_range: "$$",
    address_description: "Adidogomé, en face de la station Total, ruelle à droite",
    neighborhood: "Adidogomé",
    lat: 6.1734,
    lng: 1.1698,
    photo: "/mock/spot-1.jpg",
    description: "Poisson braisé légendaire et riz jollof parfumé. Ambiance familiale et portions généreuses.",
    opening_hours: "12h – 23h · Fermé le lundi",
    rating: 4.7,
    review_count: 128,
    trending: true,
    added_by: "Kofi A.",
  },
  {
    id: "2",
    name: "Foufou d'Akossiwa",
    category: "street",
    price_range: "$",
    address_description: "Bè-Kpota, à côté du marché, sous le grand manguier",
    neighborhood: "Bè",
    lat: 6.1489,
    lng: 1.2401,
    photo: "/mock/spot-2.jpg",
    description: "Foufou avec sauce arachide comme chez grand-mère. Prêt à midi tapant, part vite.",
    opening_hours: "11h – 15h · Lun-Sam",
    rating: 4.9,
    review_count: 84,
    trending: true,
    added_by: "Ama T.",
  },
  {
    id: "3",
    name: "Le Baobab Bleu",
    category: "maquis",
    price_range: "$$",
    address_description: "Agoè-Nyivé, après le carrefour Assiyéyé",
    neighborhood: "Agoè",
    lat: 6.2015,
    lng: 1.2018,
    photo: "/mock/spot-3.jpg",
    description: "Terrasse en plein air, guirlandes lumineuses. Parfait pour un vendredi soir entre amis.",
    opening_hours: "17h – 01h · Tous les jours",
    rating: 4.5,
    review_count: 212,
    added_by: "Yao K.",
  },
  {
    id: "4",
    name: "Crêperie du Golfe",
    category: "restaurant",
    price_range: "$$",
    address_description: "Boulevard du Mono, en face de l'hôtel Palm Beach",
    neighborhood: "Kodjoviakopé",
    lat: 6.1256,
    lng: 1.2088,
    photo: "/mock/spot-4.jpg",
    description: "Crêpes sucrées et salées, cidre importé. Petit-déjeuner face à la mer.",
    opening_hours: "7h – 22h",
    rating: 4.4,
    review_count: 66,
    added_by: "Léa D.",
  },
  {
    id: "5",
    name: "Pâtisserie Kékéli",
    category: "patisserie",
    price_range: "$$",
    address_description: "Hédzranawoé, à côté de la pharmacie du carrefour",
    neighborhood: "Hédzranawoé",
    lat: 6.1801,
    lng: 1.2312,
    photo: "/mock/spot-5.jpg",
    description: "Croissants dorés, pains au chocolat et gâteaux d'anniversaire sur commande.",
    opening_hours: "6h – 20h",
    rating: 4.6,
    review_count: 154,
    trending: true,
    added_by: "Sena M.",
  },
  {
    id: "6",
    name: "Brochettes de Tonton Jo",
    category: "street",
    price_range: "$",
    address_description: "Nyékonakpoè, coin de rue devant le bar Étoile",
    neighborhood: "Nyékonakpoè",
    lat: 6.1345,
    lng: 1.2135,
    photo: "/mock/spot-6.jpg",
    description: "Les meilleures brochettes de mouton de la ville, servies avec piment maison.",
    opening_hours: "19h – 02h",
    rating: 4.8,
    review_count: 301,
    added_by: "Mensah B.",
  },
  {
    id: "7",
    name: "Chez Tantie Akpéné",
    category: "street",
    price_range: "$",
    address_description: "Tokoin Wuiti, derrière l'école primaire",
    neighborhood: "Tokoin",
    lat: 6.1580,
    lng: 1.2196,
    photo: "/mock/spot-7.jpg",
    description: "Koliko (igname frite) et akpan avec sauce tomate épicée. Le déjeuner du quartier.",
    opening_hours: "10h – 16h",
    rating: 4.3,
    review_count: 47,
    added_by: "Adjoa E.",
  },
  {
    id: "8",
    name: "Sika Restaurant",
    category: "restaurant",
    price_range: "$$$",
    address_description: "Quartier administratif, avenue de la Libération",
    neighborhood: "Administratif",
    lat: 6.1382,
    lng: 1.2245,
    photo: "/mock/spot-8.jpg",
    description: "Cuisine africaine revisitée dans un cadre élégant. Réservation conseillée.",
    opening_hours: "12h – 15h · 19h – 23h",
    rating: 4.7,
    review_count: 89,
    added_by: "Emmanuel K.",
  },
  {
    id: "9",
    name: "Café Baguida",
    category: "cafe",
    price_range: "$$",
    address_description: "Baguida plage, sur la route côtière",
    neighborhood: "Baguida",
    lat: 6.1789,
    lng: 1.3105,
    photo: "/mock/spot-9.jpg",
    description: "Café expresso, jus frais et pâtisseries. Le brunch du dimanche est incontournable.",
    opening_hours: "7h – 19h",
    rating: 4.5,
    review_count: 72,
    added_by: "Fatou N.",
  },
];

export const REVIEWS: Review[] = [
  { id: "r1", spot_id: "1", user_name: "Kofi A.", rating: 5, text: "Le poisson braisé est incroyable, la sauce de tomate est parfaite. Je reviens chaque semaine.", visited_tag: true, date: "il y a 3 jours" },
  { id: "r2", spot_id: "1", user_name: "Marie L.", rating: 4, text: "Très bon, mais un peu d'attente le vendredi soir. Ça vaut le coup.", visited_tag: true, date: "il y a 1 semaine" },
  { id: "r3", spot_id: "1", user_name: "Jean P.", rating: 5, text: "Ambiance authentique, prix corrects.", visited_tag: false, date: "il y a 2 semaines" },
  { id: "r4", spot_id: "2", user_name: "Ama T.", rating: 5, text: "Le meilleur foufou d'Adidogomé, sans hésitation.", visited_tag: true, date: "il y a 2 jours" },
  { id: "r5", spot_id: "6", user_name: "Mensah B.", rating: 5, text: "Brochettes juteuses, piment qui réveille. Parfait après une soirée.", visited_tag: true, date: "il y a 5 jours" },
  { id: "r6", spot_id: "5", user_name: "Sena M.", rating: 5, text: "Les croissants du matin sont divins. Arrivez tôt.", visited_tag: true, date: "il y a 4 jours" },
];

export const CURRENT_USER = {
  name: "Koffi Adodo",
  avatar: "KA",
  city: "Lomé",
  bio: "Explorateur de maquis · toujours à la recherche du meilleur poisson braisé.",
  added_spot_ids: ["1", "6"],
  reviewed_spot_ids: ["1", "2"],
  saved_spot_ids: ["3", "5", "8", "9"],
};

export const LOME_CENTER: [number, number] = [6.1600, 1.2200];

export function priceLabel(p: PriceRange) {
  return p;
}

export function categoryOf(id: Category) {
  return CATEGORIES.find((c) => c.id === id)!;
}

export function getSpot(id: string) {
  return SPOTS.find((s) => s.id === id);
}

export function reviewsForSpot(id: string) {
  return REVIEWS.filter((r) => r.spot_id === id);
}