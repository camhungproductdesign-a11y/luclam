// ==========================================================================
// Default Premium Visual Media (Images and Videos) for Saigon Guide
// ==========================================================================

export interface PlaceMedia {
  img: string;
  video: string;
}

export const defaultMedia: Record<string, PlaceMedia> = {
  // --- FOOD ---
  // Pho
  "food-0-0": {
    img: "/uploads/external/070237d365a1.jpg",
    video: "https://www.tiktok.com/@maytinhsgn/video/7626240228788833544"
  },
  "food-0-1": {
    img: "https://images.unsplash.com/photo-1625220194771-7ebedd0b7d10?auto=format&fit=crop&w=800&q=80",
    video: ""
  },
  "food-0-2": {
    img: "https://images.unsplash.com/photo-1634149737683-897903eeac35?auto=format&fit=crop&w=800&q=80",
    video: ""
  },
  // Banh Mi
  "food-1-0": {
    img: "/uploads/external/83fd016f33a8.jpg",
    video: ""
  },
  "food-1-1": {
    img: "/uploads/external/63e097cd5edc.jpg",
    video: ""
  },
  "food-1-2": {
    img: "/uploads/external/a4419c1d52ed.jpg",
    video: ""
  },
  // Com Tam
  "food-2-0": {
    img: "/uploads/external/fa2e55bb77b9.jpg",
    video: ""
  },
  "food-2-1": {
    img: "/uploads/external/86e8394d0989.jpg",
    video: ""
  },
  "food-2-2": {
    img: "/uploads/external/b79df3e27783.jpg",
    video: ""
  },
  // Cafe
  "food-3-0": {
    img: "/uploads/external/9644f86a7b5e.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-coffee-dripping-from-a-filter-43093-large.mp4"
  },
  "food-3-1": {
    img: "/uploads/external/aec1207e6554.jpg",
    video: ""
  },
  "food-3-2": {
    img: "/uploads/external/e6e6279b9ff6.jpg",
    video: ""
  },
  // Seafood / Beer
  "food-4-0": {
    img: "/uploads/external/5d49c81dc807.jpg",
    video: ""
  },
  "food-4-1": {
    img: "/uploads/external/d06e10e91ce6.jpg",
    video: ""
  },
  "food-4-2": {
    img: "/uploads/external/33679cf1e5a9.jpg",
    video: ""
  },

  // --- STAY ---
  "stay-0": {
    img: "/uploads/external/3e82fbf24e8d.jpg",
    video: ""
  },
  "stay-1": {
    img: "/uploads/external/1257bbfbccfb.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-dripping-oil-on-massage-stones-in-a-spa-treatment-41666-large.mp4"
  },
  "stay-2": {
    img: "/uploads/external/de0c1acc0e4c.jpg",
    video: ""
  },

  // --- CULTURE ---
  "culture-0": {
    img: "/uploads/external/5eae9e5b58fa.jpg",
    video: ""
  },
  "culture-1": {
    img: "/uploads/external/ef3b0ad325be.jpg",
    video: ""
  },
  "culture-2": {
    img: "/uploads/external/b08281fd0cd8.jpg",
    video: ""
  },
  "culture-3": {
    img: "https://images.unsplash.com/photo-1596422846543-75c6fc1f7f43?auto=format&fit=crop&w=800&q=80",
    video: ""
  },
  "culture-4": {
    img: "/uploads/external/e9ecdbb6aaef.jpg",
    video: ""
  },
  // Street performers on Nguyễn Huệ at night — the living statues the entry is
  // about, not a daytime view of the boulevard. CC0, choi kwangmo, via
  // Wikimedia Commons; see public/uploads/external/CREDITS.json.
  "culture-15": {
    img: "/uploads/external/88a32c12ebb3.jpg",
    video: ""
  },

  // --- SHOPPING ---
  "shopping-0": {
    img: "/uploads/external/24f78b813a4f.jpg",
    video: ""
  },
  "shopping-1": {
    img: "/uploads/external/281474115b74.jpg",
    video: ""
  },
  "shopping-2": {
    img: "/uploads/external/df6ae223bb5a.jpg",
    video: ""
  }
};

// Selection of beautiful premium Saigon stock video loops that users can quickly pick
export const videoPresets = [
  {
    name: "Coffee Dripping (Simmering)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-coffee-dripping-from-a-filter-43093-large.mp4",
    category: "Cafe / Sữa Đá"
  },
  {
    name: "Aromatic Hot Stone Therapy",
    url: "https://assets.mixkit.co/videos/preview/mixkit-dripping-oil-on-massage-stones-in-a-spa-treatment-41666-large.mp4",
    category: "Spa / Herbal"
  },
  {
    name: "Pouring Hot Tea Cup",
    url: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-tea-into-a-glass-cup-43075-large.mp4",
    category: "Cafe / Teahouse"
  },
  {
    name: "Fresh Snails / Sizzling Seafood",
    url: "https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-seafood-in-a-pan-40507-large.mp4",
    category: "Seafood"
  },
  {
    name: "Splashing Ice Coffee",
    url: "https://assets.mixkit.co/videos/preview/mixkit-pouring-iced-coffee-into-a-glass-42171-large.mp4",
    category: "Cafe / Sữa Đá"
  },
  {
    name: "Scenic River Traffic Flow",
    url: "https://assets.mixkit.co/videos/preview/mixkit-boats-sailing-down-a-wide-river-42938-large.mp4",
    category: "General"
  }
];

export const imagePresets = [
  {
    name: "Traditional Pho Soup",
    url: "/uploads/external/070237d365a1.jpg"
  },
  {
    name: "Gourmet Crispy Banh Mi",
    url: "/uploads/external/83fd016f33a8.jpg"
  },
  {
    name: "Charcoal Grilled Pork Broken Rice",
    url: "/uploads/external/b79df3e27783.jpg"
  },
  {
    name: "Classic Saigon Milk Iced Coffee",
    url: "/uploads/external/9644f86a7b5e.jpg"
  },
  {
    name: "Steaming Snails with Lemongrass",
    url: "/uploads/external/5d49c81dc807.jpg"
  },
  {
    name: "Cozy Wellness Spa Ambience",
    url: "/uploads/external/1257bbfbccfb.jpg"
  },
  {
    name: "Lush French Colonial Boutique Room",
    url: "/uploads/external/3e82fbf24e8d.jpg"
  },
  {
    name: "Majestic Saigon Post Office Face",
    url: "/uploads/external/5eae9e5b58fa.jpg"
  },
  {
    name: "Vibrant Ben Thanh Market Gateway",
    url: "/uploads/external/24f78b813a4f.jpg"
  }
];
