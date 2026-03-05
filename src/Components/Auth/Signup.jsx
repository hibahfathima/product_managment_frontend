import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { signupApi } from '../../Services/api';
import { toast } from 'react-toastify';
import { signupValidationSchema } from '../../Validations/yupValidationSchema';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [user, setUser] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        // Clear the error for this field as the user types
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    // Validate a single field on blur
    const handleBlur = async (e) => {
        const { name, value } = e.target;
        try {
            await signupValidationSchema.validateAt(name, { ...user, [name]: value });
            setErrors((prev) => ({ ...prev, [name]: '' }));
        } catch (err) {
            setErrors((prev) => ({ ...prev, [name]: err.message }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields first — show all errors at once
        try {
            await signupValidationSchema.validate(user, { abortEarly: false });
            setErrors({});
        } catch (err) {
            if (err.name === 'ValidationError') {
                const newErrors = {};
                err.inner.forEach((e) => { newErrors[e.path] = e.message; });
                setErrors(newErrors);
                return; // don't call API while invalid
            }
        }

        try {
            const result = await signupApi(user);
            if (result.success) {
                toast.success(result.message);
                setUser({ name: '', email: '', password: '' });
                setErrors({});
                navigate('/login');
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    const inputClass = (field) =>
        `w-full bg-gray-50 border-2 rounded-xl py-4.5 pl-14 pr-4 text-sm outline-none focus:bg-white transition-all placeholder:text-gray-400 shadow-sm ${errors[field]
            ? 'border-red-400 focus:border-red-400'
            : 'border-transparent focus:border-brand-yellow/20'
        }`;

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-200 p-4 font-sans">
            <div className="flex flex-col md:flex-row w-full max-w-5xl min-h-[500px] overflow-hidden rounded-3xl shadow-2xl bg-white">

                {/* Left Side (Blue Section) */}
                <div className="relative flex w-full md:w-[42%] flex-col items-center justify-center bg-brand-blue p-10 text-center text-white overflow-hidden">
                    <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10" />
                    <div className="absolute top-10 right-10 h-24 w-24 rotate-45 bg-white/10" />
                    <div className="absolute top-1/2 -right-10 h-48 w-48 opacity-20"
                        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', backgroundColor: 'white' }} />
                    <div className="absolute bottom-1/4 right-1/4 h-12 w-12 rounded-full bg-white/10" />
                    <div className="absolute top-1/4 left-1/4 h-16 w-16 -rotate-12 bg-white/5" />

                    <div className="relative z-10 flex flex-col items-center">
                        <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Welcome Back!</h1>
                        <p className="text-sm font-light mb-12 leading-relaxed opacity-80 max-w-[260px]">
                            To keep connected with us please login with your personal info
                        </p>
                        <Link to="/login">
                            <button className="px-12 py-3 border-2 border-white rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-brand-blue transition-all duration-300 hover:cursor-pointer">
                                Sign In
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Right Side (Form Section) */}
                <div className="flex w-full md:w-[58%] flex-col items-center justify-center p-8 md:p-20 bg-white">
                    <h1 className="text-5xl font-black text-brand-yellow mb-10 tracking-tight">Create Account</h1>

                    <form className="w-full max-w-sm space-y-5" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="space-y-1.5">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-yellow transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="text"
                                    placeholder="Name"
                                    className={inputClass('name')}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-xs ml-1 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 mt-0.5 flex-shrink-0" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-yellow transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="email"
                                    placeholder="Email"
                                    className={inputClass('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs ml-1 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 mt-0.5 flex-shrink-0" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-yellow transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="password"
                                    placeholder="Password"
                                    className={inputClass('password')}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs ml-1 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 mt-0.5 flex-shrink-0" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="pt-4 text-center">
                            <button
                                type="submit"
                                className="bg-brand-yellow text-white px-20 py-4.5 rounded-full font-black uppercase tracking-[0.2em] text-[12px] shadow-xl hover:shadow-brand-yellow/30 hover:-translate-y-1 transform transition-all duration-300 hover:cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;