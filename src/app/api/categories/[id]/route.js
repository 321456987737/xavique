// app/api/categories/route.js
import { dbConnect } from "@/lib/db";
import Category from "@/model/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  
  try {
    const categories = await Category.find().lean();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();
  
  try {
    const { name, slug, parent, status } = await req.json();
    
    // Check if slug exists
    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }
    
    const newCategory = await Category.create({ 
      name, 
      slug, 
      parent: parent || null, 
      status 
    });
    
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Category creation failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = await params;
  
  try {
    const { name, slug, parent, status } = await req.json();
    
    // Check if slug exists for other categories
    const existingSlug = await Category.findOne({ slug, _id: { $ne: id } });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug, parent: parent || null, status },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  console.log(1);
  await dbConnect();
  const { id } = await params;
  console.log(2)
  try {
    // Recursive delete function
    const deleteCategoryAndChildren = async (categoryId) => {
      const children = await Category.find({ parent: categoryId });
  console.log(3)
      
      for (const child of children) {
        await deleteCategoryAndChildren(child._id);
      }
        console.log(4)

      await Category.findByIdAndDelete(categoryId);
    };
    
    await deleteCategoryAndChildren(id);
      console.log(5)

    return NextResponse.json({ 
      success: true, 
      message: "Category and all subcategories deleted" 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Delete operation failed" },
      { status: 500 }
    );
  }
}