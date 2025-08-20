import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/db";
import Order from "@/model/Order";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "all"; // "7d" | "30d" | "all"
    
    let match = {};
    if (range !== "all") {
      const now = new Date();
      let startDate = new Date();
      if (range === "7d") startDate.setDate(now.getDate() - 7);
      if (range === "30d") startDate.setDate(now.getDate() - 30);
      match.createdAt = { $gte: startDate };
    }

    // --- Top Products ---
    const topProducts = await Order.aggregate([
  { $match: match },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      productName: { $first: "$items.title" },
      ordersCount: { $addToSet: "$_id" }, // collect unique orders
      totalSold: { $sum: "$items.quantity" },
      totalRevenue: {
        $sum: { $multiply: ["$items.qty", { $ifNull: ["$items.discountPrice", 0] }] }
      }
    }
  },
  {
    $project: {
      productName: 1,
      totalSold: 1,
      totalRevenue: 1,
      orderCount: { $size: "$ordersCount" }
    }
  },
  { $sort: { orderCount: -1, totalRevenue: -1 } },
  { $limit: 5 }
]);


    // --- Top Customers ---
    const topCustomers = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$customer.email",
          customerName: { $first: "$customer.name" },
          totalSpend: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { totalSpend: -1 } },
      { $limit: 5 }
    ]);
    console.log({ topProducts, topCustomers });
    return NextResponse.json({ topProducts, topCustomers }, { status: 200 });
  } catch (err) {
    console.error("Error fetching top performers:", err);
    return NextResponse.json({ error: "Failed to fetch top data" }, { status: 500 });
  }
}
