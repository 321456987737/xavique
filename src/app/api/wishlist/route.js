import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Wishlist from "@/model/Wishlist";

// ========== GET ==========
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ userId })
      .populate("items.productId");

    return NextResponse.json({ wishlist: wishlist || { items: [] } });
  } catch (err) {
    console.error("GET /api/wishlist error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ========== POST ==========
export async function POST(req) {
  try {
    await dbConnect();

    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    // Check if wishlist exists
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [{ productId }] });
      return NextResponse.json({ message: "Added to wishlist", removed: false });
    }

    // Check if product already in wishlist
    const exists = wishlist.items.find(
      (item) => item.productId.toString() === productId
    );

    if (exists) {
      // Remove product
      wishlist.items = wishlist.items.filter(
        (item) => item.productId.toString() !== productId
      );
      await wishlist.save();
      return NextResponse.json({ message: "Removed from wishlist", removed: true });
    } else {
      // Add product
      wishlist.items.push({ productId });
      await wishlist.save();
      return NextResponse.json({ message: "Added to wishlist", removed: false });
    }
  } catch (err) {
    console.error("POST /api/wishlist error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
