import React, { useState, useEffect } from 'react';
import { addSubCategoryApi, getCategoriesApi } from '../../Services/api';
import { toast } from 'react-toastify';

const AddSubCategory = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [subCategory, setSubCategory] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await getCategoriesApi();
            if (result.success) {
                console.log(result)
                setCategories(result.data);
            }
        };
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const addSubCategoty = async () => {
        console.log(categoryId, subCategory)
        if (!categoryId) {
            toast.warning("Please select a category");
            return;
        }
        if (!subCategory.trim()) {
            toast.warning("Please enter a sub-category name");
            return;
        }

        try {
            const result = await addSubCategoryApi({ name: subCategory, categoryId });
            if (result.success) {
                toast.success(result.message || "Sub-Category added successfully");
                setSubCategory('');
                setCategoryId('');
                onClose();
            } else {
                toast.error(result.message || "Failed to add sub-category");
            }
        } catch (error) {
            toast.error("An error occurred while adding sub-category");
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-sm rounded-[32px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center space-y-8">
                    <h2 className="text-brand-navy font-black text-lg tracking-tight">Add Sub-Category</h2>

                    <div className="space-y-4 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Select Category</label>
                        <select
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-orange outline-none transition-all"
                            value={categoryId}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 mt-4 block">Sub-Category Name</label>
                        <input
                            onChange={(e) => setSubCategory(e.target.value)}
                            type="text"
                            placeholder="Enter sub-category name"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-orange outline-none transition-all placeholder:text-gray-300"
                            value={subCategory}
                        />

                        <div className="flex items-center justify-center space-x-3 pt-6">
                            <button
                                onClick={addSubCategoty}
                                className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
                            >
                                Add
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
};

export default AddSubCategory;
