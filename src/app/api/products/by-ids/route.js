import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/model/Product";

// POST route because we're sending an array of IDs
export async function POST(request) {
  try {
    await dbConnect();
   console.log(1)
    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ message: "No product IDs provided" }, { status: 400 });
    }
   console.log(1)

    // Fetch products
    const products = await Product.find({ _id: { $in: productIds } });
   console.log(1)

    return NextResponse.json({ products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
