import { OrderPlaced } from '@/lib/supabase';

// Only import nodemailer in a non-browser environment
let nodemailer: any;
// Create transporter only in a server environment
let transporter: any;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only try to import and initialize nodemailer in a non-browser environment
if (!isBrowser) {
  try {
    // Dynamic import for nodemailer (server-side only)
    nodemailer = require('nodemailer');
    
    // Email service configuration
    const EMAIL_USER = "yourfit2025@gmail.com";
    const EMAIL_PASS = "Gotohell2200#"; // Use App Password for Gmail

    // Create transporter outside of function to reuse the connection
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      // Only for development to handle self-signed certificates
      tls: {
        rejectUnauthorized: false
      }
    });
  } catch (error) {
    console.error("Failed to initialize nodemailer:", error);
  }
} else {
  console.log("Browser environment detected - using mailto: fallback for emails");
}

/**
 * Send order confirmation email
 * @param email recipient email address
 * @param orderDetails order details text
 * @param orderId order ID
 * @returns Promise<boolean> indicating success or failure
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: string,
  orderId: string
): Promise<boolean> {
  try {
    // Log email sending attempt
    console.log(`Sending order confirmation email to ${email} for order ${orderId}`);
    
    // Create email content
    const mailOptions = {
      from: "yourfit2025@gmail.com",
      to: email,
      subject: `Your YourFit Order Confirmation #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Thank You for Your Order!</h2>
          <p>Dear Customer,</p>
          <p>We've received your order and are processing it now.</p>
          
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h3 style="margin-top: 0;">Order Summary:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <pre style="background-color: #f8f8f8; padding: 15px; border-radius: 5px;">${orderDetails}</pre>
          </div>
          
          <p>You will receive another email when your order ships.</p>
          <p>If you have any questions, please reply to this email or contact our support team.</p>
          
          <p>Thank you for shopping with YourFit!</p>
          <p>Best regards,<br>The YourFit Team</p>
        </div>
      `
    };
    
    // Use client/browser fallback if we're in the browser
    if (isBrowser) {
      console.log("Browser environment detected, using fallback email display");
      // In browser environment, we can't directly send emails
      // So we'll log it and simulate success
      console.log("Would send email with following content:", mailOptions);
      
      // Open a mailto link as a fallback
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(mailOptions.subject)}&body=${encodeURIComponent(`Order ID: ${orderId}\n\n${orderDetails}\n\nThank you for your order!`)}`;
      window.open(mailtoLink);
      
      return true;
    }
    
    // Actually send the email (will only work in Node.js environment)
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${email}`);
      return true;
    } else {
      console.error("Transporter not initialized - email not sent");
      return false;
    }
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return false;
  }
}

/**
 * Send detailed receipt email
 * @param order order data
 * @returns Promise<boolean> indicating success or failure
 */
export async function sendDetailedReceiptEmail(
  order: OrderPlaced
): Promise<boolean> {
  try {
    const totalPrice = (order.price * order.quantity).toFixed(2);
    const orderDate = new Date(order.created_at || new Date()).toLocaleDateString();
    
    // Log the attempt
    console.log(`Sending detailed receipt email to ${order.email} for order ${order.id}`);
    
    // Create the email content
    const mailOptions = {
      from: "yourfit2025@gmail.com",
      to: order.email,
      subject: `Your YourFit Receipt - Order #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f0f4f8; padding: 20px; text-align: center;">
            <h1 style="color: #2d3748; margin: 0;">Your Order Receipt</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
            <p>Hello ${order.user_name},</p>
            <p>Thank you for your order! Here's your receipt:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f0f4f8;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Order Details</th>
                <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;"></th>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Order ID:</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">${order.id}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Date:</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">${orderDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Status:</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">${order.status || 'pending'}</td>
              </tr>
            </table>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f0f4f8;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Product</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">Size</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">Price</th>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${order.product}</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">${order.size}</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">${order.quantity}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">$${order.price.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;"><strong>Total:</strong></td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;"><strong>$${totalPrice}</strong></td>
              </tr>
            </table>
            
            <div style="margin-top: 20px;">
              <h3>Shipping Address:</h3>
              <p style="padding: 10px; background-color: #f9f9f9; border-radius: 4px;">${order.shipping_address}</p>
            </div>
            
            <p style="margin-top: 30px;">If you have any questions about your order, please contact us at <a href="mailto:yourfit2025@gmail.com">yourfit2025@gmail.com</a>.</p>
            
            <p>Thank you for shopping with YourFit!</p>
          </div>
          
          <div style="background-color: #f0f4f8; padding: 20px; text-align: center; font-size: 12px; color: #718096;">
            <p>© 2025 YourFit - Your Premium Fitness Apparel Store</p>
          </div>
        </div>
      `
    };
    
    // Use client/browser fallback if we're in the browser
    if (isBrowser) {
      console.log("Browser environment detected, using email client fallback");
      // Format a simple text version for the mailto link
      const textBody = `
Order Receipt - Order #${order.id}
Date: ${orderDate}
Status: ${order.status || 'pending'}

Product: ${order.product}
Size: ${order.size}
Quantity: ${order.quantity}
Price: $${order.price.toFixed(2)}
Total: $${totalPrice}

Shipping Address:
${order.shipping_address}

Thank you for shopping with YourFit!
      `;
      
      // Open mailto link as fallback
      const mailtoLink = `mailto:${order.email}?subject=${encodeURIComponent(mailOptions.subject)}&body=${encodeURIComponent(textBody)}`;
      window.open(mailtoLink);
      
      console.log("Email client opened for order", order.id);
      return true;
    }
    
    // Actually send the email (will only work in Node.js environment)
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`Detailed receipt email sent successfully to ${order.email}`);
      return true;
    } else {
      console.error("Transporter not initialized - email not sent");
      return false;
    }
  } catch (error) {
    console.error("Error sending detailed receipt email:", error);
    return false;
  }
} 