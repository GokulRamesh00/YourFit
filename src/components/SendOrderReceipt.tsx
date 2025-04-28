import { useState } from 'react';
import { useOrderPlaced } from '@/hooks/useOrderPlaced';
import { Button } from '@/components/ui/button';

interface SendOrderReceiptProps {
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function SendOrderReceipt({ 
  orderId, 
  onSuccess, 
  onError 
}: SendOrderReceiptProps) {
  const { sendReceiptEmail, loading } = useOrderPlaced();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendReceipt = async () => {
    try {
      const success = await sendReceiptEmail(orderId);
      
      if (success) {
        setSent(true);
        if (onSuccess) onSuccess();
      } else {
        throw new Error("Failed to send receipt email");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error sending receipt email';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  return (
    <div className="mt-4">
      {sent ? (
        <div className="text-green-600 font-medium">
          Receipt email sent successfully!
        </div>
      ) : error ? (
        <div className="text-red-600 font-medium">
          Error: {error}
        </div>
      ) : (
        <Button 
          onClick={handleSendReceipt}
          disabled={loading}
          variant="outline"
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          {loading ? 'Sending...' : 'Send Detailed Receipt Email'}
        </Button>
      )}
    </div>
  );
} 