import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { getCategoriesApi, getSubCategoriesApi } from '../../Services/api';

const Sidebar = ({ selectedCategoryId, setSelectedCategoryId, selectedSubCategoryId, setSelectedSubCategoryId, setSearchTerm, isOpen, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [subCategories, setSubCategories] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoriesApi();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [categories]);

    const toggleCategory = async (categoryId) => {
        const isCurrentlyExpanded = expandedCategories[categoryId];

        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !isCurrentlyExpanded
        }));

        setSelectedCategoryId(categoryId);
        setSelectedSubCategoryId(null);
        setSearchTerm("");

        if (!isCurrentlyExpanded && !subCategories[categoryId]) {
            try {
                const response = await getSubCategoriesApi(categoryId);
                if (response.success) {
                    setSubCategories(prev => ({
                        ...prev,
                        [categoryId]: response.data
                    }));
                }
            } catch (error) {
                console.error("Error fetching sub-categories:", error);
            }
        }
    };

    const handleSubCategoryClick = (subId) => {
        setSelectedSubCategoryId(subId);
        if (onClose) onClose();
    };

    const handleAllCategories = () => {
        setSelectedCategoryId(null);
        setSelectedSubCategoryId(null);
        setSearchTerm("");
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel: drawer on mobile, static on md+ */}
            <aside className={`
                fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-100 p-6 overflow-y-auto
                transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:z-auto md:h-[calc(100vh-56px)] md:flex-shrink-0
                ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                {/* Mobile close button */}
                <div className="flex items-center justify-between mb-4 md:hidden">
                    <span className="font-black text-brand-navy text-sm uppercase tracking-widest">Menu</span>
                    <button onClick={onClose} className="p-1 hover:text-brand-orange transition-colors hover:cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div>
                    <h2 className="text-brand-navy font-black text-xs uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Categories</h2>

                    <div className="space-y-4">
                        <div
                            className={`flex items-center justify-between hover:cursor-pointer transition-colors group ${!selectedCategoryId ? 'text-brand-navy' : 'text-gray-500 hover:text-brand-navy'}`}
                            onClick={handleAllCategories}
                        >
                            <span className={`text-sm ${!selectedCategoryId ? 'font-bold' : 'font-semibold'}`}>All categories</span>
                        </div>

                        <div className="space-y-1">
                            {categories?.map((category) => (
                                <div key={category._id} className="space-y-2">
                                    <div
                                        className={`flex items-center justify-between hover:cursor-pointer transition-all py-1 ${selectedCategoryId === category._id ? 'text-brand-navy' : 'text-gray-600 hover:text-brand-navy'}`}
                                        onClick={() => toggleCategory(category._id)}
                                    >
                                        <span className={`text-sm ${selectedCategoryId === category._id ? 'font-bold' : 'font-semibold'}`}>
                                            {category.name}
                                        </span>
                                        {expandedCategories[category._id] ?
                                            <ChevronDown className="h-4 w-4 opacity-70" /> :
                                            <ChevronRight className="h-4 w-4 opacity-40 hover:opacity-100" />
                                        }
                                    </div>

                                    {expandedCategories[category._id] && (
                                        <div className="pl-4 space-y-2 border-l-2 border-gray-200 ml-1 animate-in slide-in-from-top-1 duration-200">
                                            {subCategories[category._id] && subCategories[category._id].length > 0 ? (
                                                subCategories[category._id].map((sub) => (
                                                    <div
                                                        key={sub._id}
                                                        className="flex items-center space-x-3 hover:cursor-pointer group py-0.5"
                                                        onClick={() => handleSubCategoryClick(sub._id)}
                                                    >
                                                        <div className={`w-3.5 h-3.5 border-2 rounded-sm transition-all flex items-center justify-center ${selectedSubCategoryId === sub._id ? 'border-brand-navy bg-brand-navy' : 'border-gray-200 group-hover:border-brand-navy'}`}>
                                                            {selectedSubCategoryId === sub._id && <div className="w-1 h-1 bg-white rounded-full"></div>}
                                                        </div>
                                                        <span className={`text-xs transition-colors ${selectedSubCategoryId === sub._id ? 'font-bold text-brand-navy' : 'font-medium text-gray-500 group-hover:text-brand-navy'}`}>
                                                            {sub.name}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-medium italic pl-1">No sub-categories</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
