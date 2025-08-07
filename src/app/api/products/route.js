import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/model/Product';
import mongoose from "mongoose";


export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');
    
    if (!searchTerm?.trim()) {
      return NextResponse.json(
        { error: "Search term is required" },
        { status: 400 }
      );
    }

    // Build search query
    const query = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive name search
        { slug: { $regex: searchTerm, $options: 'i' } }   // Also search by slug
      ]
    };

    // If searchTerm is a valid MongoDB ID, include it in the search
    if (mongoose.Types.ObjectId.isValid(searchTerm)) {
      query.$or.push({ _id: searchTerm });
    }

    const products = await Product.find(query)
      .select('-__v') // Exclude version key
      .lean() // Return plain JavaScript objects
      .limit(10); // Limit to 10 results

    if (!products.length) {
      return NextResponse.json(
        { error: "No products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
