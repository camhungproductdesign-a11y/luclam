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
    img: "/uploads/external/pho-hoa-pasteur.jpg",
    // The TikTok that sat here was @maytinhsgn — a computer shop advertising a
    // Lenovo desktop, attached to a phở restaurant. Presumably pasted while
    // testing the video field and committed by accident.
    video: ""
  },
  // Bowls of phở, vendored CC0 from Wikimedia Commons and checked by eye. They
  // are representative rather than photographs of these shops, which is the
  // trade-off for showing something instead of a placeholder. Chosen to match
  // what each listing claims: the plain bowl for the northern kitchen, the one
  // served with a herb plate for the southern.
  //
  // Two candidates were rejected for the reason this guide already has a
  // problem with: one was shot through a window onto a European street, which
  // is a phở shop abroad, not Saigon.
  //
  // The Unsplash URLs that used to sit on the next two answer 404 at source, so
  // both were rendering the placeholder anyway.
  "food-0-1": {
    img: "/uploads/external/pho-viet-nam.jpg",
    video: ""
  },
  "food-0-2": {
    img: "/uploads/external/pho-dau.jpg",
    video: ""
  },
  "food-0-3": {
    img: "/uploads/external/pho-le.jpg",
    video: ""
  },
  "food-0-4": {
    img: "/uploads/external/pho-phu-vuong.jpg",
    video: ""
  },
  // Banh Mi
  "food-1-0": {
    img: "/uploads/external/banh-mi-huynh-hoa.jpg",
    video: ""
  },
  "food-1-1": {
    img: "/uploads/external/banh-mi-bay-ho.jpg",
    video: ""
  },
  "food-1-2": {
    img: "/uploads/external/banh-mi-hong-hoa.jpg",
    video: ""
  },
  "food-1-3": {
    img: "/uploads/external/banh-mi-nhu-lan.jpg",
    video: ""
  },
  // Cafe — nhom 2 la Saigon Coffee, khong phai com tam
  "food-2-0": {
    img: "/uploads/external/cong-ca-phe.jpg",
    video: ""
  },
  "food-2-1": {
    img: "/uploads/external/ca-phe-vot-phan-dinh-phung.jpg",
    video: ""
  },
  "food-2-2": {
    img: "/uploads/external/ca-phe-vy.jpg",
    video: ""
  },
  "food-2-3": {
    img: "/uploads/external/cheo-leo-cafe.jpg",
    video: ""
  },
  // Com Tam — nhom 3, khong phai cafe
  "food-3-0": {
    img: "/uploads/external/com-tam-ba-ghien.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-coffee-dripping-from-a-filter-43093-large.mp4"
  },
  "food-3-1": {
    img: "/uploads/external/com-tam-thuan-kieu.jpg",
    video: ""
  },
  "food-3-2": {
    img: "/uploads/external/com-tam-moc.jpg",
    video: ""
  },
  "food-3-3": {
    img: "/uploads/external/com-tam-nguyen-van-cu.jpg",
    video: ""
  },
  "food-3-4": {
    img: "/uploads/external/com-tam-kieu-giang.jpg",
    video: ""
  },
  // Food Complexes — khu am thuc, khong phai hai san
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
  "food-4-3": {
    img: "/uploads/external/vinh-khanh-food-street.jpg",
    video: ""
  },
  "food-4-4": {
    img: "/uploads/external/bui-vien-walking-street.jpg",
    video: ""
  },

  // --- STAY ---
  "stay-0": {
    img: "/uploads/external/boutique-hotels.jpg",
    video: ""
  },
  "stay-1": {
    img: "/uploads/external/spa-herbal-wash.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-dripping-oil-on-massage-stones-in-a-spa-treatment-41666-large.mp4"
  },
  "stay-2": {
    img: "/uploads/external/hidden-cafes-tea.jpg",
    video: ""
  },

  // --- CULTURE ---
  "culture-0": {
    img: "/uploads/external/saigon-central-post-office.jpg",
    video: ""
  },
  "culture-1": {
    img: "/uploads/external/independence-palace.jpg",
    video: ""
  },
  "culture-2": {
    img: "/uploads/external/b08281fd0cd8.jpg",
    video: ""
  },
  // The Unsplash URL that used to sit here answers 404 at source, so this entry
  // rendered the placeholder. Replaced with the building itself: CC BY 2.0, via
  // Wikimedia Commons; see public/uploads/external/CREDITS.json.
  "culture-3": {
    img: "/uploads/external/saigon-opera-house.jpg",
    video: ""
  },
  "culture-4": {
    img: "/uploads/external/war-remnants-museum.jpg",
    video: ""
  },
  // Street performers on Nguyễn Huệ at night — the living statues the entry is
  // about, not a daytime view of the boulevard. CC0, choi kwangmo, via
  // Wikimedia Commons; see public/uploads/external/CREDITS.json.
  // Flower market. This is the flower section of Bến Thành rather than Hồ Thị
  // Kỷ itself — Commons files the only images under that name to a food tour
  // that passed through, and they are a charcoal grill and a selfie in the
  // alley. A Saigon flower market it is; that market it is not.
  "culture-17": {
    img: "/uploads/external/ho-thi-ky-flower-market.jpg",
    video: ""
  },
  "culture-15": {
    img: "/uploads/external/nguyen-hue-street-performances.jpg",
    video: ""
  },

  // --- SHOPPING ---
  "shopping-0": {
    img: "/uploads/external/ben-thanh-market.jpg",
    video: ""
  },
  "shopping-1": {
    img: "/uploads/external/281474115b74.jpg",
    video: ""
  },
  "shopping-2": {
    img: "/uploads/external/the-new-playground.jpg",
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
    url: "/uploads/external/pho-hoa-pasteur.jpg"
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
    url: "/uploads/external/cong-ca-phe.jpg"
  },
  {
    name: "Steaming Snails with Lemongrass",
    url: "/uploads/external/5d49c81dc807.jpg"
  },
  {
    name: "Cozy Wellness Spa Ambience",
    url: "/uploads/external/spa-herbal-wash.jpg"
  },
  {
    name: "Lush French Colonial Boutique Room",
    url: "/uploads/external/boutique-hotels.jpg"
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
