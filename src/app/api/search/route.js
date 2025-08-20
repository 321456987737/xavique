import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db"; // Adjust to your DB connection util
import Product from "@/model/Product"; // Adjust to your Product schema

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    // If query is empty, return no products
    if (!q.trim()) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // Case-insensitive search on name or description
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    })
      .limit(10) // Limit to 10 results
      .select("name price images") // Only return required fields
      .lean();

    // Format data for frontend
    const formatted = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      image: p.images[0].url || "/placeholder.jpg" // fallback if missing
    }));

    return NextResponse.json({ products: formatted }, { status: 200 });

  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
