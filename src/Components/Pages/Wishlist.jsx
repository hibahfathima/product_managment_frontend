import React, { useState, useEffect } from 'react';
import Navbar from '../Layout/Navbar';
import ProductCard from '../Product/ProductCard';
import { getWishlistApi } from '../../Services/api';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const result = await getWishlistApi();
            if (result.success) {
                setProducts(result.data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="flex-1 bg-gray-50/50 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-brand-navy hover:cursor-pointer"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-2xl font-black text-brand-navy tracking-tight">My Wishlist</h1>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {products.length} Items
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products
                                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(product => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onWishlistToggle={fetchWishlist}
                                        isWishlistedPage={true}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] shadow-sm border border-gray-100/50">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                                <div className="text-gray-300 text-3xl">❤️</div>
                            </div>
                            <p className="text-brand-navy font-black uppercase tracking-widest text-xs">Your wishlist is empty</p>
                            <p className="text-gray-400 text-[11px] mt-2 font-medium">
                                Browse products and tap the heart icon to save them here.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-6 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:shadow-lg transition-all hover:cursor-pointer"
                            >
                                Explore Products
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
