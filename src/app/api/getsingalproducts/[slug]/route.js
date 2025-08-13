import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/model/Product";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { slug } =await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }


    const product = await Product.findOne({ _id: slug });


    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }


    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
