// Product interface
export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  sale?: boolean;
  image: string;
  category: string;
  description?: string;
  tags?: string[];
}

// Products data
export const products: Product[] = [
  {
    id: 1,
    name: "TrainTech Performance Tee",
    price: 49.99,
    salePrice: 39.99,
    sale: true,
    image: "https://m.media-amazon.com/images/I/713URWf3l1S._AC_UL1500_.jpg",
    category: "Men's",
    description: "Breathable performance t-shirt with moisture-wicking technology for intense workouts.",
    tags: ["t-shirt", "performance", "men", "top", "workout", "gym"]
  },
  {
    id: 2,
    name: "FlexFit Training Shorts",
    price: 59.99,
    image: "https://i5.walmartimages.com/asr/21d42286-b9cb-463c-b921-5bc6f2095796.6df7879254f461fa10da26cd36ad2bea.jpeg",
    category: "Men's",
    description: "Flexible and durable training shorts perfect for any workout or casual wear.",
    tags: ["shorts", "men", "bottom", "training", "workout", "gym"]
  },
  {
    id: 3,
    name: "AeroFlow Sports Bra",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Women's",
    description: "High-support sports bra with breathable fabric for maximum comfort during workouts.",
    tags: ["sports bra", "women", "top", "training", "workout", "gym", "support"]
  },
  {
    id: 4,
    name: "StrideFlex Running Shoes",
    price: 129.99,
    salePrice: 99.99,
    sale: true,
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Footwear",
    description: "Lightweight and responsive running shoes with advanced cushioning technology.",
    tags: ["shoes", "footwear", "running", "training", "workout"]
  }
]; 