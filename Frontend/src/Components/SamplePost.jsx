import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BlogCard from "./Card";

function SamplePost() {
  const sliderRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [posts, setPosts] = useState([]); // ✅ fixed

  // 👇 Detect screen width before rendering
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesToShow(1);
      else if (width < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  // 👇 Fetch Posts
  useEffect(() => {
    async function getBlogs() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/post/getHomePosts`,
          { withCredentials: true }
        );

        if (res.data.success) {
          console.log("Fetched successfully ✅");
          setPosts(res.data.posts); // ✅ updated key
        } else {
          console.log(res.data.message || "Failed to fetch!");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    getBlogs();
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 mb-10">
      {/* Section Heading */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2">Featured Posts</h1>
        <p className="text-base-content/70">A glimpse into what’s trending right now.</p>
      </div>

      {/* Post Carousel */}
      <Slider ref={sliderRef} {...settings}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="px-2">
              <BlogCard
                image={post.image}
                title={post.title}
                content={post.content}
                authorName={post.authorName}
                date={post.date}
                likes={post.likes}
                isLiked={post.isLiked}
                disabled="true"
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">No posts available yet.</p>
        )}
      </Slider>
    </div>
  );
}

export default SamplePost;
