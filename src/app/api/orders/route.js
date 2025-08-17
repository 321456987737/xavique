// app/api/orders/route.js
import Order from '@/model/Order';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';

export async function POST(request) {
  try {
    await dbConnect();

    const { customer, items, total, paymentMethod, stripeSessionId } = await request.json();

    console.log("customer", customer, "items", items, "total", total, "paymentMethod", paymentMethod, "stripeSessionId", stripeSessionId);

    const order = await Order.create({
      customer: customer,           // if schema is Mixed, no need to JSON.stringify
      items: items,
      total: total,
      paymentMethod: paymentMethod,
      stripeSessionId: stripeSessionId || null,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
