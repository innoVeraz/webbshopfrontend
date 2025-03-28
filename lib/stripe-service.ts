export async function createStripeCheckoutSession(orderData: {
  orderId: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}) {
  try {
    console.log('Creating Stripe session with:', {
      orderData,
      url: `${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout`
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderData.orderId,
        items: orderData.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_amount: Math.round(item.price * 100),
          currency: 'sek'
        })),
        success_url: `${window.location.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}&order_id=${orderData.orderId}`,
        cancel_url: `${window.location.origin}/checkout`
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stripe session creation failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`Could not create Stripe checkout session: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Stripe session created successfully:', data);
    return { url: data.url, sessionId: data.sessionId };
  } catch (error) {
    console.error('Error in createStripeCheckoutSession:', error);
    throw error;
  }
}