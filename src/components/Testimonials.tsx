import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, India",
      time: "2 weeks ago",
      rating: 5,
      text: "Our stay at Villa Altona was nothing short of magical. The villa is beautifully decorated, and the views are simply stunning. The staff was incredibly attentive, and the private chef prepared delicious meals. We can't wait to return!",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      likes: 15,
      dislikes: 2
    },
    {
      name: "Rajesh Patel",
      location: "Delhi, India",
      time: "1 month ago",
      rating: 4,
      text: "We had a wonderful time at Villa Altona. The villa is spacious and well-maintained, and the pool area is perfect for relaxing. The location is ideal for exploring Goa, and we enjoyed visiting the nearby beaches and markets.",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      likes: 8,
      dislikes: 1
    }
  ];

  const ratingData = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 }
  ];

  return (
    <section id="testimonials" className="bg-neutral-50 py-8">
      <div className="px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
        >
          Guest Reviews
        </motion.h2>
        
        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-x-8 gap-y-6 mb-8"
        >
          <div className="flex flex-col gap-2">
            <p className="text-[#141414] text-4xl font-black leading-tight tracking-[-0.033em]">4.8</p>
            <div className="flex gap-0.5">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-[18px] h-[18px] fill-[#141414] text-[#141414]" />
              ))}
              <Star className="w-[18px] h-[18px] text-[#c2c2c2]" />
            </div>
            <p className="text-[#141414] text-base font-normal leading-normal">125 reviews</p>
          </div>
          
          <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
            {ratingData.map((rating) => (
              <React.Fragment key={rating.stars}>
                <p className="text-[#141414] text-sm font-normal leading-normal">{rating.stars}</p>
                <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#dbdbdb]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${rating.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="rounded-full bg-[#141414]"
                  />
                </div>
                <p className="text-neutral-500 text-sm font-normal leading-normal text-right">{rating.percentage}%</p>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Individual Reviews */}
        <div className="flex flex-col gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col gap-3 bg-neutral-50 p-4 rounded-lg border border-[#dbdbdb]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{ backgroundImage: `url("${testimonial.image}")` }}
                />
                <div className="flex-1">
                  <p className="text-[#141414] text-base font-medium leading-normal">{testimonial.name}</p>
                  <p className="text-neutral-500 text-sm font-normal leading-normal">{testimonial.time}</p>
                </div>
              </div>
              
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating 
                        ? 'fill-[#141414] text-[#141414]' 
                        : 'text-[#c2c2c2]'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-[#141414] text-base font-normal leading-normal">
                {testimonial.text}
              </p>
              
              <div className="flex gap-9 text-neutral-500">
                <button className="flex items-center gap-2 hover:text-[#141414] transition-colors duration-200">
                  <ThumbsUp className="w-5 h-5" />
                  <p>{testimonial.likes}</p>
                </button>
                <button className="flex items-center gap-2 hover:text-[#141414] transition-colors duration-200">
                  <ThumbsDown className="w-5 h-5" />
                  <p>{testimonial.dislikes}</p>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}