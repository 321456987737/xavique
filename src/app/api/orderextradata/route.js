import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/model/User';
import Order from '@/model/Order';

// POST: compute extra order data for a user (used by your table)
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    // Fetch all orders for this customer email
    const orders = await Order.find({ 'customer.email': email })
      .select('createdAt total')
      .lean();

    const ordersCount = orders.length;

    // Get last order date (latest createdAt)
    const lastOrderDate =
      ordersCount > 0
        ? orders.reduce((latest, o) => {
            const d = new Date(o.createdAt);
            return d > latest ? d : latest;
          }, new Date(0))
        : null;

    // Calculate total spend
    const totalSpend = orders.reduce((sum, o) => {
      const val = Number(o.total ?? 0);
      return sum + (Number.isFinite(val) ? val : 0);
    }, 0);

    return NextResponse.json(
      { ordersCount, lastOrderDate, totalSpend },
      { status: 200 }
    );
  } catch (err) {
    console.error('orderextradata POST error:', err);
    return NextResponse.json(
      { error: 'Failed to compute order data' },
      { status: 500 }
    );
  }
}


// PUT: update ONLY user's status (active/inactive)
export async function PUT(req) {
  try {
    const { email, status } = await req.json();

    if (!email || !status) {
      return NextResponse.json({ error: 'email and status are required' }, { status: 400 });
    }

    const allowed = new Set(['active', 'inactive']);
    if (!allowed.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 422 });
    }

    await dbConnect();

    const updated = await User.findOneAndUpdate(
      { email },
      { status },
      { new: true, projection: { password: 0 } }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user: updated }, { status: 200 });
  } catch (err) {
    console.error('orderextradata PUT error:', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

// GET: search users with order data (for the search dropdown)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    await dbConnect();

    // Search users by username or email
    const query = {
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    };

    const users = await User.find(query)
      .select('username email status createdAt')
      .limit(10) // Limit search results to 10 for performance
      .lean();

    // Augment with order data for search results
    const usersWithData = await Promise.all(
      users.map(async (user) => {
        try {
          const orders = await Order.find({ email: user.email })
            .select('createdAt total totalAmount grandTotal')
            .lean();

          const ordersCount = orders.length;
          const lastOrderDate =
            ordersCount > 0
              ? orders.reduce((latest, o) => {
                  const d = new Date(o.createdAt);
                  return d > latest ? d : latest;
                }, new Date(0))
              : null;

          const totalSpend = orders.reduce((sum, o) => {
            const val = Number(o.grandTotal ?? o.totalAmount ?? o.total ?? 0);
            return sum + (Number.isFinite(val) ? val : 0);
          }, 0);

          return { ...user, ordersCount, lastOrderDate, totalSpend };
        } catch (error) {
          console.error(`Failed to fetch order data for ${user.email}:`, error);
          return { ...user, ordersCount: 0, lastOrderDate: null, totalSpend: 0 };
        }
      })
    );

    return NextResponse.json({ users: usersWithData }, { status: 200 });
  } catch (err) {
    console.error('orderextradata GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}