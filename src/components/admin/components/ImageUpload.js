import { useState, useRef } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ImageUpload({ images = [], onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const response = await axios.post('/api/upload', formData, {
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        const newImages = response.data.images.map(image => ({
          url: image.url,
          fileId: image.fileId,
          alt: ''
        }));

        const currentImages = Array.isArray(images) ? images : [];
        onChange([...currentImages, ...newImages]);
        toast.success('Images uploaded successfully!');
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageDelete = async (index) => {
    const image = images[index];
    
    // Check if we have a valid fileId
    if (!image?.fileId) {
      console.error('No valid fileId found for image:', image);
      return;
    }

    try {
      await axios.post('/api/delete-images', { 
        fileIds: [image.fileId] 
      });
      
      const updatedImages = images.filter((_, i) => i !== index);
      onChange(updatedImages);
      toast.success('Image removed successfully');
    } catch (error) {
      toast.error('Failed to remove image');
      console.error('Delete error:', error);
    }
  };
  const handleAltTextChange = (index, altText) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      alt: altText
    };
    onChange(updatedImages);
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-[#D4AF37]/50 rounded-lg">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        
        <motion.button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: isUploading ? 1 : 1.01 }}
          whileTap={{ scale: isUploading ? 1 : 0.99 }}
          className={`w-full p-8 flex flex-col items-center gap-3 transition-opacity ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isUploading}
        >
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <Upload className={`w-8 h-8 text-[#D4AF37] ${isUploading ? 'animate-pulse' : ''}`} />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-[#D4AF37]">
              {isUploading ? 'Uploading...' : 'Click to upload images'}
            </p>
            <p className="text-sm text-[#F6F5F3]/70 mt-1">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>

          {isUploading && (
            <div className="w-full max-w-xs">
              <div className="bg-[#2E2E2E] h-2 rounded-full mt-4">
                <motion.div 
                  className="bg-[#D4AF37] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-center text-[#F6F5F3]/70 mt-2">
                {uploadProgress}%
              </p>
            </div>
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="popLayout">
        {images?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={`${image.fileId || image.url}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square"
              >
                <img
                  src={image.url}
                  alt={image.alt || `Product image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', image.url);
                    e.target.style.display = 'none';
                  }}
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                
                <motion.button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>

                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(e) => handleAltTextChange(index, e.target.value)}
                  placeholder="Image description"
                  className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none border-0 focus:ring-1 focus:ring-[#D4AF37]"
                />
                
                {/* Image index indicator */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{index + 1}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Images summary */}
      {images?.length > 0 && (
        <div className="text-sm text-[#F6F5F3]/70 text-center">
          {images.length} image{images.length !== 1 ? 's' : ''} uploaded
        </div>
      )}
    </div>
  );
}
// import { useState, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Upload, X, Image as ImageIcon } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';

// export default function ImageUpload({ images = [], onChange }) {
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef(null);


//   const handleFileUpload = async (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length === 0) return;

//     setIsUploading(true);
//     const formData = new FormData();
//     files.forEach(file => formData.append('images', file));

//     try {
//       const response = await axios.post('/api/upload', formData, {
//         onUploadProgress: (event) => {
//           const progress = Math.round((event.loaded * 100) / event.total);
//           setUploadProgress(progress);
//         }
//       });

//       if (response.data.success) {
//         const newImages = response.data.files.map(file => ({
//           url: file.url,
//           fileId: file.fileId,
//           alt: ''
//         }));

//         // Fix: Ensure images is an array before spreading
//         const currentImages = Array.isArray(images) ? images : [];
//         onChange([...currentImages, ...newImages]);
//         toast.success('Images uploaded successfully!');
//       }
//     } catch (error) {
//       toast.error('Upload failed. Please try again.');
//       console.error(error);
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   const handleImageDelete = async (index) => {
//     const image = images[index];
    
//     try {
//       await axios.delete(`/api/upload?fileId=${image.fileId}`);
//       const updatedImages = images.filter((_, i) => i !== index);
//       onChange(updatedImages);
//       toast.success('Image removed');
//     } catch (error) {
//       toast.error('Failed to remove image');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="border-2 border-dashed border-[#D4AF37]/50 rounded-lg">
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileUpload}
//           multiple
//           accept="image/*"
//           className="hidden"
//         />
        
//         <motion.button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           whileHover={{ scale: 1.01 }}
//           whileTap={{ scale: 0.99 }}
//           className="w-full p-8 flex flex-col items-center gap-3"
//           disabled={isUploading}
//         >
//           <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
//             <Upload className="w-8 h-8 text-[#D4AF37]" />
//           </div>
          
//           <div className="text-center">
//             <p className="text-lg font-medium text-[#D4AF37]">
//               {isUploading ? 'Uploading...' : 'Click to upload images'}
//             </p>
//             <p className="text-sm text-[#F6F5F3]/70 mt-1">
//               PNG, JPG, WEBP up to 10MB
//             </p>
//           </div>

//           {isUploading && (
//             <div className="w-full max-w-xs">
//               <div className="bg-[#2E2E2E] h-2 rounded-full mt-4">
//                 <motion.div 
//                   className="bg-[#D4AF37] h-2 rounded-full"
//                   initial={{ width: 0 }}
//                   animate={{ width: `${uploadProgress}%` }}
//                   transition={{ duration: 0.3 }}
//                 />
//               </div>
//               <p className="text-sm text-center text-[#F6F5F3]/70 mt-2">
//                 {uploadProgress}%
//               </p>
//             </div>
//           )}
//         </motion.button>
//       </div>

//       <AnimatePresence mode="popLayout">
//         {images?.length > 0 && (
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
//           >
//             {images.map((image, index) => (
//               <motion.div
//                 key={image.fileId}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 className="relative group aspect-square"
//               >
//                 <img
//                   src={image.url}
//                   alt={image.alt}
//                   className="w-full h-full object-cover rounded-lg"
//                 />
                
//                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                
//                 <motion.button
//                   onClick={() => handleImageDelete(index)}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <X className="w-4 h-4 text-white" />
//                 </motion.button>

//                 <input
//                   type="text"
//                   value={image.alt}
//                   onChange={(e) => {
//                     const updatedImages = [...images];
//                     updatedImages[index] = {
//                       ...image,
//                       alt: e.target.value
//                     };
//                     onChange(updatedImages);
//                   }}
//                   placeholder="Image description"
//                   className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 rounded text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none"
//                 />
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
