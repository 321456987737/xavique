import imageKitConfig from "@/lib/imagekit";
import { NextResponse } from "next/server";

// Handle image uploads
export async function POST(request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('images');
        
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                
                const result = await imageKitConfig.upload({
                    file: buffer,
                    fileName: `product-${Date.now()}-${file.name}`,
                    folder: "/products"
                });

                return {
                    url: result.url,
                    fileId: result.fileId,
                    thumbnailUrl: result.thumbnailUrl
                };
            })
        );

        return NextResponse.json({ 
            success: true, 
            files: uploadedFiles 
        });

    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

// Handle image deletions
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json({ 
                success: false, 
                error: 'File ID required' 
            }, { status: 400 });
        }

        await imageKitConfig.deleteFile(fileId);
        return NextResponse.json({ 
            success: true 
        });

    } catch (error) {
        console.error('Delete failed:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}