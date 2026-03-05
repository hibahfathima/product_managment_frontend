import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, ChevronDown } from 'lucide-react';
import ProductCard from '../Product/ProductCard';
import AddCategory from './AddCategory';

import AddSubCategory from './AddSubCategory';
import AddProduct from './AddProduct';
import { getCategoriesApi, getSubCategoriesApi, getProductsApi } from '../../Services/api';

const MainScreen = () => {
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

    // Fetch Categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const result = await getCategoriesApi();
        if (result.success) {
            setCategories(result.data);
        }
    };

    // Fetch Sub-Categories when Category changes
    useEffect(() => {
        if (selectedCategoryId) {
            fetchSubCategories(selectedCategoryId);
            setSelectedSubCategoryId(null);
            setProducts([]);
        } else {
            setSubCategories([]);
            setProducts([]);
        }
    }, [selectedCategoryId]);

    const fetchSubCategories = async (catId) => {
        const result = await getSubCategoriesApi(catId);
        if (result.success) {
            setSubCategories(result.data);
        }
    };

    // Fetch Products when Sub-Category changes
    useEffect(() => {
        if (selectedSubCategoryId) {
            fetchProducts(selectedSubCategoryId);
        } else {
            setProducts([]);
        }
    }, [selectedSubCategoryId]);

    const fetchProducts = async (subCatId) => {
        const result = await getProductsApi(subCatId);
        if (result.success) {
            setProducts(result.data);
        }
    };

    return (
        <div className="flex-1 bg-gray-50/50 p-8 overflow-y-auto">
            {/* Modals */}
            <AddCategory
                isOpen={isAddCategoryOpen}
                onClose={() => {
                    setIsAddCategoryOpen(false);
                    fetchCategories();
                }}
            />
            <AddSubCategory
                isOpen={isAddSubCategoryOpen}
                onClose={() => {
                    setIsAddSubCategoryOpen(false);
                    if (selectedCategoryId) fetchSubCategories(selectedCategoryId);
                }}
            />
            <AddProduct
                isOpen={isAddProductOpen}
                onClose={() => {
                    setIsAddProductOpen(false);
                    if (selectedSubCategoryId) fetchProducts(selectedSubCategoryId);
                }}
            />

            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    <span className="hover:text-brand-navy cursor-pointer" onClick={() => { setSelectedCategoryId(null); setSelectedSubCategoryId(null); }}>Home</span>
                    <ChevronRight className="h-3 w-3" />
                    <select
                        className="bg-transparent outline-none cursor-pointer text-brand-navy border-none focus:ring-0 appearance-none"
                        value={selectedCategoryId || ''}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                    >
                        <option value="">All categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    {selectedCategoryId && (
                        <>
                            <ChevronRight className="h-3 w-3" />
                            <select
                                className="bg-transparent outline-none cursor-pointer text-brand-navy border-none focus:ring-0 appearance-none"
                                value={selectedSubCategoryId || ''}
                                onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                            >
                                <option value="">Select Sub-Category</option>
                                {subCategories.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={() => setIsAddCategoryOpen(true)}
                        className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                        <span>Add category</span>
                    </button>
                    <button
                        onClick={() => setIsAddSubCategoryOpen(true)}
                        className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                        <span>Add sub category</span>
                    </button>
                    <button
                        onClick={() => setIsAddProductOpen(true)}
                        className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                        <Plus className="h-3 w-3" />
                        <span>Add product</span>
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] shadow-sm border border-gray-100">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No products found</p>
                    <p className="text-gray-300 text-xs mt-2">Select a category and sub-category to view products</p>
                </div>
            )}

            {/* Footer / Pagination (Placeholder for now) */}
            <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
                <p className="text-xs font-bold text-gray-400">{products.length} products found</p>
            </div>
        </div>
    );
};

export default MainScreen;
