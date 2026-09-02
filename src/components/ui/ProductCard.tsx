'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onClick, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="card-product group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(product)}
    >
      {/* Image / Video Area */}
      <div className="relative aspect-square overflow-hidden bg-cholesterol-gray">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-6xl">
            {product.name.charAt(0)}
          </div>
        )}

        {/* Video on hover */}
        {product.video_url && isHovered && (
          <video
            src={product.video_url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Featured badge */}
        {product.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-cholesterol-yellow text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
              ★ Popular
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Quick-add hint on hover */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 right-3"
        >
          <div className="w-8 h-8 rounded-full bg-cholesterol-yellow flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[13px] sm:text-[14px] leading-tight text-white group-hover:text-cholesterol-yellow transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
          <span className="font-bold text-cholesterol-yellow text-[13px] sm:text-[14px] whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>

        {product.description && (
          <p className="text-[11px] sm:text-xs text-white/40 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Prep time */}
        <div className="flex items-center gap-1.5 text-[10px] text-white/25">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          </svg>
          <span>{product.prep_time_minutes} min</span>
        </div>
      </div>
    </motion.div>
  );
}
