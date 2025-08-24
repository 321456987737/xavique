import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: [
      {
        fileId: { type: String, required: true },
        url: { type: String, required: true },
        alt: { type: String },
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    stockQuantity: {
      type: Number,
      default: 0,
    },

    // Main Category: Men, Women, Kids
    category: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Kids'],
    },

    // Subcategory: Shoes, Caps, Sunglasses, Bags, Shirts, Jeans, etc.
    subcategory: {
      type: String,
      required: true,
      enum: [
  // New
  'Latest Releases',
  'Trending Now',
  'Seasonal Picks',
  'Spring Collection',
  'Summer Collection',
  'Winter Collection',
  "Editor's Choice",
  'Dresses',
  'Bags',
  'Shoes',
  'Jeans',
  'T-Shirts',
  'Jackets',
  'Sweaters',
  'Hoodies',
  'Handbags',
  'Jewelry',
  'Necklaces',
  'Bracelets',
  'Earrings',
  'Rings',
  'Belts',
  'Watches',
  'Sunglasses',
  'Scarves',
  'Gloves',
  'Formal Wear',
  'Sportswear',
  'Accessories',
  'Shoes',
  'Shirts',
  'Jeans',
  'T-Shirts',
  'Jackets',
  'Sweaters',
  'Hoodies',
  'Belts',
  'Watches',
  'Luxury',
  'Sport',
  'Classic',
  'Wallets',
  'Sunglasses',
  'Caps',
  'Formal Wear',
  'Sportswear',
  'Accessories',
  'Shoes',
  'T-Shirts',
  'Shorts',
  'Jeans',
  'Jackets',
  'Sweaters',
  'Hoodies',
  'Caps',
  'Sportswear',
  'Accessories'
]

    },

    brand: {
      type: String,
    },

    sizes: [String], // e.g., ['S', 'M', 'L', 'XL', '42', '44']
    colors: [String], // e.g., ['black', 'white', 'red']

    tags: [String], // for searchability, e.g., ['running', 'leather', 'sale']

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
