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
export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "";
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const payment = searchParams.get("payment") || "";

    // Build MongoDB query
    const filter = {};
    
    // Text search - adjust field names based on your actual data structure
    if (name) {
      filter.$or = [
        // If customer is an object with a name field
        { "customer.name": { $regex: name, $options: "i" } },
        // If customer is a string
        { "customer": { $regex: name, $options: "i" } },
         { "customer.email": { $regex: name, $options: "i" } },
        // Search in items array - adjust based on your items structure
        { items: { $elemMatch: { title: { $regex: name, $options: "i" } } } }
      ];
    }
    
    // Status filter - use lowercase to match schema enum
    if (status) filter.status = status.toLowerCase();
    
    // Payment method
    if (payment) filter.paymentMethod = payment;
    
    // Date filtering (with timezone correction)
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(
          new Date(startDate).setUTCHours(0, 0, 0, 0)
        );
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(
          new Date(endDate).setUTCHours(23, 59, 59, 999)
        );
      }
    }

    console.log("MongoDB filter:", filter); // Debug log

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    console.log("Found orders:", orders.length); // Debug log

    return NextResponse.json({ 
      success: true, 
      orders: orders.map(order => ({
        ...order,
        _id: order._id.toString(),
        customerName: order.customer?.name || order.customer || "Unknown", // Handle different customer formats
        createdAt: order.createdAt.toISOString()
      }))
    }, { status: 200 });
    
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" }, 
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
        await dbConnect();
    const updatedData = await request.json();
    const { _id, id, ...rest } = updatedData;
    const orderId = _id || id;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, rest, {
      new: true,
      runValidators: true
    });
    if (!updatedOrder) {
      return new Response(JSON.stringify({
        success: false,
        error: "Order not found"
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return  NextResponse.json({
      success: true,
      data: updatedOrder,

      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update order',
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
