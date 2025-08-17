// app/api/orders/route.js
import Order from '@/model/Order';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
export async function POST(request) {
  try {
     await dbConnect()
     console.log(1)
    const { customer, items, total, paymentMethod, stripeSessionId } = await request.json();
     console.log(1,customer,items,total,paymentMethod,stripeSessionId)

    const order = await Order.create({
      data: {
        customer: JSON.stringify(customer),
        items: JSON.stringify(items),
        total: total,
        paymentMethod: paymentMethod,
        stripeSessionId: stripeSessionId || null,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      }
    });
     console.log(1)

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}