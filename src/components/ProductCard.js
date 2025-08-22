'use client';

import { Heart } from 'lucide-react';
import GalleryCarousel from './GalleryCarousel';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function ProductCard({ product, router }) {
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load wishlist state when component mounts or user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await axios.get(`/api/wishlist?userId=${session.user.id}`);
        const wishlistItems = res.data.wishlist?.items || [];

        setIsWishlisted(
          wishlistItems.some(
            (item) => item.productId && item.productId._id === product._id
          )
        );
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      }
    };
    fetchWishlist();
  }, [session?.user?.id, product._id]);

  const handleWishlistClick = async (e) => {
    e.stopPropagation();

    if (!session) {
      toast.error('Please sign in to save wishlist', {
        style: {
          borderRadius: '8px',
          background: '#0A0A0A',
          color: '#fff',
          fontSize: '14px',
          padding: '12px 16px',
          border: '1px solid #D4AF37',
        },
        iconTheme: { primary: '#FF4C4C', secondary: '#0A0A0A' },
      });
      return;
    }

    try {
      const res = await axios.post('/api/wishlist', {
        userId: session.user.id,
        productId: product._id,
      });

      setIsWishlisted(!res.data.removed); // use server response for consistency

      if (res.data.removed) {
        toast.error(`${product.title} removed from wishlist`, {
          style: {
            borderRadius: '8px',
            background: '#0A0A0A',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 16px',
            border: '1px solid #D4AF37',
          },
          iconTheme: { primary: '#FF4C4C', secondary: '#0A0A0A' },
        });
      } else {
        toast.success(`${product.title} added to wishlist`, {
          style: {
            borderRadius: '8px',
            background: '#0A0A0A',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 16px',
            border: '1px solid #D4AF37',
          },
          iconTheme: { primary: '#D4AF37', secondary: '#0A0A0A' },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating wishlist');
    }
  };

  return (
    <div className="relative hover:scale-101 hover:z-10 transition-all group">
      <div
        onClick={() => router.push(`/singleproduct/${product._id}`)}
        className="rounded-xl hover:shadow-[0_0_20px_#D4AF37] shadow-[#D4AF37] hover:border hover:border-[#D4AF37] relative overflow-hidden aspect-[3/4] cursor-pointer"
      >
        {/* Top Right Icons */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            onClick={handleWishlistClick}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
          >
            <Heart
              className="w-5 h-5 text-[#D4AF37]"
              fill={isWishlisted ? '#D4AF37' : 'transparent'}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Product Images Carousel */}
        <GalleryCarousel
          images={product.images}
          title={product.title}
          category={product.category}
          price={product.discountPrice || product.price}
          originalPrice={product.discountPrice ? product.price : null}
        />
      </div>
    </div>
  );
}

// 'use client';

// import { Heart } from 'lucide-react';
// import GalleryCarousel from './GalleryCarousel';
// import axios from 'axios';
// import { useSession } from 'next-auth/react';
// import toast from 'react-hot-toast';
// import { useEffect, useState } from 'react';

// export default function ProductCard({ product, router }) {
//   const { data: session } = useSession();
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   // Optionally, preload wishlist state if needed
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (!session?.user?.id) return;
//       const res = await axios.get(`/api/wishlist?userId=${session.user.id}`);
//       const wishlistItems = res.data.wishlist?.items || [];
//       setIsWishlisted(
//         wishlistItems.some((item) => item.productId._id === product._id)
//       );
//     };
//     fetchWishlist();
//   }, [session?.user?.id, product._id]);

//   const handleWishlistClick = async (e) => {
//     e.stopPropagation();

//     if (!session) {
//       toast.error('Please sign in to save wishlist', {
//         style: {
//           borderRadius: '8px',
//           background: '#0A0A0A',
//           color: '#fff',
//           fontSize: '14px',
//           padding: '12px 16px',
//           border: '1px solid #D4AF37',
//         },
//         iconTheme: { primary: '#FF4C4C', secondary: '#0A0A0A' },
//       });
//       return;
//     }

//     try {
//       const res = await axios.post('/api/wishlist', {
//         userId: session.user.id,
//         productId: product._id,
//       });

//       setIsWishlisted(!isWishlisted);

//       if (res.data.removed) {
//         toast.error(`${product.title} removed from wishlist`, {
//           style: {
//             borderRadius: '8px',
//             background: '#0A0A0A',
//             color: '#fff',
//             fontSize: '14px',
//             padding: '12px 16px',
//             border: '1px solid #D4AF37',
//           },
//           iconTheme: { primary: '#FF4C4C', secondary: '#0A0A0A' },
//         });
//       } else {
//         toast.success(`${product.title} added to wishlist`, {
//           style: {
//             borderRadius: '8px',
//             background: '#0A0A0A',
//             color: '#fff',
//             fontSize: '14px',
//             padding: '12px 16px',
//             border: '1px solid #D4AF37',
//           },
//           iconTheme: { primary: '#D4AF37', secondary: '#0A0A0A' },
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Error updating wishlist');
//     }
//   };

//   return (
//     <div className="relative hover:scale-101 hover:z-10 transition-all group">
//       <div
//         onClick={() => router.push(`/singleproduct/${product._id}`)}
//         className="rounded-xl hover:shadow-[0_0_20px_#D4AF37] shadow-[#D4AF37] hover:border hover:border-[#D4AF37] relative overflow-hidden aspect-[3/4] cursor-pointer"
//       >
//         {/* Top Right Icons */}
//         <div className="absolute top-3 right-3 z-20 flex gap-2">
//           <button
//             onClick={handleWishlistClick}
//             className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
//           >
//             <Heart
//               className="w-5 h-5 text-[#D4AF37]"
//               fill={isWishlisted ? '#D4AF37' : 'transparent'}
//               strokeWidth={1.5}
//             />
//           </button>
//         </div>

//         {/* Product Images Carousel */}
//         <GalleryCarousel
//           images={product.images}
//           title={product.title}
//           category={product.category}
//           price={product.discountPrice || product.price}
//           originalPrice={product.discountPrice ? product.price : null}
//         />
//       </div>
//     </div>
//   );
// }
