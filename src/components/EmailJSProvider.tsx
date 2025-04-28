import { useEffect } from 'react';
import emailjs from 'emailjs-com';

// EmailJS public key (safe to include in client-side code)
const EMAILJS_PUBLIC_KEY = "dsPjTn9c69UEd-CXF";

interface EmailJSProviderProps {
  children: React.ReactNode;
}

export function EmailJSProvider({ children }: EmailJSProviderProps) {
  useEffect(() => {
    // Initialize EmailJS with the public key
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized with public key');
  }, []);

  return <>{children}</>;
}

export default EmailJSProvider; 