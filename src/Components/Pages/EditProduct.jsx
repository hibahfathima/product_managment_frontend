import { useState, useEffect } from 'react';
import { updateProductApi, getCategoriesApi, getSubCategoriesApi } from '../../Services/api';
import { base_url } from '../../Services/base_url';
import { toast } from 'react-toastify';
import { ImagePlus, ChevronDown, X } from 'lucide-react';

const EditProduct = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    const getImageUrl = (img) => {
        if (!img) return "";
        if (img.startsWith('http') || img.startsWith('blob:')) return img;
        return `${base_url}${img}`;
    };

    const [name, setName] = useState(product.name || '');
    const [description, setDescription] = useState(product.description || '');
    const [variants, setVariants] = useState(product.variants || [{ type: '', price: '', qty: 1 }]);
    const [subCategoryId, setSubCategoryId] = useState(product.subCategoryId?._id || product.subCategoryId || '');
    const [selectedCategoryId, setSelectedCategoryId] = useState(product.categoryId?._id || product.categoryId || '');

    const [existingImages, setExistingImages] = useState(product.images || []);
    const [newImages, setNewImages] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

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
        setVariants([...variants, { type: '', price: '', qty: 1 }]);
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

    const handleRemoveExistingImage = (idx) => {
        setExistingImages(existingImages.filter((_, i) => i !== idx));
    };

    const handleSubmit = async () => {
        if (!name) return toast.warning("Please enter product title");
        if (!subCategoryId) return toast.warning("Please select sub-category");
        if (variants.some(v => !v.type || !v.price)) return toast.warning("Please fill all variant details");
        if (existingImages.length === 0 && newImages.length === 0) return toast.warning("Please upload at least one image");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("subCategoryId", subCategoryId);
        formData.append("categoryId", selectedCategoryId);
        formData.append("variants", JSON.stringify(variants.map(v => ({ ...v, price: Number(v.price) }))));
        formData.append("existingImages", JSON.stringify(existingImages));

        newImages.forEach((image) => {
            formData.append("images", image);
        });

        const result = await updateProductApi(product._id, formData);
        if (result.success) {
            toast.success(result.message || "Product updated successfully");
            onClose();
        } else {
            toast.error(result.message || "Failed to update product");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-3xl rounded-t-[32px] sm:rounded-[32px] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-y-auto max-h-[95vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-5 md:space-y-6">
                    <h2 className="text-brand-navy font-black text-xl tracking-tight text-center">Edit Product</h2>

                    <div className="space-y-4">
                        {/* Title Row */}
                        <div className="flex flex-col sm:grid sm:grid-cols-[140px,1fr] items-start sm:items-center gap-2 sm:gap-6">
                            <label className="text-gray-400 font-semibold text-sm">Title :</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-5 py-2.5 text-sm focus:border-brand-orange outline-none transition-all"
                            />
                        </div>

                        {/* Variants */}
                        <div className="flex flex-col sm:grid sm:grid-cols-[140px,1fr] gap-2 sm:gap-6">
                            <label className="text-gray-400 font-semibold text-sm">Variants :</label>
                            <div className="space-y-3">
                                {variants.map((variant, index) => (
                                    <div key={index} className="flex flex-wrap items-center gap-2 md:gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs">Type:</span>
                                            <input
                                                type="text"
                                                value={variant.type}
                                                onChange={(e) => handleVariantChange(index, 'type', e.target.value)}
                                                className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-orange"
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
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs">QTY:</span>
                                            <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1 gap-3">
                                                <button onClick={() => handleQtyChange(index, -1)} className="text-gray-400 hover:text-brand-navy hover:cursor-pointer"><ChevronDown className="h-3 w-3 rotate-90" /></button>
                                                <span className="text-xs font-bold w-3 text-center">{variant.qty}</span>
                                                <button onClick={() => handleQtyChange(index, 1)} className="text-gray-400 hover:text-brand-navy hover:cursor-pointer"><ChevronDown className="h-3 w-3 -rotate-90" /></button>
                                            </div>
                                        </div>
                                        {variants.length > 1 && (
                                            <button onClick={() => handleRemoveVariant(index)} className="text-red-400 hover:text-red-500 p-1 hover:cursor-pointer">
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={handleAddVariant} className="bg-brand-navy text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-navy/90 transition-all hover:cursor-pointer">
                                    Add variants
                                </button>
                            </div>
                        </div>

                        {/* Category Row */}
                        <div className="flex flex-col sm:grid sm:grid-cols-[140px,1fr] items-start sm:items-center gap-2 sm:gap-6">
                            <label className="text-gray-400 font-semibold text-sm">Category :</label>
                            <div className="flex gap-3 w-full">
                                <select
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    value={selectedCategoryId}
                                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-brand-orange outline-none hover:cursor-pointer"
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
                                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-brand-orange outline-none hover:cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">Sub-Category</option>
                                    {subCategories.map((sub) => (
                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col sm:grid sm:grid-cols-[140px,1fr] gap-2 sm:gap-6">
                            <label className="text-gray-400 font-semibold text-sm">Description :</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="2"
                                className="w-full border border-gray-200 rounded-xl px-5 py-2.5 text-sm focus:border-brand-orange outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Images */}
                        <div className="flex flex-col sm:grid sm:grid-cols-[140px,1fr] items-start gap-2 sm:gap-6">
                            <label className="text-gray-400 font-semibold text-sm">Images:</label>
                            <div className="flex flex-wrap gap-3 pt-1">
                                {existingImages.map((img, idx) => (
                                    <div key={`old-${idx}`} className="relative group w-20 h-20 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                        <img src={getImageUrl(img)} alt="existing" className="w-full h-full object-cover" />
                                        <button onClick={() => handleRemoveExistingImage(idx)} className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 hover:cursor-pointer"><X className="h-2.5 w-2.5" /></button>
                                    </div>
                                ))}
                                {newPreviews.map((img, idx) => (
                                    <div key={`new-${idx}`} className="relative group w-20 h-20 rounded-xl border border-blue-100 overflow-hidden shadow-sm">
                                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                setNewImages(newImages.filter((_, i) => i !== idx));
                                                setNewPreviews(newPreviews.filter((_, i) => i !== idx));
                                            }}
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 hover:cursor-pointer"
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </div>
                                ))}
                                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-brand-orange hover:bg-orange-50/30 transition-all group text-gray-300 hover:cursor-pointer">
                                    <ImagePlus className="h-6 w-6 group-hover:text-brand-orange" />
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            setNewImages([...newImages, ...files]);
                                            const urls = files.map(file => URL.createObjectURL(file));
                                            setNewPreviews([...newPreviews, ...urls]);
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button onClick={handleSubmit} className="bg-brand-orange text-white px-8 md:px-10 py-3 rounded-xl font-black text-xs tracking-widest hover:shadow-lg active:scale-95 transition-all uppercase hover:cursor-pointer">
                            Update
                        </button>
                        <button onClick={onClose} className="bg-gray-100 text-brand-navy px-8 md:px-10 py-3 rounded-xl font-black text-xs tracking-widest hover:bg-gray-200 active:scale-95 transition-all uppercase hover:cursor-pointer">
                            Discard
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
};

export default EditProduct;
