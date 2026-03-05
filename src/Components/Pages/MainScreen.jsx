import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, Search, Loader2 } from 'lucide-react';
import ProductCard from '../Product/ProductCard';
import AddCategory from './AddCategory';

import AddSubCategory from './AddSubCategory';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import { getCategoriesApi, getSubCategoriesApi, getProductsApi } from '../../Services/api';

const MainScreen = ({ selectedCategoryId, setSelectedCategoryId, selectedSubCategoryId, setSelectedSubCategoryId, searchTerm }) => {
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(6);

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
        } else {
            setSubCategories([]);
        }
        setPage(1); // Reset page on category filter change
    }, [selectedCategoryId]);

    // Reset pagination when subcategory or search term changes
    useEffect(() => {
        setPage(1);
    }, [selectedSubCategoryId, searchTerm]);

    const fetchSubCategories = async (catId) => {
        const result = await getSubCategoriesApi(catId);
        if (result.success) {
            setSubCategories(result.data);
        }
    };

    // Fetch Products when Selection, Page or Search changes
    useEffect(() => {
        fetchProducts();
    }, [selectedCategoryId, selectedSubCategoryId, page, searchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        const params = { page, limit };
        if (selectedSubCategoryId) {
            params.subCategoryId = selectedSubCategoryId;
        } else if (selectedCategoryId) {
            params.categoryId = selectedCategoryId;
        }
        if (searchTerm) {
            params.search = searchTerm;
        }

        const result = await getProductsApi(params);
        if (result.success) {
            setProducts(result.data);
            setTotal(result.total);
        }
        setLoading(false);
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="flex-1 bg-gray-50/50 p-4 md:p-8 overflow-y-auto">
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
                    fetchProducts();
                }}
            />
            <EditProduct
                isOpen={!!editingProduct}
                product={editingProduct}
                onClose={() => {
                    setEditingProduct(null);
                    fetchProducts();
                }}
            />

            {/* Header / Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 flex-wrap gap-y-1">
                    <span
                        className="hover:text-brand-navy hover:cursor-pointer"
                        onClick={() => { setSelectedCategoryId(null); setSelectedSubCategoryId(null); }}
                    >Home</span>
                    <ChevronRight className="h-3 w-3" />
                    <select
                        className="bg-transparent outline-none hover:cursor-pointer text-brand-navy border-none focus:ring-0 appearance-none font-bold"
                        value={selectedCategoryId || ''}
                        onChange={(e) => {
                            setSelectedCategoryId(e.target.value || null);
                            setSelectedSubCategoryId(null);
                        }}
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
                                className="bg-transparent outline-none hover:cursor-pointer text-brand-navy border-none focus:ring-0 appearance-none font-bold"
                                value={selectedSubCategoryId || ''}
                                onChange={(e) => setSelectedSubCategoryId(e.target.value || null)}
                            >
                                <option value="">Select Sub-Category</option>
                                {subCategories.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsAddCategoryOpen(true)}
                        className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full hover:shadow-lg transition-all hover:cursor-pointer"
                    >
                        Add category
                    </button>
                    <button
                        onClick={() => setIsAddSubCategoryOpen(true)}
                        className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full hover:shadow-lg transition-all hover:cursor-pointer"
                    >
                        Add sub category
                    </button>
                    <button
                        onClick={() => setIsAddProductOpen(true)}
                        className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full hover:shadow-lg transition-all flex items-center space-x-2 hover:cursor-pointer"
                    >
                        <Plus className="h-3 w-3" />
                        <span>Add product</span>
                    </button>
                </div>
            </div>

            {/* Search Results Banner */}
            {searchTerm && (
                <div className="flex items-center gap-3 mb-5 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl px-5 py-3">
                    <Search className="h-4 w-4 text-brand-orange flex-shrink-0" />
                    <p className="text-sm font-semibold text-brand-navy">
                        {loading ? (
                            <span>Searching for <span className="text-brand-orange">&ldquo;{searchTerm}&rdquo;</span>...</span>
                        ) : (
                            <span>
                                {total > 0
                                    ? <>{total} result{total !== 1 ? 's' : ''} for <span className="text-brand-orange">&ldquo;{searchTerm}&rdquo;</span></>
                                    : <>No results for <span className="text-brand-orange">&ldquo;{searchTerm}&rdquo;</span></>}
                            </span>
                        )}
                    </p>
                </div>
            )}

            {/* Product Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                            {searchTerm ? `Searching for "${searchTerm}"` : 'Loading products...'}
                        </p>
                    </div>
                </div>
            ) : products.length > 0 ? (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {products.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onEdit={(p) => setEditingProduct(p)}
                            />
                        ))}
                    </div>

                    {/* Pagination UI */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-8 gap-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} of {total} products
                            </p>
                            <div className="flex items-center gap-2 flex-wrap justify-center">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 text-brand-navy hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm hover:cursor-pointer"
                                >
                                    Prev
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-10 h-10 rounded-lg text-[10px] font-black transition-all hover:cursor-pointer ${page === i + 1
                                            ? 'bg-brand-orange text-white shadow-lg'
                                            : 'bg-white border border-gray-200 text-brand-navy hover:bg-gray-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 text-brand-navy hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm hover:cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white rounded-[40px] shadow-sm border border-gray-100/50">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                        {searchTerm
                            ? <Search className="h-6 w-6 text-gray-300" />
                            : <Plus className="h-6 w-6 text-gray-300 rotate-45" />}
                    </div>
                    <p className="text-brand-navy font-black uppercase tracking-widest text-xs">No products found</p>
                    <p className="text-gray-400 text-[11px] mt-2 font-medium text-center px-4">
                        {searchTerm
                            ? `No products match "${searchTerm}". Try a different search.`
                            : !selectedCategoryId
                                ? 'Select a category to start exploring'
                                : 'This category has no products yet'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MainScreen;
