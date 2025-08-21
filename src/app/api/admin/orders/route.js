import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/model/Order';

export async function GET(req) {
  try {
    await dbConnect();
   console.log(1)
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
   console.log(1)
   console.log(email)
    if (!email) { 
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
   console.log(1)

    const orders = await Order.find({ "customer.email":email }).sort({ createdAt: -1 });
   console.log(1)
console.log(orders)
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const order = await Order.create(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
