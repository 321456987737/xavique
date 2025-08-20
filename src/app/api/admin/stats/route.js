import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/db";
import User from "@/model/User";
import Order from "@/model/Order";

export async function GET() {
  try {
    await dbConnect();

    // Group orders by day
    const ordersPerDay = await Order.aggregate([
      { $match: { createdAt: { $exists: true } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Group users by day
    const usersPerDay = await User.aggregate([
      { $match: { createdAt: { $exists: true } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          newUsers: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({ ordersPerDay, usersPerDay }, { status: 200 });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
