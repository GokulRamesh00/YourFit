# Email Service Setup

This application uses a browser-friendly email service that works in both development and production environments.

## How It Works

1. In a server environment (Node.js), the application uses Nodemailer to send emails directly.
2. In a browser environment, the application opens the user's default email client with a pre-populated email.

## Configuration

### Setting Up Gmail for Sending Emails

To send emails from your Gmail account:

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to your Google Account
   - Select Security
   - Under "Signing in to Google," select 2-Step Verification
   - At the bottom of the page, select App passwords
   - Enter a name to help you remember what this app password is for (e.g., "YourFit App")
   - Select Generate
   - Copy the 16-character password
   - Update the `EMAIL_PASS` value in `src/lib/emailService.ts` with this password

### Update the Email Configuration

Open `src/lib/emailService.ts` and update the following:

```typescript
// Email service configuration
const EMAIL_USER = "yourfit2025@gmail.com"; // Your Gmail address
const EMAIL_PASS = "yourAppPasswordHere";   // Your App Password from Google
```

## Testing the Email Service

You can test the email service by typing `!test email` in the chat interface. This will:

1. Create a test order with sample data
2. Attempt to send an email receipt
3. In a browser environment, open your default email client with a pre-populated email
4. In a server environment, attempt to send an actual email using Nodemailer

## Troubleshooting

### Email Client Not Opening

If the email client doesn't open when testing in the browser:

1. Check if your browser is blocking popup windows
2. Ensure you have a default email client configured on your system
3. Check the console for any error messages

### Server-Side Email Sending Issues

If you're testing in a Node.js environment and emails aren't being sent:

1. Verify your Gmail App Password is correct
2. Check if your Gmail account has any security restrictions
3. Examine the server logs for detailed error messages
4. Make sure your ISP isn't blocking outgoing SMTP connections

## Security Considerations

- The app password is included in the client-side code for demonstration purposes only
- In a production environment, you should:
  - Store sensitive credentials in environment variables
  - Use a secure email API service like SendGrid, Mailgun, or Amazon SES
  - Set up proper CORS and CSP headers to prevent abuse 