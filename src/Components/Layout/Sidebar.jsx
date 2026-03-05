import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getCategoriesApi, getSubCategoriesApi } from '../../Services/api';

const Sidebar = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({}); // { categoryId: boolean }
    const [subCategories, setSubCategories] = useState({}); // { categoryId: subCategories[] }

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
    }, []);

    const toggleCategory = async (categoryId) => {
        const isCurrentlyExpanded = expandedCategories[categoryId];

        // Toggle expanded state
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !isCurrentlyExpanded
        }));

        // If expanding and don't have subcategories yet, fetch them
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

    return (
        <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col space-y-8 h-[calc(100vh-80px)] overflow-y-auto">
            <div>
                <h2 className="text-brand-navy font-black text-xs uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Categories</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-gray-500 hover:text-brand-navy cursor-pointer transition-colors group">
                        <span className="text-sm font-semibold">All categories</span>
                    </div>

                    <div className="space-y-1">
                        {categories?.map((category) => (
                            <div key={category._id} className="space-y-2">
                                <div
                                    className={`flex items-center justify-between cursor-pointer transition-all py-1 ${expandedCategories[category._id] ? 'text-brand-navy' : 'text-gray-600 hover:text-brand-navy'}`}
                                    onClick={() => toggleCategory(category._id)}
                                >
                                    <span className={`text-sm ${expandedCategories[category._id] ? 'font-bold' : 'font-semibold'}`}>
                                        {category.name}
                                    </span>
                                    {expandedCategories[category._id] ?
                                        <ChevronDown className="h-4 w-4 opacity-70" /> :
                                        <ChevronRight className="h-4 w-4 opacity-40 hover:opacity-100" />
                                    }
                                </div>

                                {/* Dynamic Sub-Categories */}
                                {expandedCategories[category._id] && (
                                    <div className="pl-4 space-y-2 border-l-2 border-brand-light-blue/30 ml-1 animate-in slide-in-from-top-1 duration-200">
                                        {subCategories[category._id] && subCategories[category._id].length > 0 ? (
                                            subCategories[category._id].map((sub) => (
                                                <label key={sub._id} className="flex items-center space-x-3 cursor-pointer group py-0.5">
                                                    <div className="w-3.5 h-3.5 border-2 border-gray-200 rounded-sm transition-all group-hover:border-brand-navy flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-brand-navy rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500 group-hover:text-brand-navy transition-colors">
                                                        {sub.name}
                                                    </span>
                                                </label>
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
    );
};

export default Sidebar;

