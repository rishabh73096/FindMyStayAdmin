"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";

export default function Login(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);

  const submit = async () => {
    setSubmitted(true);

    if (!userDetail.email || !userDetail.password) {
      toast.error("Missing credentials");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api("post", "auth/login", { ...userDetail }, router);
      if (res?.status) {
        const user = res.data.user;
        if (user.role === "Admin") {
          localStorage.setItem("userDetail", JSON.stringify(user));
          localStorage.setItem("token", res.data?.token);
          setUser(user);
          setUserDetail({ email: "", password: "" });
          toast.success(res.data.message);
          router.push("/");
        } else {
          toast.error(res.data.message || "You are not authorized");
        }
      } else {
        toast.error("Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">

      {/* Soft Orange Glow Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500 rounded-full blur-[120px] opacity-40"></div>
      </div>

      <div className="relative w-full max-w-md">

        {/* Login Card */}
        <div className="bg-[#161616] shadow-2xl rounded-3xl p-8 border border-orange-500/20 backdrop-blur-xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-500 tracking-wide">
              FIND MY STAY
            </h1>
            <h2 className="text-xl font-semibold text-white mt-4">
              Welcome Back!
            </h2>
            <p className="text-gray-300 text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-orange-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#1f1f1f] text-white border 
                    ${submitted && !userDetail.email ? "border-red-500" : "border-gray-700"} 
                    focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none`}
                  value={userDetail.email}
                  onChange={(e) => setUserDetail({ ...userDetail, email: e.target.value })}
                />
              </div>
              {submitted && !userDetail.email && (
                <p className="text-red-400 text-xs">Email is required</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-orange-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-orange-500" />

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl bg-[#1f1f1f] text-white border 
                    ${submitted && !userDetail.password ? "border-red-500" : "border-gray-700"} 
                    focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none`}
                  value={userDetail.password}
                  onChange={(e) => setUserDetail({ ...userDetail, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />

                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <EyeOff className="h-5 w-5 text-orange-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-orange-500" />
                  )}
                </button>
              </div>

              {submitted && !userDetail.password && (
                <p className="text-red-400 text-xs">Password is required</p>
              )}
            </div>

            {/* Button */}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-orange-500 text-black font-semibold py-3 rounded-xl mt-2
                hover:bg-orange-600 transition-all duration-200 transform hover:scale-[1.02]
                disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">© 2025 FindMyStay All rights reserved.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
