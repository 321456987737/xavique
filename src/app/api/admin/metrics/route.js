import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/model/User";
import Order from "@/model/Order";
import Product from "@/model/Product";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 2);

    // ----- USERS -----
    const totalUsers = await User.countDocuments();
    const usersCurrent = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const usersPrevious = await User.countDocuments({
      createdAt: { $gte: prevMonth, $lt: lastMonth },
    });
    const usersChange = ((usersCurrent - usersPrevious) / (usersPrevious || 1)) * 100;

    // ----- ORDERS -----
    const totalOrders = await Order.countDocuments();
    const ordersCurrent = await Order.countDocuments({ createdAt: { $gte: lastMonth } });
    const ordersPrevious = await Order.countDocuments({
      createdAt: { $gte: prevMonth, $lt: lastMonth },
    });
    const ordersChange = ((ordersCurrent - ordersPrevious) / (ordersPrevious || 1)) * 100;

    // ----- REVENUE -----
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, sum: { $sum: "$total" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.sum || 0;

    const revenueCurrentAgg = await Order.aggregate([
      { $match: { status: "completed", createdAt: { $gte: lastMonth } } },
      { $group: { _id: null, sum: { $sum: "$total" } } },
    ]);
    const revenuePreviousAgg = await Order.aggregate([
      { $match: { status: "completed", createdAt: { $gte: prevMonth, $lt: lastMonth } } },
      { $group: { _id: null, sum: { $sum: "$total" } } },
    ]);
    const revenueCurrent = revenueCurrentAgg[0]?.sum || 0;
    const revenuePrevious = revenuePreviousAgg[0]?.sum || 0;
    const revenueChange = ((revenueCurrent - revenuePrevious) / (revenuePrevious || 1)) * 100;

    // ----- LOW STOCK -----
    const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });
    // If you don't store stock history, this can't be accurate.
    // We'll just set it to 0 change for now.


    return NextResponse.json({
      totalUsers,
      usersChange: Number(usersChange.toFixed(2)),
      totalOrders,
      ordersChange: Number(ordersChange.toFixed(2)),
      totalRevenue,
      revenueChange: Number(revenueChange.toFixed(2)),
 
    });
  } catch (err) {
    console.error("Error fetching metrics:", err);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
