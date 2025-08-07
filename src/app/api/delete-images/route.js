import { NextResponse } from 'next/server';
import imageKitConfig from '@/lib/imagekit';
import { dbConnect } from '@/lib/db';
import Product from '@/model/Product';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    const body = await request.json();
    const { _id } = body;
    console.log('Received image IDs:', _id);

    // Validate input
    if (!Array.isArray(_id) || _id.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty _id array' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the products containing these images
    const products = await Product.find({
      'images._id': { 
        $in: _id.map(id => new mongoose.Types.ObjectId(id))
      }
    });

    // Extract ImageKit fileIds from the matching images
    const imagesToDelete = products.reduce((acc, product) => {
      const matchingImages = product.images.filter(img => 
        _id.includes(img._id.toString())
      );
      return [...acc, ...matchingImages];
    }, []);

    console.log('Found images to delete:', imagesToDelete);

    // Delete files from ImageKit if they have fileIds
    const deleteResults = await Promise.allSettled(
      imagesToDelete.map(async (image) => {
        if (!image.fileId) {
          console.log('No fileId found for image:', image);
          return { image, success: true }; // Skip ImageKit deletion if no fileId
        }

        try {
          await imageKitConfig.deleteFile(image.fileId);
          return { image, success: true };
        } catch (error) {
          console.error(`Failed to delete file ${image.fileId}:`, error);
          return { image, success: false, error: error.message };
        }
      })
    );

    // Update database to remove images
    const updatePromises = products.map(product => 
      Product.updateOne(
        { _id: product._id },
        { 
          $pull: { 
            images: { 
              _id: { 
                $in: _id.map(id => new mongoose.Types.ObjectId(id)) 
              } 
            } 
          }
        }
      )
    );

    await Promise.all(updatePromises);

    // Check results
    const failedDeletions = deleteResults.filter(r => !r.value?.success);
    
    if (failedDeletions.length > 0) {
      console.error('Some ImageKit deletions failed:', failedDeletions);
      // Continue anyway since we've removed from database
    }

    return NextResponse.json({
      success: true,
      message: 'Images deleted successfully'
    });

  } catch (error) {
    console.error('Delete operation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete images',
        details: error.message
      },
      { status: 500 }
    );
  }
}