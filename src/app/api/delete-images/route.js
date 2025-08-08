import { NextResponse } from 'next/server';
import imageKitConfig from '@/lib/imagekit';
import { dbConnect } from '@/lib/db';
import Product from '@/model/Product';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fileId } = body;
    console.log(fileId)
    console.log('Received fileId(s):', fileId);

    // ✅ Validate input
    if (!Array.isArray(fileId) || fileId.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty fileId array' },
        { status: 400 }
      );
    }
console.log(1)
    // ✅ Connect to DB
    await dbConnect();
console.log(1)

    // ✅ Find all products that contain these fileId(s)
    const products = await Product.find({
      'images.fileId': { $in: fileId }
    });
console.log(1)

    // ✅ Collect matching image objects to delete
    const imagesToDelete = products.reduce((acc, product) => {
      const matchingImages = product.images.filter(img =>
        fileId.includes(img.fileId)
      );
      return [...acc, ...matchingImages];
    }, []);
console.log(1)

    console.log('Images to delete from ImageKit:', imagesToDelete);

    // ✅ Delete files from ImageKit
    const deleteResults = await Promise.allSettled(
      imagesToDelete.map(async (image) => {
        try {
          await imageKitConfig.deleteFile(image.fileId);
          return { image, success: true };
        } catch (error) {
          console.error(`Failed to delete file ${image.fileId}:`, error);
          return { image, success: false, error: error.message };
        }
      })
    );
console.log(1)

    // ✅ Remove image entries from DB
    await Promise.all(
      products.map(product =>
        Product.updateOne(
          { _id: product._id },
          {
            $pull: {
              images: {
                fileId: { $in: fileId }
              }
            }
          }
        )
      )
    );

    // ✅ Log failed deletions
    console.log(1)

    const failedDeletions = deleteResults.filter(r => !r?.value?.success);
    if (failedDeletions.length > 0) {
      console.warn('Some ImageKit deletions failed:', failedDeletions);
    }
console.log(1)

    return NextResponse.json({
      success: true,
      message: 'Images deleted successfully',
      failedDeletions
    });

  } catch (error) {
    console.error('Image deletion failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete images',
        details: error.message
      },
      { status: 500 }
    );
  }
}
