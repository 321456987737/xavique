import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/db";
import User from "@/model/User";
import Order from "@/model/Order";
import Product from "@/model/Product";

export async function GET() {
  try {
    await dbConnect();

    // Get counts
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, sum: { $sum: "$total" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.sum || 0;

    const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });

    // TODO: Implement real percentage change calculation
    // For now, return dummy % changes
    return NextResponse.json({
      totalUsers,
      usersChange: 12,
      totalOrders,
      ordersChange: 8,
      totalRevenue,
      revenueChange: 15,
      lowStock,
      lowStockChange: -2
    });
  } catch (err) {
    console.error("Error fetching metrics:", err);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
