# YourFit

A modern e-commerce platform for fitness apparel with AI-enhanced shopping experiences.

## 🚀 Features

- **AI-Powered Shopping Assistant**: Chat with an AI assistant to help with product selection and ordering
- **Visual Search**: Upload images to find similar products in our catalog
- **Virtual Try-On**: See how clothes look on you before purchasing
- **Secure Authentication**: User authentication powered by Clerk
- **Order Management**: Complete shopping experience with order tracking
- **Email Confirmations**: Automatic order confirmation emails

## 🛠️ Technologies

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase
- **Authentication**: Clerk
- **AI Services**:
  - OpenAI for Visual Search and Virtual Try-On
  - Google Gemini for Shopping Assistant
- **Email**: EmailJS for sending notifications

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Clerk account
- OpenAI API key
- Google Gemini API key
- EmailJS account

## 🔧 Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/fit-fusion-fashion.git
cd fit-fusion-fashion
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_GOOGLE_API_KEY=your_gemini_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_KEY=your_supabase_service_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

4. Set up Supabase database:
   - Follow instructions in `SUPABASE_SETUP.md`
   - Run SQL scripts in `reset_and_setup_table.sql` and `supabase_policies.sql`

5. Set up EmailJS:
   - Follow instructions in `EMAIL_SETUP.md`
   - Use the template in `emailjs_template.html`

6. Start the development server
```bash
npm run dev
```

## 🔐 API Keys Management

To ensure security:

1. Add `.env` to your `.gitignore` file
2. Never hardcode API keys directly in source files
3. Use environment variables to access API keys:
```typescript
const apiKey = import.meta.env.VITE_YOUR_API_KEY;
```

## 📱 Features in Detail

### AI Shopping Assistant

The chatbot integrated with Google Gemini helps users find products, answer questions, and process orders conversationally.

### Visual Search

Powered by OpenAI's Vision API, this feature lets users upload images of clothing items to find similar products in the catalog.

### Virtual Try-On

This feature uses AI image processing to show users how clothing items would look on them, based on a selfie they upload.

### Secure Checkout

The platform integrates Supabase for order storage and Clerk for user authentication, providing a secure shopping experience.
