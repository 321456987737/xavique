import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/db';
import Wishlist from '@/model/Wishlist';

export async function GET() {
  try {
    await dbConnect();

    // In a real app, you'd get the user ID from the session
    const wishlists = await Wishlist.find({}).populate('userId', 'username email');

    return NextResponse.json({ success: true, data: wishlists });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const wishlist = await Wishlist.create(body);
    return NextResponse.json({ success: true, data: wishlist }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}