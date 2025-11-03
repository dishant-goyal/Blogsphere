import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate=useNavigate()

  const onSubmit = async (data) => {
    try {
      const userInfo = {
        email: data.email,
        password: data.password,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/login`,
        userInfo,
        { withCredentials: true }
      );
      if (res.data.success) {
        localStorage.setItem("User", JSON.stringify(userInfo.email));

        document.getElementById("my_modal_3").close();
        alert("Login successful!");
        navigate('/')
        // window.location.reload();

      } else {
        alert(res.data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }

    
  };

  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box relative">
          {/* Close button */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={
              () => {
                document.getElementById("my_modal_3").close()
                // navigate('/')
              } }
          >
            ✕
          </button>

          <h3 className="font-bold text-lg">Login</h3>

          {/* ✅ Correct form setup */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email field */}
            <div className="mt-4 space-y-2">
              <span>Email</span>
              <br />
              <input
                type="email"
                id="email"
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

            {/* Password field */}
            <div className="mt-4">
              <span>Password</span>
              <br />
              <input
                type="password"
                id="password"
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
            <div className="flex justify-around mt-4 items-center">
              <button
                type="submit"
                className="bg-violet-500 text-white rounded-md px-3 py-1 hover:bg-violet-700"
              >
                Login
              </button>
              <p>
                Not registered?{" "}
                <Link
                  to="/signup"
                  className="underline text-blue-500 cursor-pointer"
                >
                  Signup
                </Link>
              </p>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
