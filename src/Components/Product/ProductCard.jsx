import React from 'react';
import { Star, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-light-blue group relative">
            {/* Wishlist Button */}
            <button className="absolute top-4 right-4 p-2 rounded-full bg-brand-light-blue/50 text-brand-navy hover:text-red-500 hover:bg-red-50 transition-all z-10">
                <Heart className="h-4 w-4" />
            </button>

            {/* Product Image */}
            <div className="aspect-[4/3] rounded-xl bg-brand-light-blue flex items-center justify-center overflow-hidden mb-4 relative">
                <img
                    src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400"}
                    alt={product.name}
                    className="w-[80%] h-auto group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Product Info */}
            <div className="space-y-1">
                <h3 className="text-sm font-bold text-brand-navy truncate">{product.name}</h3>
                <p className="text-lg font-black text-brand-navy">
                    ${product.variants && product.variants.length > 0 ? product.variants[0].price : (product.price || '0.00')}
                </p>


                {/* Ratings */}
                <div className="flex items-center space-x-0.5 pt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-3 w-3 ${i < product.rating ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-200'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
