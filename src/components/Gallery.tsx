import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const attractions = [
    {
      url: "https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Goan Beaches",
      description: "Explore the pristine beaches and crystal-clear waters of Goa."
    },
    {
      url: "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Old Goa Churches",
      description: "Discover the rich Portuguese heritage and stunning architecture."
    },
    {
      url: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Spice Plantations",
      description: "Visit the aromatic spice gardens and learn about local agriculture."
    },
    {
      url: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Water Sports",
      description: "Experience thrilling water activities and adventure sports."
    }
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
    setSelectedImage(selectedImage === 0 ? attractions.length - 1 : selectedImage! - 1);
  };

  const goToNext = () => {
    setSelectedImage(selectedImage === attractions.length - 1 ? 0 : selectedImage! + 1);
  };

  return (
    <section id="gallery" className="bg-neutral-50 py-8">
      <div className="px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Local Attractions
        </motion.h2>
        
        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch gap-3">
            {attractions.map((attraction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => openLightbox(index)}
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col transition-transform duration-300"
                  style={{ backgroundImage: `url("${attraction.url}")` }}
                />
                <div>
                  <p className="text-[#141414] text-base font-medium leading-normal" style={{ fontFamily: '"Noto Sans", sans-serif' }}>{attraction.title}</p>
                  <p className="text-neutral-500 text-sm font-normal leading-normal" style={{ fontFamily: '"Noto Sans", sans-serif' }}>{attraction.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-10 w-10" />
            </motion.button>

            <motion.button
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-12 w-12" />
            </motion.button>

            <motion.button
              onClick={goToNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-12 w-12" />
            </motion.button>

            <motion.div
              className="max-w-4xl max-h-[80vh] flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={attractions[selectedImage].url}
                alt={attractions[selectedImage].title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <motion.div
                className="text-center mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-white text-2xl font-bold mb-2">
                  {attractions[selectedImage].title}
                </h3>
                <p className="text-gray-300 text-lg">
                  {attractions[selectedImage].description}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}