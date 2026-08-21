// ==========================================================================
// Default Premium Visual Media (Images and Videos) for Saigon Guide
// ==========================================================================

export interface PlaceMedia {
  img: string;
  video: string;
}

/**
 * The cover photograph the guide falls back to, in one place.
 *
 * It was written out at six call sites in App.tsx and, in Creator Studio, not
 * written out at all: the cover URL field fell back to an Unsplash photo that
 * answers 404. So the one screen offering to change the cover was the one
 * screen showing a value that does not exist, and an operator who pressed save
 * without editing it would have stored the dead link as the cover.
 *
 * The cover renderer already defends against exactly that — it ignores any
 * customMedia value containing unsplash.com and uses this file instead. That
 * guard was treating the symptom; this is the cause. The guard stays, because
 * browsers that saved the old value still have it in their own storage and the
 * page should keep rendering for them.
 */
export const DEFAULT_COVER_IMAGE = '/uploads/cover-benthanh.jpg';

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
  // REPRESENTATIVE: a bánh mì, not this shop, and not the pan-fried version
  // it is famous for — Commons has no free photograph of bánh mì chảo. Same
  // trade-off as the phở bowls above.
  "food-1-4": {
    img: "/uploads/external/c0da12ca8c8e.jpg",
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
  // REPRESENTATIVE: a phin dripping. Chosen over a sharper frame that carried
  // a rival chain’s logo.
  "food-2-4": {
    img: "/uploads/external/5f28da8e0271.jpg",
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

  // Eighteen entries added at once, every one looked at before it was kept.
  // Wikimedia Commons, free licences only; run npm run media:fetch to vendor
  // them and npm run media:credits to fill in attribution.
  //
  // Four searches came back with nothing usable and were thrown away rather
  // than settled for: the History Museum returned the Reichstag in Berlin, the
  // metro returned flyovers, and Củ Chi returned a souvenir stall of spent
  // cartridges twice over. Củ Chi is therefore still without an image — a
  // landmark card carrying the wrong photograph is worse than one carrying
  // none, which is the standing this file already takes.
  // A Cham Lokesvara from Trà Vinh, which is a signature holding of this
  // museum rather than its facade. Commons has the building only in
  // colonial-era black and white.
  "culture-5": {
    img: "/uploads/external/eaee2700adda.jpg",
    video: ""
  },
  "culture-6": {
    img: "/uploads/external/aed5796d0db4.jpg",
    video: ""
  },
  // Chosen over three others that show restoration scaffolding and cranes.
  "culture-7": {
    img: "/uploads/external/6ae4cab5b5ae.jpg",
    video: ""
  },
  "culture-8": {
    img: "/uploads/external/af99d39636cf.jpg",
    video: ""
  },
  "culture-9": {
    img: "/uploads/external/db6c1644a693.jpg",
    video: ""
  },
  "culture-10": {
    img: "/uploads/external/448a88a219d3.jpg",
    video: ""
  },
  // The temple gate rather than the roof ceramics, which are beautiful and
  // unreadable at card size.
  "culture-11": {
    img: "/uploads/external/47c29d13e5d9.jpg",
    video: ""
  },
  // Daylight from across the river: the night shots lose the tower against
  // black.
  "culture-12": {
    img: "/uploads/external/b7fdcd910ad2.jpg",
    video: ""
  },
  // Line 1 rolling stock at Bến Thành, February 2025.
  "culture-13": {
    img: "/uploads/external/d63f01b011e1.jpg",
    video: ""
  },
  // The People's Committee building seen from the boulevard at night, which
  // is the view the entry is about.
  "culture-14": {
    img: "/uploads/external/7ca5b32a2420.jpg",
    video: ""
  },
  "culture-16": {
    img: "/uploads/external/deac69088bb8.jpg",
    video: ""
  },
  // REPRESENTATIVE, not the venue: this is the Thăng Long theatre in Hà Nội.
  // Commons has no free photograph of the Rồng Vàng stage, and a water puppet
  // stage is what the entry is selling.
  "culture-18": {
    img: "/uploads/external/c64f75bdc5d0.jpg",
    video: ""
  },
  // The wall of motorbikes, which is the thing being described.
  "culture-19": {
    img: "/uploads/external/f397366d2e6b.jpg",
    video: ""
  },
  "culture-20": {
    img: "/uploads/external/1164e233e181.jpg",
    video: ""
  },
  // REPRESENTATIVE: mangrove and a river channel, filed on Commons under a
  // river name rather than Cần Giờ, so it stands for the landscape rather
  // than proving the location.
  "culture-22": {
    img: "/uploads/external/21b318a7d02e.jpg",
    video: ""
  },
  "culture-23": {
    img: "/uploads/external/f523cfc35a40.jpg",
    video: ""
  },
  // The lily pond and the Hùng King temple gate, which is what makes this
  // park recognisable.
  "culture-24": {
    img: "/uploads/external/009f67e1c0ab.jpg",
    video: ""
  },
  "culture-25": {
    img: "/uploads/external/40f9c8e6e590.jpg",
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
