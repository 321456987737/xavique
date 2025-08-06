import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/model/Product";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Required fields
    const requiredFields = ["title", "slug", "description", "price", "category"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Check for existing product with same slug
    const existing = await Product.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new product
    const product = new Product({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await product.save();

    return NextResponse.json(
      {
        success: true,
        productId: product._id,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
