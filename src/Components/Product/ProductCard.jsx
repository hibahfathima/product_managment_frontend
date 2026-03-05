import { toggleWishlistApi } from '../../Services/api';
import { base_url } from '../../Services/base_url';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Heart, Edit } from 'lucide-react';

const ProductCard = ({ product, onWishlistToggle, onEdit, isWishlistedPage }) => {
    const [isWishlisted, setIsWishlisted] = useState(isWishlistedPage || false);
    const navigate = useNavigate();

    const getImageUrl = (img) => {
        if (!img) return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400";
        if (img.startsWith('http')) return img;
        return `${base_url}${img}`;
    };

    const handleWishlist = async (e) => {
        e.stopPropagation();
        try {
            const result = await toggleWishlistApi(product._id);
            if (result.success) {
                setIsWishlisted(!isWishlisted);
                toast.success(result.message);
                if (onWishlistToggle) onWishlistToggle();
            }
        } catch (error) {
            toast.error("Failed to update wishlist");
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        if (onEdit) onEdit(product);
    };

    return (
        <div
            onClick={() => navigate(`/product/${product._id}`)}
            className="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-brand-orange group relative cursor-pointer"
        >
            {/* Wishlist Button */}
            <button
                onClick={handleWishlist}
                className={`absolute top-6 right-6 p-2.5 rounded-2xl transition-all z-10 shadow-sm hover:cursor-pointer ${isWishlisted
                    ? 'bg-red-50 text-red-500'
                    : 'bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
            >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Edit Button */}
            {/* <button
                onClick={handleEdit}
                className="absolute top-20 right-6 p-2.5 rounded-2xl bg-white/80 backdrop-blur-md text-gray-400 hover:text-brand-orange hover:bg-orange-50 transition-all z-10 shadow-sm opacity-0 group-hover:opacity-100"
            >
                <Edit className="h-4 w-4" />
            </button> */}

            {/* Product Image */}
            <div className="aspect-[4/3] rounded-[24px] bg-gray-50 flex items-center justify-center overflow-hidden mb-6 relative">
                <img
                    src={getImageUrl(product.images && product.images.length > 0 ? product.images[0] : "")}
                    alt={product.name}
                    className="w-[85%] h-auto group-hover:scale-110 transition-transform duration-700 ease-out"
                />
            </div>

            {/* Product Info */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-brand-navy truncate flex-1">{product.name}</h3>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Starting from</p>
                        <p className="text-xl font-black text-brand-navy">
                            ${product.variants && product.variants.length > 0 ? product.variants[0].price : '0.00'}
                        </p>
                    </div>
                    <div className="bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {product.variants?.length || 0} Variants
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
