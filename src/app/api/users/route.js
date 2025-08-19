import User from "@/model/User";
import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    
    // Get all users for the main customer table
    const users = await User.find({})
      .select('username email status createdAt') // Only select needed fields for performance
      .sort({ createdAt: -1 }) // -1 = newest first, 1 = oldest first
      .lean(); // Use lean() for better performance since we don't need mongoose document methods

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}