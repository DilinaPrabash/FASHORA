
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend demo only. Backend authentication will be added later.
    alert("Login UI is working! Backend connection is coming soon.");

    console.log("Login email:", formData.email);
  };

  const inputClass =
    "w-full bg-[#151515] border border-white/10 py-4 pl-12 pr-12 text-white text-sm outline-none focus:border-[#d6bd91] transition placeholder:text-gray-600";

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 border border-white/10 bg-[#101010]">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between p-14 bg-[#151515]">
          <div>
            <Link
              to="/"
              className="font-['Cormorant_Garamond'] text-4xl tracking-[0.2em] text-[#d6bd91]"
            >
              FASHORA
            </Link>

            <p className="text-xs tracking-[0.35em] text-gray-500 mt-3">
              THE ART OF ELEGANCE
            </p>
          </div>

          <div>
            <p className="text-[#d6bd91] text-xs tracking-[0.3em] mb-5">
              WELCOME BACK
            </p>

            <h1 className="font-['Cormorant_Garamond'] text-6xl leading-tight mb-6">
              Style is
              <br />
              timeless.
            </h1>

            <p className="text-gray-400 leading-7 max-w-md">
              Sign in to explore our exclusive collections and
              continue your journey with FASHORA.
            </p>
          </div>

          <p className="text-gray-600 text-xs tracking-widest">
            © 2026 FASHORA. ALL RIGHTS RESERVED.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-7 md:p-12 lg:p-14">
          <div className="w-full max-w-md">

            <div className="mb-10">
              <Link
                to="/"
                className="lg:hidden font-['Cormorant_Garamond'] text-3xl tracking-[0.2em] text-[#d6bd91]"
              >
                FASHORA
              </Link>

              <p className="text-[#d6bd91] text-xs tracking-[0.3em] mt-5 mb-3">
                WELCOME BACK
              </p>

              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">
                Sign In
              </h2>

              <p className="text-gray-500 text-sm mt-3">
                Enter your details to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-gray-400">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#d6bd91] hover:text-white transition"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d6bd91]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-[#d6bd91] text-black py-4 mt-3 text-xs font-semibold tracking-[0.2em] hover:bg-white transition"
              >
                SIGN IN
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Register Link */}
            <div className="border-t border-white/10 mt-9 pt-7 text-center">
              <p className="text-gray-500 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#d6bd91] hover:text-white transition"
                >
                  Create Account
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
