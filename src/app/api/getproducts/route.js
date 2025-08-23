import { dbConnect } from "@/lib/db";
import Product from "@/model/Product";
import { NextResponse } from "next/server";

const PAGE_SIZE = 10;

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const subsubcategory = searchParams.get("subsubcategory");
    const page = searchParams.get("page") || "1";
    const pageNumber = parseInt(page, 10) || 1;

    let filter = {};
    if (category) filter.category = { $regex: `^${category}$`, $options: "i" };
    if (subcategory) filter.subcategory = { $regex: `^${subcategory}$`, $options: "i" };
    if (subsubcategory) filter.subsubcategory = { $regex: `^${subsubcategory}$`, $options: "i" };

    // Get total count for hasMore calculation
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

    const products = await Product.find(filter)
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .select("_id title images price discountPrice category subcategory subsubcategory slug")
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      products,
      hasMore: pageNumber < totalPages
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// import { dbConnect } from "@/lib/db";
// import Product from "@/model/Product";
// import { NextResponse } from "next/server";

// const PAGE_SIZE = 10;

// export async function GET(request) {
//   try {
//     await dbConnect();

//     // Parse URL and search params
//     const { searchParams } = new URL(request.url);

//     const category = searchParams.get("category");
//     const subcategory = searchParams.get("subcategory");
//     const subsubcategory = searchParams.get("subsubcategory");
//     const page = searchParams.get("page") || "1";
//     const pageNumber = parseInt(page, 2) || 1;

//     let filter = {};
//     if (category) filter.category = { $regex: `^${category}$`, $options: "i" };
//     if (subcategory) filter.subcategory = { $regex: `^${subcategory}$`, $options: "i" };
//     if (subsubcategory) filter.subsubcategory = { $regex: `^${subsubcategory}$`, $options: "i" };

//     const products = await Product.find(filter)
//       .skip((pageNumber - 1) * PAGE_SIZE)
//       .limit(PAGE_SIZE)
//       .select(
//         "_id title description images price discountPrice inStock stockQuantity category subcategory subsubcategory sizes colors tags slug isFeatured isArchived createdAt updatedAt"
//       )
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, products });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
