import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi } from '../../Services/api';
import { useAuth } from '../../Contexts/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await loginApi(credentials);
            if (result.success) {
                toast.success(result.message);
                setUser(result.data);
                navigate("/");
            } else {
                toast.error(result.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            const msg = error.response?.data?.message || "Something went wrong";
            toast.error(msg);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-200 p-4 font-sans">
            <div className="flex flex-col md:flex-row w-full max-w-5xl h-[650px] overflow-hidden rounded-3xl shadow-2xl bg-white">

                {/* Left Side (Form Section) */}
                <div className="flex w-full md:w-[58%] flex-col items-center justify-center p-8 md:p-20 bg-white order-2 md:order-1">
                    <h1 className="text-5xl font-black text-brand-yellow mb-12 tracking-tight">Sign In</h1>

                    <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-yellow transition-colors">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full bg-gray-50 border-transparent border-2 rounded-xl py-4.5 pl-14 pr-4 text-sm outline-none focus:bg-white focus:border-brand-yellow/20 transition-all placeholder:text-gray-400 shadow-sm"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-yellow transition-colors">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full bg-gray-50 border-transparent border-2 rounded-xl py-4.5 pl-14 pr-4 text-sm outline-none focus:bg-white focus:border-brand-yellow/20 transition-all placeholder:text-gray-400 shadow-sm"
                                required
                            />
                        </div>

                        <div className="text-center">
                            <a href="#" className="text-sm text-gray-400 hover:text-brand-yellow transition-colors">
                                forgot password?
                            </a>
                        </div>

                        <div className="pt-6 text-center">
                            <button
                                type="submit"
                                className="bg-brand-yellow text-white px-20 py-4.5 rounded-full font-black uppercase tracking-[0.2em] text-[12px] shadow-xl hover:shadow-brand-yellow/30 hover:-translate-y-1 transform transition-all duration-300 hover:cursor-pointer"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side (Blue Section) */}
                <div className="relative flex w-full md:w-[42%] flex-col items-center justify-center bg-brand-blue p-10 text-center text-white overflow-hidden order-1 md:order-2">
                    <div className="absolute top-10 left-10 h-24 w-24 rotate-45 bg-white/10" />
                    <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10" />
                    <div className="absolute top-1/2 -left-10 h-48 w-48 opacity-20 rotate-180"
                        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', backgroundColor: 'white' }} />
                    <div className="absolute bottom-1/4 left-1/4 h-12 w-12 rounded-full bg-white/10" />
                    <div className="absolute top-1/4 right-1/4 h-16 w-16 -rotate-12 bg-white/5 shadow-2xl" />

                    <div className="relative z-10 flex flex-col items-center">
                        <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Hello Friend!</h1>
                        <p className="text-sm font-light mb-12 leading-relaxed opacity-80 max-w-[260px]">
                            Enter your personal details and start your journey with us
                        </p>
                        <Link
                            to="/signup"
                            className="px-12 py-3 border-2 border-white rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-brand-blue transition-all duration-300"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;