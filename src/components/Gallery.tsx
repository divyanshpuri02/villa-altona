import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    {
      url: "https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Villa Exterior",
      category: "Exterior"
    },
    {
      url: "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Grand Living Room",
      category: "Interior"
    },
    {
      url: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Master Suite",
      category: "Bedroom"
    },
    {
      url: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Infinity Pool",
      category: "Amenities"
    },
    {
      url: "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Dining Pavilion",
      category: "Dining"
    },
    {
      url: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Gourmet Kitchen",
      category: "Kitchen"
    },
    {
      url: "https://images.pexels.com/photos/2029664/pexels-photo-2029664.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Tropical Gardens",
      category: "Gardens"
    },
    {
      url: "https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Spa Bathroom",
      category: "Bathroom"
    },
  ];

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage! - 1);
  };

  const goToNext = () => {
    setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage! + 1);
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-black mb-6 font-serif">
            Visual <span className="text-gray-600">Journey</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Immerse yourself in the exquisite beauty of Villa Altona through our 
            curated collection of stunning photography.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <motion.div 
              key={index}
              className="group relative overflow-hidden rounded-xl cursor-pointer aspect-square"
              onClick={() => openLightbox(index)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Zoom Icon */}
              <motion.div
                className="absolute top-4 right-4 bg-white/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <ZoomIn className="h-5 w-5 text-black" />
              </motion.div>

              {/* Image Info */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-6 text-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
              >
                <h3 className="text-lg font-bold mb-1 font-serif">{image.title}</h3>
                <p className="text-sm text-blue-500">{image.category}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 z-50 flex items-center justify-center p-4"
          >
            <motion.button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-black hover:text-blue-500 transition-colors duration-200 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-10 w-10" />
            </motion.button>

            <motion.button
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-black hover:text-blue-500 transition-colors duration-200 z-10"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-12 w-12" />
            </motion.button>

            <motion.button
              onClick={goToNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-black hover:text-blue-500 transition-colors duration-200 z-10"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-12 w-12" />
            </motion.button>

            <motion.div
              className="max-w-6xl max-h-[90vh] flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={images[selectedImage].url}
                alt={images[selectedImage].title}
                className="max-w-full max-h-full object-contain rounded-lg luxury-shadow"
              />
              <motion.div
                className="text-center mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-black text-3xl font-bold mb-2 font-serif">
                  {images[selectedImage].title}
                </h3>
                <p className="text-blue-500 text-lg">
                  {images[selectedImage].category}
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-black bg-white/50 px-4 py-2 rounded-full border border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {selectedImage + 1} / {images.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}