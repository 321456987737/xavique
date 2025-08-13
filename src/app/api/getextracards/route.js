import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import Product from "@/model/Product";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    console.log(category, subcategory, "received in backend");

    await dbConnect();
    console.log(1)
    const products = await Product.find({ category, subcategory })
      .limit(8)
      .skip();
    console.log(2)

    if (products && products.length > 0) {
      return NextResponse.json({ success: true, products }, { status: 200 });
    } else {
          console.log("error cause no product")

      return NextResponse.json(
        { error: "Product not found", success: false },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
