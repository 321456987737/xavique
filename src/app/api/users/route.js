import User from "@/model/User";
import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    
    // Get pagination parameters from query string
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '2', 2);
    
    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    
    // Calculate skip value for pagination
    const skip = (validPage - 1) * validLimit;
    
    // Get total count for pagination info
    const totalCount = await User.countDocuments({});
    
    // Calculate if there are more pages
    const hasMore = skip + validLimit < totalCount;
    const totalPages = Math.ceil(totalCount / validLimit);
    
    // Fetch users with pagination
    const users = await User.find({})
      .select('username email status createdAt') // Only select needed fields for performance
      .sort({ createdAt: -1 }) // -1 = newest first
      .skip(skip)
      .limit(validLimit)
      .lean(); // Use lean() for better performance

    // Return paginated response
    return NextResponse.json({ 
      users,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalCount,
        hasMore,
        limit: validLimit,
        skip
      },
      // Keep backward compatibility
      totalCount,
      hasMore
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ 
      error: "Failed to fetch users",
      users: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasMore: false,
        limit: 20,
        skip: 0
      },
      totalCount: 0,
      hasMore: false
    }, { status: 500 });
  }
}