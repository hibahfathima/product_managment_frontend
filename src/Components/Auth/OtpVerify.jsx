import React, { useState, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

const OtpVerify = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [error, setError] = useState("")
    const inputRefs = useRef([])

    // Handle individual digit input
    const handleChange = (index, value) => {
        // Only allow single digit
        if (value.length > 1) return
        if (value && !/^\d$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError("")

        // Auto move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    // Handle backspace — move to previous input
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    // Handle paste — distribute digits across boxes
    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        const newOtp = [...otp]
        pasted.split("").forEach((char, i) => { newOtp[i] = char })
        setOtp(newOtp)
        // Focus last filled box
        const lastIdx = Math.min(pasted.length, 5)
        inputRefs.current[lastIdx].focus()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const otpValue = otp.join("")
        if (otpValue.length < 6) {
            setError("Please enter the complete 6-digit OTP")
            return
        }
        // TODO: call verifyOtp API with otpValue
        console.log("OTP submitted:", otpValue)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-200 p-4 font-sans">
            <div className="flex flex-col md:flex-row w-full max-w-5xl h-[650px] overflow-hidden rounded-3xl shadow-2xl bg-white">

                {/* Left Side — Blue decorative panel */}
                <div className="relative flex w-full md:w-[42%] flex-col items-center justify-center bg-brand-blue p-10 text-center text-white overflow-hidden">
                    {/* Decorative shapes */}
                    <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10" />
                    <div className="absolute top-10 right-10 h-24 w-24 rotate-45 bg-white/10" />
                    <div className="absolute top-1/2 -right-10 h-48 w-48 opacity-20"
                        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', backgroundColor: 'white' }} />
                    <div className="absolute bottom-1/4 right-1/4 h-12 w-12 rounded-full bg-white/10" />
                    <div className="absolute top-1/4 left-1/4 h-16 w-16 -rotate-12 bg-white/5" />

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Shield icon */}
                        <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Check your<br />Inbox!</h1>
                        <p className="text-sm font-light leading-relaxed opacity-80 max-w-[240px]">
                            We've sent a 6-digit verification code to your email address. It expires in <span className="font-semibold">5 minutes</span>.
                        </p>
                    </div>
                </div>

                {/* Right Side — OTP form */}
                <div className="flex w-full md:w-[58%] flex-col items-center justify-center p-8 md:p-20 bg-white">
                    <h1 className="text-5xl font-black text-brand-yellow mb-3 tracking-tight">Verify OTP</h1>
                    <p className="text-sm text-gray-400 mb-12 text-center">
                        Enter the 6-digit code sent to your email
                    </p>

                    <form className="w-full max-w-sm" onSubmit={handleSubmit}>

                        {/* 6 OTP digit boxes */}
                        <div className="flex justify-between gap-3 mb-4" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-14 text-center text-xl font-black rounded-xl border-2 bg-gray-50 outline-none transition-all duration-200 shadow-sm
                                        ${digit ? 'border-brand-yellow text-brand-yellow bg-white' : 'border-transparent'}
                                        ${error ? 'border-red-400' : ''}
                                        focus:border-brand-yellow focus:bg-white focus:scale-105`}
                                />
                            ))}
                        </div>

                        {/* Error message */}
                        {error && (
                            <p className="text-red-500 text-xs text-center mb-4">{error}</p>
                        )}

                        {/* Submit button */}
                        <div className="pt-6 text-center">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-brand-yellow text-white px-20 py-4.5 rounded-full font-black uppercase tracking-[0.2em] text-[12px] shadow-xl hover:shadow-brand-yellow/30 hover:-translate-y-1 transform transition-all duration-300 hover:cursor-pointer"
                            >
                                Verify
                            </button>
                        </div>

                        {/* Resend link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-400">
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    className="text-brand-yellow font-semibold hover:underline hover:cursor-pointer"
                                    onClick={() => {
                                        setOtp(["", "", "", "", "", ""])
                                        setError("")
                                        inputRefs.current[0].focus()
                                        // TODO: call resend OTP API
                                    }}
                                >
                                    Resend OTP
                                </button>
                            </p>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default OtpVerify;
