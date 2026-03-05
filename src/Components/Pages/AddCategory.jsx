import React, { useState } from 'react';
import { addCategoryApi } from '../../Services/api';
import { toast } from 'react-toastify';

const AddCategory = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [category, setCategory] = useState('');
    const addCategoty = async () => {
        try {
            const result = await addCategoryApi({ name: category });
            if (result.success) {
                toast.success(result.message || "Category added successfully");
                setCategory('');
                onClose();
            } else {
                toast.error(result.message || "Failed to add category");
            }
        } catch (error) {
            toast.error("Internal server error");
        }
    }



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Modal Container */}
            <div
                className="bg-white w-full max-w-sm rounded-[32px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center space-y-8">
                    <h2 className="text-brand-navy font-black text-lg tracking-tight">Add Category</h2>

                    <div className="space-y-6">
                        <input
                            onChange={(e) => setCategory(e.target.value)}
                            type="text"
                            placeholder="Enter category name"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-orange outline-none transition-all placeholder:text-gray-300"
                        />

                        <div className="flex items-center justify-center space-x-3 pt-2">
                            <button
                                onClick={addCategoty}
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

            {/* Background overlay click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
};

export default AddCategory;