import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      try {
        // Get the file as a buffer
        const fileBuffer = await file.arrayBuffer();
        
        // Upload to ImageKit
        const result = await imagekit.upload({
          file: Buffer.from(fileBuffer),
          fileName: file.name,
          folder: '/ecommerce-products',
          useUniqueFileName: true
        });

        return {
          url: result.url,
          fileId: result.fileId,
          thumbnailUrl: `${result.url}?tr=w-300,h-300`
        };
      } catch (error) {
        console.error('Error uploading single file:', error);
        throw error;
      }
    });
    console.log(uploadPromises,"this si the upload promise")
      
    const results = await Promise.all(uploadPromises);
    console.log(results,"this si the results")
    return NextResponse.json({ 
      success: true,
      images: results 
    });

  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to upload images',
        details: error.message 
      },
      { status: 500 }
    );
  }
}