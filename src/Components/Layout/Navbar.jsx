import React from 'react';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-brand-navy px-8 py-4 flex items-center justify-between text-white shadow-md">
            {/* Search Bar Container */}
            <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-xl flex">
                    <input
                        type="text"
                        placeholder="Search anything"
                        className="w-full bg-white text-gray-800 rounded-l-lg px-6 py-2.5 outline-none text-sm placeholder:text-gray-400"
                    />
                    <button className="bg-brand-orange px-8 rounded-r-lg font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition-colors">
                        Search
                    </button>
                </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-8 ml-8">
                {user ? (
                    <div
                        className="flex items-center space-x-2 group cursor-pointer"
                        onClick={handleLogout}
                    >
                        <div className="relative">
                            <LogOut className="h-5 w-5 text-brand-orange" />
                        </div>
                        <span className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Log out</span>
                    </div>
                ) : (
                    <div
                        className="flex items-center space-x-2 group cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        <div className="relative">
                            <User className="h-5 w-5 text-brand-orange" />
                        </div>
                        <span className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Sign in</span>
                    </div>
                )}

                <div className="flex items-center space-x-2 group cursor-pointer">
                    <div className="relative">
                        <ShoppingCart className="h-5 w-5 text-brand-orange" />
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-brand-orange rounded-full border border-brand-navy"></div>
                    </div>
                    <span className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Cart</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

