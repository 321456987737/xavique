import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { customer, billing, items, shippingMethod, total } = await req.json();
    
    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.images[0].url || item.images[0]],
          metadata: {
            productId: item.id,
            color: item.selectedOptions?.color || 'N/A',
            size: item.selectedOptions?.size || 'N/A',
            quantity: item.qty
          }
        },
        unit_amount: Math.round(item.discountPrice * 100),
      },
      quantity: item.qty,
    }));

    // Add shipping as a separate line item if needed
    if (shippingMethod === "express") {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Express Shipping',
          },
          unit_amount: 599,
        },
        quantity: 1,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      success_url: `${process.env.NEXTAUTH_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'PK'],
      },
      metadata: {
        customer_name: customer.name,
        customer_phone: customer.phone,
        shipping_method: shippingMethod,
        item_count: items.length.toString()
      }
    });

    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Stripe error:", err);
    return new Response(JSON.stringify({ 
      error: err.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}