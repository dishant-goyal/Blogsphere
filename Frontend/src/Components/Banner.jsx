import React from "react";
import blogimage from "/blogimage.png"

function Banner() {
  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col  md:flex-row mt-20 mb-10">
      <section className="hero min-h-[80vh] mt-1">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="https://images.unsplash.com/photo-1655988940601-7702d8685f95?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3JlYXRpdmUlMjB3b3Jrc3BhY2V8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000"
            className="md:w-120  rounded-md md:h-90"
          />
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Explore Stories, Insights & Ideas 💡
            </h1>
            <p className="py-6 text-lg">
              Welcome to{" "}
              <span className="font-semibold ">BlogSphere</span> —
              your space to discover, read, and share articles on tech, design,
              lifestyle, and more. Let your words inspire the world!
            </p>
            <div className="flex gap-3">
              <a href="/blogs" className="btn btn-primary bg-violet-600 border-violet-600 hover:bg-violet-700">
                Read Blogs
              </a>
              <a href="/myprofile" className="btn btn-outline">
                Write a Blog
              </a>
            </div>

           
          </div>
        </div>
      </section>
    </div>
  );
}

export default Banner;
