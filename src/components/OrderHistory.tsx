import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { OrderRecord } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ShoppingBag, Truck, CheckCircle, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const OrderHistory = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId, isSignedIn } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isSignedIn || !userId) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setOrders(data as OrderRecord[]);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to load your order history. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userId, isSignedIn, toast]);

  // Get order status icon
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'canceled':
        return <HelpCircle className="h-5 w-5 text-red-500" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get a color class for the status badge
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date from ISO string
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isSignedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in to view your orders</h3>
          <p className="text-gray-500 mb-6">
            Sign in to view your order history and check order status.
          </p>
          <Button>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">
            When you place an order, it will appear here.
          </p>
          <Button>Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {orders.map((order, index) => (
              <AccordionItem key={order.id} value={order.id}>
                <Card className="overflow-hidden border border-gray-200">
                  <CardContent className="p-0">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between w-full">
                      <div className="flex-1 min-w-0 flex items-center">
                        <div className="mr-4">
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900 truncate">
                                Order #{order.id.substring(0, 8)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status || 'Processing'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="border-t border-gray-200">
                      <div className="px-6 py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Order Details</h4>
                            <dl className="text-sm space-y-2">
                              <div className="flex justify-between">
                                <dt className="text-gray-500">Product:</dt>
                                <dd className="font-medium text-gray-900">{order.product}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-500">Size:</dt>
                                <dd className="font-medium text-gray-900">{order.size}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-500">Quantity:</dt>
                                <dd className="font-medium text-gray-900">{order.quantity}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-500">Price:</dt>
                                <dd className="font-medium text-gray-900">${order.price.toFixed(2)}</dd>
                              </div>
                              <div className="flex justify-between border-t border-gray-200 pt-2">
                                <dt className="text-gray-900 font-medium">Total:</dt>
                                <dd className="font-bold text-gray-900">${(order.price * order.quantity).toFixed(2)}</dd>
                              </div>
                            </dl>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h4>
                            <address className="text-sm not-italic text-gray-500 whitespace-pre-line">
                              {order.shipping_address}
                            </address>
                            
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                              <p className="text-sm text-gray-500">{order.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-end space-x-4">
                            <Button variant="outline">
                              Track Order
                            </Button>
                            <Button variant="default">
                              Get Help
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </CardContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 