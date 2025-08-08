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
        'Shoes',
        'Shirts',
        'Jeans',
        'Bags',
        'Sunglasses',
        'Caps',
        'Accessories',
      ],
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
