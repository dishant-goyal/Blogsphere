import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Login from "./Login";
import axios from "axios";
function Signup() {
  const navigate=useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

 const onSubmit = async (data) => {
  try {
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
      userInfo,
      { withCredentials: true }
    );

    if (res.data.success) {
      localStorage.setItem("User",JSON.stringify(userInfo.email))
      alert("Signup successful!");
      navigate('/')
      
    } else {
      alert(res.data.message || "Signup failed!");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert(error.response?.data?.message || "Something went wrong!");
  }
};


  return (
    <div className="flex h-screen items-center justify-center">
      <div className="modal modal-open">
        <div className="modal-box relative">
          {/* Close Button */}
          <Link
            to="/"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </Link>

          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="font-bold text-lg mb-2">Signup</h3>

            {/* Name */}
            <div className="mt-4 space-y-2">
              <span>Name</span>
              <br />
        
              <input
                type="text"
                placeholder="Enter your name"
                className="w-70 px-3 py-1 border rounded-md outline-none"
                {...register("name", { required: "Name is required" })}
              />
              <br />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="mt-4 space-y-2">
              <span>Email</span>
              <br />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-70 px-3 py-1 border rounded-md outline-none"
                {...register("email", { required: "Email is required" })}
              />
              <br />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="mt-4 space-y-2">
              <span>Password</span>
              <br />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-70 px-3 py-1 border rounded-md outline-none"
                {...register("password", { required: "Password is required" })}
              />
              <br />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-around mt-6 items-center">
              <button
                type="submit"
                className="bg-violet-500 text-white rounded-md px-3 py-1 hover:bg-violet-700"
              >
                Sign up
              </button>
              <p>
                Have an account?{" "}
                <button
                  type="button" // 👈 important!
                  className="underline text-blue-500 cursor-pointer"
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                >
                  Login
                </button>
              </p>
            </div>
          </form>

          {/* Login Modal */}
          <Login />
        </div>
      </div>
    </div>
  );
}

export default Signup;
