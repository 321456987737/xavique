import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/model/Product";

export async function GET(req, { params }) {
  try {
    await dbConnect();
   console.log(1)
    const { slug } =await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }
   console.log(2)

    const product = await Product.findOne({ _id: slug });
   console.log(3)

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
   console.log(4)

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
