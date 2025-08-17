// app/api/orders/route.js
import Order from '@/model/Order';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { customer, items, total, paymentMethod, stripeSessionId } = await request.json();

    const order = await Order.order.create({
      data: {
        customer: JSON.stringify(customer),
        items: JSON.stringify(items),
        total: total,
        paymentMethod: paymentMethod,
        stripeSessionId: stripeSessionId || null,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}