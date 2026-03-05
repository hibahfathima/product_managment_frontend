import React, { useState, useEffect } from 'react';
import { addProductApi, getCategoriesApi, getSubCategoriesApi } from '../../Services/api';
import { toast } from 'react-toastify';
import { Plus, Minus, ImagePlus, ChevronDown, X } from 'lucide-react';

const AddProduct = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [variants, setVariants] = useState([{ ram: '4 GB', price: '', qty: 1 }]);
    const [subCategoryId, setSubCategoryId] = useState('');
    const [images, setImages] = useState([
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400"
    ]); // Initial dummy images as seen in screenshot

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await getCategoriesApi();
            if (result.success) {
                setCategories(result.data);
            }
        };
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchSubCategories = async () => {
            if (selectedCategoryId) {
                const result = await getSubCategoriesApi(selectedCategoryId);
                if (result.success) {
                    setSubCategories(result.data);
                }
            } else {
                setSubCategories([]);
            }
        };
        fetchSubCategories();
    }, [selectedCategoryId]);

    const handleAddVariant = () => {
        setVariants([...variants, { ram: '', price: '', qty: 1 }]);
    };

    const handleRemoveVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleQtyChange = (index, delta) => {
        const newVariants = [...variants];
        newVariants[index].qty = Math.max(1, newVariants[index].qty + delta);
        setVariants(newVariants);
    };

    const handleSubmit = async () => {
        if (!name) return toast.warning("Please enter product title");
        if (!subCategoryId) return toast.warning("Please select sub-category");
        if (variants.some(v => !v.ram || !v.price)) return toast.warning("Please fill all variant details");

        const payload = {
            name,
            description,
            variants,
            subCategoryId,
            images
        };

        const result = await addProductApi(payload);
        if (result.success) {
            toast.success(result.message || "Product added successfully");
            onClose();
            // Reset state
            setName('');
            setDescription('');
            setVariants([{ ram: '4 GB', price: '', qty: 1 }]);
            setSubCategoryId('');
            setSelectedCategoryId('');
        } else {
            toast.error(result.message || "Failed to add product");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-3xl rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-y-auto max-h-[95vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-6">
                    <h2 className="text-brand-navy font-black text-xl tracking-tight text-center">Add Product</h2>

                    <div className="space-y-4">
                        {/* Title Row */}
                        <div className="grid grid-cols-[140px,1fr] items-center gap-6">
                            <label className="text-gray-400 font-semibold text-base">Title :</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-5 py-2.5 text-sm focus:border-brand-orange outline-none transition-all"
                                placeholder="Enter product title"
                            />
                        </div>

                        {/* Variants Section */}
                        <div className="grid grid-cols-[140px,1fr] gap-6">
                            <label className="text-gray-400 font-semibold text-base pt-2">Variants :</label>
                            <div className="space-y-3">
                                {variants.map((variant, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs">Ram:</span>
                                            <input
                                                type="text"
                                                value={variant.ram}
                                                onChange={(e) => handleVariantChange(index, 'ram', e.target.value)}
                                                className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-orange"
                                                placeholder="4 GB"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs">Price:</span>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                    className="w-24 border border-gray-200 rounded-lg pl-6 pr-3 py-2 text-xs outline-none focus:border-brand-orange"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs">QTY:</span>
                                            <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1 gap-3">
                                                <button onClick={() => handleQtyChange(index, -1)} className="text-gray-400 hover:text-brand-navy"><ChevronDown className="h-3 w-3 rotate-90" /></button>
                                                <span className="text-xs font-bold w-3 text-center">{variant.qty}</span>
                                                <button onClick={() => handleQtyChange(index, 1)} className="text-gray-400 hover:text-brand-navy"><ChevronDown className="h-3 w-3 -rotate-90" /></button>
                                            </div>
                                        </div>
                                        {variants.length > 1 && (
                                            <button onClick={() => handleRemoveVariant(index)} className="text-red-400 hover:text-red-500 p-1">
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={handleAddVariant}
                                    className="bg-brand-navy text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-navy/90 transition-all"
                                >
                                    Add variants
                                </button>
                            </div>
                        </div>

                        {/* Category Row */}
                        <div className="grid grid-cols-[140px,1fr] items-center gap-6">
                            <label className="text-gray-400 font-semibold text-base">Sub category :</label>
                            <div className="flex gap-4">
                                <select
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    value={selectedCategoryId}
                                    className="flex-1 border border-gray-200 rounded-xl px-5 py-2.5 text-sm focus:border-brand-orange outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:16px]"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                                >
                                    <option value="">Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                <select
                                    onChange={(e) => setSubCategoryId(e.target.value)}
                                    value={subCategoryId}
                                    disabled={!selectedCategoryId}
                                    className="flex-1 border border-gray-200 rounded-xl px-5 py-2.5 text-sm focus:border-brand-orange outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:16px]"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                                >
                                    <option value="">Sub-Category</option>
                                    {subCategories.map((sub) => (
                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description Row */}
                        <div className="grid grid-cols-[140px,1fr] gap-6">
                            <label className="text-gray-400 font-semibold text-base pt-2">Description :</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="2"
                                className="w-full border border-gray-200 rounded-xl px-5 py-2.5 text-sm focus:border-brand-orange outline-none transition-all resize-none"
                                placeholder="Enter product description"
                            />
                        </div>

                        {/* Upload Image Row */}
                        <div className="grid grid-cols-[140px,1fr] items-start gap-6">
                            <label className="text-gray-400 font-semibold text-base pt-2">Upload image:</label>
                            <div className="flex flex-wrap gap-3 pt-1">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group w-24 h-18 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </div>
                                ))}
                                <button className="w-24 h-18 min-h-[72px] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-brand-orange hover:bg-orange-50/30 transition-all group text-gray-300">
                                    <ImagePlus className="h-6 w-6 group-hover:text-brand-orange" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            onClick={handleSubmit}
                            className="bg-brand-orange text-white px-10 py-3 rounded-xl font-black text-xs tracking-widest hover:shadow-lg active:scale-95 transition-all uppercase"
                        >
                            Add
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-100 text-brand-navy px-10 py-3 rounded-xl font-black text-xs tracking-widest hover:bg-gray-200 active:scale-95 transition-all uppercase"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
};

export default AddProduct;

