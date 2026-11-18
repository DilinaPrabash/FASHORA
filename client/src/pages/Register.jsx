
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters!");
      return;
    }

    // Frontend demo only. Backend registration will be connected later.
    alert("Registration UI is working! Backend connection is coming soon.");

    console.log("Registration data:", {
      fullName: formData.fullName,
      email: formData.email,
    });
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
              DISCOVER YOUR STYLE
            </p>

            <h1 className="font-['Cormorant_Garamond'] text-6xl leading-tight mb-6">
              Elegance is
              <br />
              a way of life.
            </h1>

            <p className="text-gray-400 leading-7 max-w-md">
              Discover timeless fashion, explore exclusive collections
              and express your unique style with FASHORA.
            </p>
          </div>

          <p className="text-gray-600 text-xs tracking-widest">
            © 2026 FASHORA. ALL RIGHTS RESERVED.
          </p>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex items-center justify-center p-7 md:p-12 lg:p-14">
          <div className="w-full max-w-md">

            <div className="mb-9">
              <Link
                to="/"
                className="lg:hidden font-['Cormorant_Garamond'] text-3xl tracking-[0.2em] text-[#d6bd91]"
              >
                FASHORA
              </Link>

              <p className="text-[#d6bd91] text-xs tracking-[0.3em] mt-5 mb-3">
                JOIN FASHORA
              </p>

              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">
                Create Account
              </h2>

              <p className="text-gray-500 text-sm mt-3">
                Create your account and discover something beautiful.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
              </div>

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
                <label className="block text-xs text-gray-400 mb-2">
                  Password
                </label>

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
                    placeholder="Create a password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d6bd91]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d6bd91]"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
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
                CREATE ACCOUNT
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Login Link */}
            <div className="border-t border-white/10 mt-8 pt-7 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#d6bd91] hover:text-white transition"
                >
                  Sign In
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
