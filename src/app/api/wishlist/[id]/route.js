import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Wishlist from '@/model/Wishlist';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });
    }

    const wishlistDoc = await Wishlist.findOne({ userId: id }).populate('items.productId');
    console.log(wishlistDoc);

    // Always return an array
    const wishlist = wishlistDoc?.items || [];
    return NextResponse.json({ wishlist });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // userId

    if (!id) {
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ message: 'Missing productId' }, { status: 400 });
    }

    // Find wishlist and pull matching item
    const wishlistDoc = await Wishlist.findOneAndUpdate(
      { userId: id },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');

    if (!wishlistDoc) {
      return NextResponse.json({ message: 'Wishlist not found' }, { status: 404 });
    }

    return NextResponse.json({ wishlist: wishlistDoc.items });

  } catch (err) {
    console.error('Delete wishlist item error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
