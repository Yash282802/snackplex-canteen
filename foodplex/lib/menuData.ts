export type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: string;
  emoji: string;
  image: string;
  description: string;
  rating: number;
  popular?: boolean;
  spicy?: boolean;
  veg: boolean;
};

export const menuItems: MenuItem[] = [
  // Beverages
  { id: 1, name: "Tea", category: "Beverages", price: 10, quantity: "100ml", emoji: "🍵", image: "/images/menu/1.png", description: "Freshly brewed hot tea", rating: 4.2, veg: true },
  { id: 2, name: "Coffee", category: "Beverages", price: 10, quantity: "100ml", emoji: "☕", image: "/images/menu/2.png", description: "Hot aromatic coffee", rating: 4.5, popular: true, veg: true },
  { id: 3, name: "Cold Drinks", category: "Beverages", price: 0, quantity: "Bottle", emoji: "🥤", image: "/images/menu/3.png", description: "Assorted cold drinks (MRP)", rating: 4.0, veg: true },

  // Snacks
  { id: 4, name: "Samosa", category: "Snacks", price: 15, quantity: "1 Pc (80gm)", emoji: "🥟", image: "/images/menu/4.png", description: "Crispy fried pastry with spiced potato filling", rating: 4.6, popular: true, veg: true },
  { id: 5, name: "Kachodi", category: "Snacks", price: 15, quantity: "1 Pc (80gm)", emoji: "🫓", image: "/images/menu/5.png", description: "Deep fried crispy snack with lentil filling", rating: 4.3, veg: true },
  { id: 6, name: "Aloo Tikki Chaat", category: "Snacks", price: 15, quantity: "1 Pc (80gm)", emoji: "🥔", image: "/images/menu/6.png", description: "Crispy potato patties with tangy chutney and toppings", rating: 4.7, popular: true, veg: true },
  { id: 7, name: "Vada Pav", category: "Snacks", price: 30, quantity: "1 Plate", emoji: "🍔", image: "/images/menu/7.png", description: "Mumbai's iconic street burger with spiced potato fritter", rating: 4.8, popular: true, veg: true },
  { id: 8, name: "Dabeli", category: "Snacks", price: 20, quantity: "1 Pc", emoji: "🌮", image: "/images/menu/8.png", description: "Sweet and spicy Kutchi snack in a bun", rating: 4.4, veg: true },
  { id: 9, name: "Cheese Corn Tikki", category: "Snacks", price: 45, quantity: "1 Plate", emoji: "🌽", image: "/images/menu/9.png", description: "Crispy corn and cheese tikkis with dip", rating: 4.5, popular: true, veg: true },
  { id: 10, name: "Poha", category: "Snacks", price: 15, quantity: "150gm", emoji: "🍚", image: "/images/menu/10.png", description: "Light flattened rice with onions, peanuts and spices", rating: 4.2, veg: true },
  { id: 11, name: "Wafers", category: "Snacks", price: 0, quantity: "Packet", emoji: "🍿", image: "/images/menu/11.png", description: "Crunchy wafers (MRP)", rating: 3.9, veg: true },

  // Maggi
  { id: 12, name: "Masala Maggi", category: "Maggi", price: 30, quantity: "1 Pkt", emoji: "🍜", image: "/images/menu/12.png", description: "Classic Maggi noodles with aromatic masala", rating: 4.6, popular: true, veg: true },
  { id: 13, name: "Veg. Masala Maggi", category: "Maggi", price: 35, quantity: "1 Pkt", emoji: "🥦", image: "/images/menu/13.png", description: "Maggi noodles loaded with fresh vegetables", rating: 4.5, veg: true },
  { id: 14, name: "Cheese Masala Maggi", category: "Maggi", price: 40, quantity: "1 Pkt", emoji: "🧀", image: "/images/menu/14.png", description: "Gooey cheese topped masala Maggi", rating: 4.7, popular: true, veg: true },
  { id: 15, name: "Veg. Cheese Masala Maggi", category: "Maggi", price: 45, quantity: "1 Pkt", emoji: "🫕", image: "/images/menu/15.png", description: "Veggie Maggi with extra cheese topping", rating: 4.8, popular: true, veg: true },

  // Chinese
  { id: 16, name: "Manchurian Dry", category: "Chinese", price: 70, quantity: "150gm", emoji: "🥢", image: "/images/menu/16.png", description: "Crispy fried veg balls tossed in manchurian sauce", rating: 4.5, popular: true, spicy: true, veg: true },
  { id: 17, name: "Manchurian Gravy", category: "Chinese", price: 70, quantity: "150gm", emoji: "🍲", image: "/images/menu/17.png", description: "Soft veg balls in spicy manchurian gravy", rating: 4.6, spicy: true, veg: true },
  { id: 18, name: "Veg. Noodles", category: "Chinese", price: 70, quantity: "150gm", emoji: "🍝", image: "/images/menu/18.png", description: "Wok-tossed noodles with fresh vegetables", rating: 4.4, veg: true },
  { id: 19, name: "Veg. Fried Rice", category: "Chinese", price: 70, quantity: "150gm", emoji: "🍛", image: "/images/menu/19.png", description: "Fragrant fried rice with mixed vegetables", rating: 4.5, popular: true, veg: true },
  { id: 20, name: "Veg. Pasta", category: "Chinese", price: 50, quantity: "150gm", emoji: "🍝", image: "/images/menu/20.png", description: "Pasta tossed in spicy Indian-Chinese style sauce", rating: 4.3, veg: true },

  // South Indian
  { id: 21, name: "Paper Dosa", category: "South Indian", price: 80, quantity: "1 Plate", emoji: "🫓", image: "/images/menu/21.png", description: "Thin crispy rice crepe served with chutney and sambar", rating: 4.7, popular: true, veg: true },
  { id: 22, name: "Masala Dosa", category: "South Indian", price: 90, quantity: "1 Plate", emoji: "🥙", image: "/images/menu/22.png", description: "Golden dosa stuffed with spiced potato filling", rating: 4.8, popular: true, veg: true },
  { id: 23, name: "Cheese Masala Dosa", category: "South Indian", price: 80, quantity: "1 Plate", emoji: "🧀", image: "/images/menu/23.png", description: "Masala dosa with melted cheese layer", rating: 4.7, veg: true },
  { id: 24, name: "Veg. Utthapam", category: "South Indian", price: 45, quantity: "1 Plate (2 Nos)", emoji: "🥞", image: "/images/menu/24.png", description: "Thick rice pancake topped with vegetables", rating: 4.3, veg: true },
  { id: 25, name: "Idli Sambar", category: "South Indian", price: 60, quantity: "1 PC", emoji: "🍱", image: "/images/menu/25.png", description: "Steamed rice cakes served with hot sambar and chutney", rating: 4.5, veg: true },
  { id: 26, name: "Vermicelli Upma", category: "South Indian", price: 16, quantity: "1 Plate", emoji: "🍜", image: "/images/menu/26.png", description: "Savory semolina noodles with vegetables and spices", rating: 4.0, veg: true },

  // Sandwiches & Burgers
  { id: 27, name: "Veg. Sandwich", category: "Sandwiches", price: 55, quantity: "1 Pc", emoji: "🥪", image: "/images/menu/27.png", description: "Fresh veggies between toasted slices with chutney", rating: 4.2, veg: true },
  { id: 28, name: "Veg. Cheese Sandwich", category: "Sandwiches", price: 45, quantity: "1 Pc", emoji: "🧀", image: "/images/menu/28.png", description: "Sandwich loaded with veggies and melted cheese", rating: 4.4, popular: true, veg: true },
  { id: 29, name: "Cheese Chutney Sandwich", category: "Sandwiches", price: 60, quantity: "1 Pc", emoji: "🌿", image: "/images/menu/29.png", description: "Zesty green chutney and cheese sandwich", rating: 4.6, popular: true, veg: true },
  { id: 30, name: "Veg. Grill Sandwich", category: "Sandwiches", price: 30, quantity: "1 Pc", emoji: "🔥", image: "/images/menu/30.png", description: "Grilled vegetable sandwich with tangy sauce", rating: 4.3, veg: true },
  { id: 31, name: "Veg. Cheese Grill Sandwich", category: "Sandwiches", price: 30, quantity: "1 Pc", emoji: "🧇", image: "/images/menu/31.png", description: "Grilled sandwich with veggies and gooey cheese", rating: 4.5, veg: true },
  { id: 32, name: "Veg. Burger", category: "Sandwiches", price: 60, quantity: "1 Pc", emoji: "🍔", image: "/images/menu/32.png", description: "Soft bun with crispy veg patty, lettuce and sauces", rating: 4.6, popular: true, veg: true },

  // Bread & Paratha
  { id: 33, name: "Bread Butter", category: "Bread & Paratha", price: 16, quantity: "2 Bread Slices", emoji: "🧈", image: "/images/menu/33.png", description: "Fresh bread with generous butter", rating: 3.8, veg: true },
  { id: 34, name: "Bread Jam", category: "Bread & Paratha", price: 40, quantity: "2 Bread Slices", emoji: "🍓", image: "/images/menu/34.png", description: "Soft bread with sweet fruity jam", rating: 3.9, veg: true },
  { id: 35, name: "Mix Veg. Pakoda", category: "Bread & Paratha", price: 50, quantity: "150gm", emoji: "🥗", image: "/images/menu/35.png", description: "Crispy mixed vegetable fritters", rating: 4.4, veg: true },
  { id: 36, name: "Aloo Parantha with Curd", category: "Bread & Paratha", price: 70, quantity: "1 Paratha (150gm)", emoji: "🫓", image: "/images/menu/36.png", description: "Stuffed potato flatbread served with fresh curd", rating: 4.7, popular: true, veg: true },
  { id: 37, name: "Paneer Parantha with Curd", category: "Bread & Paratha", price: 70, quantity: "1 Paratha (150gm)", emoji: "🧀", image: "/images/menu/37.png", description: "Cottage cheese stuffed flatbread with curd", rating: 4.8, popular: true, veg: true },
  { id: 38, name: "Cheese Parantha with Curd", category: "Bread & Paratha", price: 70, quantity: "1 Paratha (150gm)", emoji: "🫕", image: "/images/menu/38.png", description: "Cheese filled paratha, limited availability", rating: 4.9, popular: true, veg: true },

  // Thali
  { id: 39, name: "Veg. Thali", category: "Thali", price: 0, quantity: "1 Kathod, 1 Veg", emoji: "🍽️", image: "/images/menu/39.png", description: "Full veg thali with kathod and vegetables (MRP)", rating: 4.6, popular: true, veg: true },
  { id: 40, name: "Dal Roti Thali", category: "Thali", price: 0, quantity: "1 Dal, 4 Roti, Rice, Salad", emoji: "🥘", image: "/images/menu/40.png", description: "Complete meal with dal, roti, rice and salad (MRP)", rating: 4.7, popular: true, veg: true },

  // Desserts
  { id: 41, name: "Ice Cream", category: "Desserts", price: 0, quantity: "1 Scoop", emoji: "🍦", image: "/images/menu/41.png", description: "Chilled creamy ice cream (MRP)", rating: 4.5, veg: true },
];

export const categories = ["All", "Snacks", "Maggi", "Chinese", "South Indian", "Sandwiches", "Beverages", "Bread & Paratha", "Thali", "Desserts"];
