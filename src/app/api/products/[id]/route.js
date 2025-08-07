import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/model/Product';
import imagekit from '@/lib/imagekit';
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const productId = await params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found', success: false }, { status: 404 });
    }

    // Delete images from ImageKit
    if (product.images?.length) {
      for (const img of product.images) {
        if (img.fileId) {
          await imagekit.deleteFile(img.fileId);
        }
      }
    }

    // Delete product from DB
    await Product.findByIdAndDelete(productId);

    return NextResponse.json({ message: 'Product and images deleted successfully' , status: 200 , success: true}, { status: 200 }, {success: true});
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal Server Error', success: false }, { status: 500 });
  }
}