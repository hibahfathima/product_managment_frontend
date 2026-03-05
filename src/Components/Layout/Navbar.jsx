import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, LogOut, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ searchTerm, setSearchTerm, onMenuToggle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(false);

    // Local input state — debounced into the parent searchTerm
    const [inputValue, setInputValue] = useState(searchTerm);
    const debounceRef = useRef(null);

    // Sync inputValue if parent resets searchTerm externally (e.g. clicking a category)
    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        // Debounce: wait 400ms after the user stops typing before updating parent
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchTerm(val);
        }, 400);
    };

    const handleClear = () => {
        setInputValue('');
        setSearchTerm('');
        clearTimeout(debounceRef.current);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-brand-navy px-4 md:px-8 py-3 md:py-4 flex items-center justify-between text-white shadow-md flex-shrink-0">
            {/* Left: Hamburger (mobile) + Brand */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors hover:cursor-pointer"
                    aria-label="Toggle menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <span className="font-black text-brand-orange text-sm tracking-widest hidden sm:block">PRODIFY</span>
            </div>

            {/* Center: Search Bar */}
            <div className={`flex-1 flex justify-center mx-2 md:mx-6 ${showSearch ? 'flex' : 'hidden md:flex'}`}>
                <div className="relative w-full max-w-xl flex">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Search products..."
                            className="w-full bg-white text-gray-800 rounded-l-lg px-4 md:px-6 py-2 md:py-2.5 outline-none text-sm placeholder:text-gray-400 pr-8"
                        />
                        {/* Clear button — shown when there is text */}
                        {inputValue && (
                            <button
                                onClick={handleClear}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setSearchTerm(inputValue)}
                        className="bg-brand-orange px-4 md:px-8 rounded-r-lg font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition-colors hover:cursor-pointer flex items-center gap-1"
                    >
                        <Search className="h-4 w-4 md:hidden" />
                        <span className="hidden md:inline">Search</span>
                    </button>
                </div>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-3 md:gap-6 ml-2">
                {/* Mobile search toggle */}
                <button
                    className="md:hidden p-1 hover:text-brand-orange transition-colors hover:cursor-pointer"
                    onClick={() => setShowSearch(!showSearch)}
                    aria-label="Toggle search"
                >
                    {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </button>

                {/* Wishlist */}
                <div
                    className="flex items-center gap-1 md:gap-2 group hover:cursor-pointer"
                    onClick={() => navigate('/wishlist')}
                >
                    <Heart className="h-5 w-5 text-brand-orange" />
                    <span className="hidden lg:block text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Wishlist</span>
                </div>

                {/* Cart */}
                <div className="flex items-center gap-1 md:gap-2 group hover:cursor-pointer">
                    <div className="relative">
                        <ShoppingCart className="h-5 w-5 text-brand-orange" />
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-brand-orange rounded-full border border-brand-navy"></div>
                    </div>
                    <span className="hidden lg:block text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Cart</span>
                </div>

                {/* Login / Logout */}
                {user ? (
                    <div
                        className="flex items-center gap-1 md:gap-2 group hover:cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5 text-brand-orange" />
                        <span className="hidden lg:block text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Log out</span>
                    </div>
                ) : (
                    <div
                        className="flex items-center gap-1 md:gap-2 group hover:cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        <User className="h-5 w-5 text-brand-orange" />
                        <span className="hidden lg:block text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Sign in</span>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
