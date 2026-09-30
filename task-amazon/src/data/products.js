// Mock product catalog. Images are placeholder photos (picsum.photos) keyed by a
// stable seed string so each product always gets the same image.
export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Kitchen",
  "Grocery",
  "Sports",
  "Stationery",
];

export const products = [
  // Electronics / Audio
  { id: 1, title: "boAt Rockerz 255 Pro+ Bluetooth Neckband", category: "Electronics", brand: "boAt", price: 799, mrp: 1990, rating: 4.2, reviews: 45210, image: "https://picsum.photos/seed/boat255/600/600", bestSeller: true, boughtLastMonth: "1K+", colors: ["Black", "Teal", "Red"] },
  { id: 2, title: "Boult Audio Z20 Truly Wireless Earbuds", category: "Electronics", brand: "Boult", price: 899, mrp: 2999, rating: 4.0, reviews: 12890, image: "https://picsum.photos/seed/boultz20/600/600", boughtLastMonth: "500+", colors: ["Black", "White"] },
  { id: 3, title: "Noise Buds VS104 TWS Earbuds", category: "Electronics", brand: "Noise", price: 699, mrp: 1499, rating: 3.9, reviews: 8342, image: "https://picsum.photos/seed/noisevs104/600/600", boughtLastMonth: "300+" },
  { id: 4, title: "Zebronics Zeb-Thunder Bluetooth Speaker", category: "Electronics", brand: "Zebronics", price: 999, mrp: 1999, rating: 4.1, reviews: 5210, image: "https://picsum.photos/seed/zebthunder/600/600", boughtLastMonth: "200+" },
  { id: 5, title: "SanDisk Extreme 1TB Portable External SSD, 1050MB/s R, 1000MB/s W, 3m Drop Protection, IP65 Water/dust Resistant, PC,MAC & TypeC Smartphone Compatible, 5Y Warranty, Black Color", category: "Electronics", brand: "SanDisk", price: 19999, mrp: 24999, rating: 4.5, reviews: 81873, image: "https://picsum.photos/seed/sandisk1tb/600/600", bestSeller: true, amazonsChoice: true, boughtLastMonth: "400+" },
  { id: 6, title: "Samsung T7 1TB Portable SSD, USB 3.2 Gen2 External SSD", category: "Electronics", brand: "Samsung", price: 24799, mrp: 39199, rating: 4.4, reviews: 27190, image: "https://picsum.photos/seed/samsungt7/600/600", boughtLastMonth: "1K+" },
  { id: 7, title: "SanDisk 128GB EVO Plus microSDXC Card A2 V30", category: "Electronics", brand: "SanDisk", price: 799, mrp: 1499, rating: 4.6, reviews: 33210, image: "https://picsum.photos/seed/sandisk128/600/600", boughtLastMonth: "2K+" },
  { id: 25, title: "JBL Tune 760NC Wireless Over-Ear Headphones", category: "Electronics", brand: "JBL", price: 3499, mrp: 5999, rating: 4.3, reviews: 9821, image: "https://picsum.photos/seed/jbl760nc/600/600", boughtLastMonth: "300+" },
  { id: 26, title: "SanDisk Ultra Dual Drive Go 64GB Pen Drive Type-C", category: "Electronics", brand: "SanDisk", price: 549, mrp: 999, rating: 4.4, reviews: 15600, image: "https://picsum.photos/seed/sandiskpen/600/600" },

  // Fashion
  { id: 8, title: "Leotude Men's Graphic Print Oversized T-Shirt", category: "Fashion", brand: "Leotude", price: 349, mrp: 999, rating: 4.0, reviews: 2103, image: "https://picsum.photos/seed/leotudetee/600/600", colors: ["Blue", "Black", "Grey"] },
  { id: 9, title: "Men's Slim Fit Zipper Polo T-Shirt", category: "Fashion", brand: "Generic", price: 499, mrp: 1299, rating: 4.1, reviews: 1560, image: "https://picsum.photos/seed/polotee/600/600", colors: ["Black", "Navy", "White"] },
  { id: 10, title: "Puma Smash Leather Sneakers", category: "Fashion", brand: "Puma", price: 2199, mrp: 3999, rating: 4.3, reviews: 9021, image: "https://picsum.photos/seed/pumasmash/600/600", bestSeller: true },
  { id: 11, title: "Men's Superhero Print Cotton Boxer Shorts", category: "Fashion", brand: "Generic", price: 249, mrp: 599, rating: 4.0, reviews: 780, image: "https://picsum.photos/seed/ironmanboxer/600/600" },
  { id: 12, title: "Women's Casual Tote Handbag", category: "Fashion", brand: "Generic", price: 899, mrp: 1999, rating: 3.9, reviews: 640, image: "https://picsum.photos/seed/handbag1/600/600" },
  { id: 27, title: "Men's Cotton Casual Shacket Jacket", category: "Fashion", brand: "Generic", price: 799, mrp: 1799, rating: 4.0, reviews: 430, image: "https://picsum.photos/seed/shacket1/600/600", colors: ["Mustard", "Olive"] },

  // Home
  { id: 13, title: "Floral Print Cotton Bedsheet with 2 Pillow Covers, King Size", category: "Home", brand: "Bazaar", price: 549, mrp: 1299, rating: 4.2, reviews: 3200, image: "https://picsum.photos/seed/bedsheet1/600/600" },
  { id: 14, title: "Stainless Steel Insulated Water Bottle 1L, 24Hrs Hot/Cold", category: "Home", brand: "Solimo", price: 349, mrp: 799, rating: 4.3, reviews: 5600, image: "https://picsum.photos/seed/steelbottle/600/600" },
  { id: 17, title: "5-Step Foldable Aluminium Ladder", category: "Home", brand: "Generic", price: 2299, mrp: 3999, rating: 4.2, reviews: 940, image: "https://picsum.photos/seed/ladder5/600/600" },
  { id: 28, title: "6-Socket Extension Board with Individual Switches", category: "Home", brand: "GM", price: 449, mrp: 899, rating: 4.3, reviews: 2870, image: "https://picsum.photos/seed/extensionboard/600/600" },
  { id: 29, title: "Warm White LED Star String Fairy Lights, 10m", category: "Home", brand: "Generic", price: 199, mrp: 499, rating: 4.1, reviews: 1290, image: "https://picsum.photos/seed/fairylights/600/600" },

  // Kitchen
  { id: 15, title: "Non-Stick 3-in-1 Grill, Fry & Cook Pan", category: "Kitchen", brand: "Generic", price: 899, mrp: 1999, rating: 4.1, reviews: 2100, image: "https://picsum.photos/seed/grillpan/600/600" },
  { id: 16, title: "Electric Soup & Milk Boiler Maker, 1.5L", category: "Kitchen", brand: "Generic", price: 1499, mrp: 2499, rating: 4.0, reviews: 1890, image: "https://picsum.photos/seed/soupmaker/600/600" },
  { id: 30, title: "Stainless Steel Insulated Casserole 1.5L", category: "Kitchen", brand: "Generic", price: 649, mrp: 1299, rating: 4.4, reviews: 3100, image: "https://picsum.photos/seed/casserole1/600/600" },

  // Grocery
  { id: 18, title: "Surf Excel Easy Wash Detergent Powder, 1kg", category: "Grocery", brand: "Surf Excel", price: 129, mrp: 159, rating: 4.5, reviews: 12000, image: "https://picsum.photos/seed/surfexcel/600/600" },
  { id: 19, title: "Tata Tea Premium, 1kg Pack", category: "Grocery", brand: "Tata", price: 470, mrp: 540, rating: 4.6, reviews: 24000, image: "https://picsum.photos/seed/tatatea/600/600" },
  { id: 20, title: "Premium Whole Cashews, 500g", category: "Grocery", brand: "Generic", price: 449, mrp: 699, rating: 4.4, reviews: 3400, image: "https://picsum.photos/seed/cashews500/600/600" },
  { id: 21, title: "Raw Chia Seeds, 200g", category: "Grocery", brand: "Generic", price: 199, mrp: 349, rating: 4.3, reviews: 2100, image: "https://picsum.photos/seed/chiaseeds/600/600" },
  { id: 31, title: "Nescafe Classic Instant Coffee, 100g Jar", category: "Grocery", brand: "Nescafe", price: 379, mrp: 429, rating: 4.5, reviews: 18700, image: "https://picsum.photos/seed/nescafejar/600/600" },

  // Sports
  { id: 22, title: "Mountain Bike Cycling Helmet with Visor", category: "Sports", brand: "Generic", price: 599, mrp: 1299, rating: 4.1, reviews: 780, image: "https://picsum.photos/seed/cyclehelmet/600/600" },
  { id: 23, title: "Yonex Nanoflare Badminton Racquet", category: "Sports", brand: "Yonex", price: 1299, mrp: 2499, rating: 4.4, reviews: 4300, image: "https://picsum.photos/seed/yonexracquet/600/600" },
  { id: 32, title: "Anti-Slip Yoga Mat with Carry Strap, 6mm", category: "Sports", brand: "Symactive", price: 449, mrp: 999, rating: 4.2, reviews: 3600, image: "https://picsum.photos/seed/yogamat/600/600" },

  // Stationery
  { id: 24, title: "Classmate Pulse Notebook, Pack of 5, 172 Pages", category: "Stationery", brand: "Classmate", price: 249, mrp: 399, rating: 4.5, reviews: 6700, image: "https://picsum.photos/seed/classmatenb/600/600" },
  { id: 33, title: "Cello Bling Gel Pens, Pack of 5", category: "Stationery", brand: "Cello", price: 99, mrp: 175, rating: 4.3, reviews: 4100, image: "https://picsum.photos/seed/cellopens/600/600" },
];

export const getProductById = (id) => products.find((p) => p.id === Number(id));

export const getProductsByCategory = (category) =>
  products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());

export const searchProducts = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
};
