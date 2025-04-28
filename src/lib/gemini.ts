import { GoogleGenerativeAI } from '@google/generative-ai';
import { OrderPlaced } from '@/lib/supabase';
import emailjs from 'emailjs-com';

// Initialize the Google Generative AI with the API key
const GOOGLE_API_KEY = "KEY_HERE";
const MODEL_NAME = "models/gemini-2.0-flash";

// EmailJS configuration
const EMAILJS_SERVICE_ID = "KEY_HERE"; 
const EMAILJS_TEMPLATE_ID = "KEY_HERE"; 
const EMAILJS_PUBLIC_KEY = "KEY_HERE";

// Initialize EmailJS
if (typeof window !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Create and export the API client
export const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
export const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// List of available products
export const AVAILABLE_PRODUCTS = [
  "TrainTech Performance Tee",
  "FlexFit training shorts",
  "Aeroflow sports bra",
  "StrideFlex Running shoe"
];

// Product details with prices
export const PRODUCT_DETAILS = {
  "TrainTech Performance Tee": {
    price: 34.99,
    description: "Moisture-wicking, breathable performance t-shirt for training.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  "FlexFit training shorts": {
    price: 39.99,
    description: "Lightweight, flexible shorts with 4-way stretch technology.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  "Aeroflow sports bra": {
    price: 49.99,
    description: "High-support sports bra with cooling mesh panels.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  "StrideFlex Running shoe": {
    price: 129.99,
    description: "Responsive cushioning and flexible support for runners.",
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"]
  }
};

// Check if a product is available
export function isProductAvailable(product: string): boolean {
  return AVAILABLE_PRODUCTS.some(
    p => p.toLowerCase() === product.toLowerCase()
  );
}

// Helper function to find a product by partial name
export function findProductByName(partialName: string): string | null {
  const lowerPartialName = partialName.toLowerCase();
  
  return AVAILABLE_PRODUCTS.find(
    p => p.toLowerCase().includes(lowerPartialName)
  ) || null;
}

// Generate a response using Gemini
export async function generateResponse(
  userQuery: string, 
  orderContext?: string
): Promise<string> {
  try {
    // First check if it's a greeting
    const greetingPatterns = [
      /^hi\b/i, /^hello\b/i, /^hey\b/i, /^greetings/i, /^good morning/i, 
      /^good afternoon/i, /^good evening/i, /^howdy/i, /^what's up/i
    ];
    
    if (greetingPatterns.some(pattern => pattern.test(userQuery.trim()))) {
      return "Hello! I'm your shopping assistant. I can help you place an order for our fitness apparel or track an existing order. What would you like to do today?";
    }
    
    const prompt = `
You are a helpful shopping assistant for a fitness apparel store. 
Be friendly, helpful, and concise. Keep responses under 150 words.
IMPORTANT: You can ONLY help with placing orders for: TrainTech Performance Tee, FlexFit training shorts, Aeroflow sports bra, and StrideFlex Running shoe, OR tracking existing orders.
Do not suggest features, products, or services that aren't related to ordering these specific products or tracking orders.
If asked about other products, say they are out of stock.
If asked to do anything outside ordering or tracking, politely redirect to these main functions.

${orderContext ? `Current order context: ${orderContext}` : ''}

User: ${userQuery}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Ensure the response stays on topic even if Gemini doesn't
    if (response.toLowerCase().includes("sorry") && 
        (response.toLowerCase().includes("can't help") || 
         response.toLowerCase().includes("cannot help") ||
         response.toLowerCase().includes("don't offer") ||
         response.toLowerCase().includes("do not offer"))) {
      return "I'm here to help you place orders for our fitness products or track your existing orders. Would you like to place an order or track an order today?";
    }
    
    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm sorry, I'm having trouble processing your request right now. I can help you place an order or track an existing one. What would you like to do?";
  }
}

// Function to send order confirmation email
export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: string,
  orderId: string
): Promise<boolean> {
  try {
    console.log(`Sending order confirmation email to ${email} for order ${orderId}`);
    
    // Extract basic information from the orderDetails text if needed
    // This helps make the function compatible with both template types
    let productName = "YourFit Products";
    let productSize = "N/A";
    let productQuantity = "1";
    let productPrice = "0.00";
    let totalPrice = "0.00";
    let shippingAddress = "";
    
    // Try to parse order details
    try {
      const productMatch = orderDetails.match(/Product: (.*?)(\n|$)/);
      if (productMatch) productName = productMatch[1];
      
      const sizeMatch = orderDetails.match(/Size: (.*?)(\n|$)/);
      if (sizeMatch) productSize = sizeMatch[1];
      
      const qtyMatch = orderDetails.match(/Quantity: (.*?)(\n|$)/);
      if (qtyMatch) productQuantity = qtyMatch[1];
      
      const priceMatch = orderDetails.match(/Price: \$(.*?) each/);
      if (priceMatch) productPrice = priceMatch[1];
      
      const totalMatch = orderDetails.match(/Total: \$(.*?)(\)|\n|$)/);
      if (totalMatch) totalPrice = totalMatch[1];
      
      const addressMatch = orderDetails.match(/Shipping to: (.*?)(\n|$)/);
      if (addressMatch) shippingAddress = addressMatch[1];
    } catch (parseError) {
      console.warn("Could not parse order details completely:", parseError);
    }
    
    // Prepare the template parameters with all possible fields
    // Match variable names exactly with the template
    const templateParams = {
      // Make sure these match exactly with EmailJS template variables
      to_name: email.split('@')[0],
      to_email: email,
      name: email.split('@')[0],
      email: email,
      from_name: "YourFit Team",
      from_email: "yourfit2025@gmail.com",
      reply_to: "yourfit2025@gmail.com",
      // Other order details
      subject: `Your YourFit Order Confirmation #${orderId}`,
      title: "Your Order is Confirmed!",
      order_id: orderId,
      order_date: new Date().toLocaleDateString(),
      order_status: 'pending',
      order_details: orderDetails,
      product_name: productName,
      product_size: productSize,
      product_quantity: productQuantity,
      product_price: productPrice,
      total_price: totalPrice,
      shipping_address: shippingAddress
    };
    
    console.log("Sending confirmation email with params:", templateParams);
    
    // Send the email using EmailJS (with publicKey as 4th parameter)
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    
    if (response.status === 200) {
      console.log(`Email successfully sent to ${email}`);
      return true;
    } else {
      console.error(`EmailJS returned non-200 status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Function to send detailed receipt email with all user details
export async function sendDetailedReceiptEmail(
  order: OrderPlaced
): Promise<boolean> {
  try {
    // Format the order details for the email
    const totalPrice = (order.price * order.quantity).toFixed(2);
    const orderDate = new Date(order.created_at || new Date()).toLocaleDateString();
    
    // Prepare EmailJS parameters - exactly match template variables with correct addressing
    const templateParams = {
      // Make sure these match exactly with EmailJS template variables
      to_name: order.user_name,
      to_email: order.email,
      name: order.user_name,
      email: order.email,
      from_name: "YourFit Team",
      from_email: "yourfit2025@gmail.com",
      reply_to: "yourfit2025@gmail.com",
      // Other order details
      title: "Your Order from YourFit",
      subject: `Your YourFit Order Receipt #${order.id}`,
      order_id: order.id,
      order_date: orderDate,
      order_status: order.status || 'pending',
      product_name: order.product,
      product_size: order.size,
      product_quantity: order.quantity,
      product_price: order.price.toFixed(2),
      total_price: totalPrice,
      shipping_address: order.shipping_address
    };

    console.log("Sending email with EmailJS using params:", templateParams);
    
    // Use EmailJS to send the email with the serviceID, templateID, templateParams and publicKey
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    
    if (response.status === 200) {
      console.log("Email sent successfully to:", order.email);
      return true;
    } else {
      console.error("EmailJS returned non-200 status:", response);
      return false;
    }
  } catch (error) {
    console.error("Error sending email with EmailJS:", error);
    return false;
  }
} 