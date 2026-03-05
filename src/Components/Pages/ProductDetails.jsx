import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductByIdApi, toggleWishlistApi, getWishlistApi } from '../../Services/api';
import { base_url } from '../../Services/base_url';
import { ChevronRight, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import EditProduct from './EditProduct';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedType, setSelectedType] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const fetchProduct = async () => {
        setLoading(true);
        const [productResult, wishlistResult] = await Promise.all([
            getProductByIdApi(id),
            getWishlistApi()
        ]);

        if (productResult.success) {
            setProduct(productResult.data);
            if (productResult.data.variants?.length > 0) {
                setSelectedType(productResult.data.variants[0].type || productResult.data.variants[0].ram);
            }
        } else {
            toast.error(productResult.message || "Failed to fetch product details");
        }

        if (wishlistResult.success) {
            setIsWishlisted(wishlistResult.data.some(item => item._id === id));
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleToggleWishlist = async () => {
        try {
            const result = await toggleWishlistApi(id);
            if (result.success) {
                setIsWishlisted(!isWishlisted);
                toast.success(result.message);
            }
        } catch (error) {
            toast.error("Failed to update wishlist");
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
                <p className="text-gray-500 font-bold">Product not found</p>
                <Link to="/" className="text-brand-orange hover:underline">Back to Home</Link>
            </div>
        );
    }

    const currentVariant = product.variants.find(v => (v.type || v.ram) === selectedType) || product.variants[0];

    return (
        <div className="min-h-screen bg-gray-50/30 pt-6 md:pt-8 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 md:mb-10">
                    <Link to="/" className="hover:text-brand-navy transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-brand-navy font-medium">Product details</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="aspect-square rounded-[24px] md:rounded-[32px] border border-gray-200 bg-white overflow-hidden shadow-sm flex items-center justify-center p-6 md:p-8">
                            <img
                                src={product.images[selectedImage]?.startsWith('http') ? product.images[selectedImage] : `${base_url}${product.images[selectedImage]}`}
                                alt={product.name}
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Thumbnail row — scrollable on mobile */}
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-2xl border bg-white overflow-hidden transition-all duration-300 p-2 hover:cursor-pointer ${selectedImage === idx ? 'border-brand-orange ring-2 ring-brand-orange/10' : 'border-gray-200 hover:border-brand-navy'
                                        }`}
                                >
                                    <img
                                        src={img?.startsWith('http') ? img : `${base_url}${img}`}
                                        alt={`view ${idx}`}
                                        className="w-full h-full object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="space-y-6 md:space-y-8 pt-2 md:pt-4">
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-4xl font-black text-brand-navy tracking-tight">{product.name}</h1>
                            <div className="flex items-center gap-4 pt-2">
                                <span className="text-2xl md:text-3xl font-black text-brand-navy">${currentVariant.price.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Availability:</span>
                                <span className="flex items-center gap-1.5 text-green-500 font-bold text-sm">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    In stock
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">Hurry up! only {currentVariant.qty} product left in stock!</p>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Customization */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                                <span className="text-brand-navy font-bold text-sm w-16">Variant:</span>
                                <div className="flex gap-2 flex-wrap">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.type || v.ram}
                                            onClick={() => setSelectedType(v.type || v.ram)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:cursor-pointer ${selectedType === (v.type || v.ram)
                                                ? 'bg-gray-100 text-brand-navy border border-gray-300 shadow-sm'
                                                : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
                                                }`}
                                        >
                                            {v.type || v.ram}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 md:gap-6">
                                <span className="text-brand-navy font-bold text-sm w-16">Quantity :</span>
                                <div className="flex items-center bg-gray-100/50 rounded-lg p-1 border border-gray-100">
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="p-1 px-3 hover:text-brand-orange transition-colors hover:cursor-pointer"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center font-black text-brand-navy">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(prev => Math.min(currentVariant.qty, prev + 1))}
                                        className="p-1 px-3 hover:text-brand-orange transition-colors hover:cursor-pointer"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 md:gap-4 pt-4 flex-wrap">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex-1 min-w-[140px] bg-brand-orange text-white h-12 md:h-14 rounded-2xl font-black tracking-widest hover:shadow-xl hover:shadow-brand-orange/20 active:scale-[0.98] transition-all hover:cursor-pointer text-sm"
                            >
                                EDIT PRODUCT
                            </button>
                            <button className="flex-1 min-w-[140px] bg-brand-orange text-white h-12 md:h-14 rounded-2xl font-black tracking-widest hover:shadow-xl hover:shadow-brand-orange/20 active:scale-[0.98] transition-all hover:cursor-pointer text-sm">
                                BUY IT NOW
                            </button>
                            <button
                                onClick={handleToggleWishlist}
                                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all border shadow-sm hover:cursor-pointer ${isWishlisted
                                    ? 'bg-red-50 text-red-500 border-red-100'
                                    : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 border-transparent hover:border-red-100'
                                    }`}
                            >
                                <Heart className={`h-5 w-5 md:h-6 md:w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Description */}
                        <div className="pt-4 md:pt-6">
                            <h3 className="text-brand-navy font-bold text-sm mb-2">Description</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {product.description || "No description available for this product."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <EditProduct
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    fetchProduct();
                }}
                product={product}
            />
        </div>
    );
};

export default ProductDetails;
