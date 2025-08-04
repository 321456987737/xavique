import { dbConnect } from "@/lib/db";
import User from "@/model/User";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
   await dbConnect();
   const body = await req.json();
   const { email, password, username } = body;

   if (!email || !password || !username) {
      return NextResponse.json({error:"Email, password, and username are required",success:false}, { status: 400 });
   }

   // Check if user with email or username already exists
   const existingUser = await User.findOne({
     $or: [{ email }, { username }]
   });

   if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return NextResponse.json({
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        success: false
      }, { status: 400 });
   }

   const newUser = new User({ email, password, username });
   await newUser.save();
   
   return NextResponse.json({
     message: "User registered successfully",
     success: true
   }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        error: validationErrors.join(', '),
        success: false
      }, { status: 400 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        success: false
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: "Internal server error",
      success: false
    }, { status: 500 });
  }
}
