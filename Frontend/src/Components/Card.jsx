import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";

function BlogCard({ id, image, title, content, authorName, date, likes: initialLikes, isLiked: initialIsLiked ,disabled="false"}) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);


  // ✅ Like / Unlike Handler
  async function handleLike() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${id}/like`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const { liked } = res.data.data;

        // Update UI instantly
        setIsLiked(liked);
        setLikes((prev) => (liked ? prev + 1 : prev - 1));
      } else {
        alert(res.data.message || "Failed to toggle like!");
      }
    } catch (error) {
      console.error("Error in like/unlike:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  }

  return (
    <div className="rounded-xl shadow-md transition-all duration-300  overflow-hidden cursor-pointer w-82 flex flex-col h-[380px] border hover:scale-95">
      {/* Image */}


      <div className="relative">
        <img src={image} alt={title} className="w-full h-40 object-cover" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-grow">

        
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm line-clamp-3">{content}</p>
        </div>

        {/* Bottom Section */}
        <div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span>✍️ {authorName}</span>
            <span>📅 {date}</span>
          </div>

          {/* Like Button */}
          <div className="flex items-center justify-between mt-2 border-t border-gray-200 pt-2">
            <button
              onClick={handleLike}
              disabled={disabled==="true"}
              className={`flex items-center gap-1 text-sm hover:text-red-600 transition`}
            >
              {isLiked ||disabled==="true" ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-500" />
              )}
              <span>{likes}</span>
            </button>
          </div>


        </div>
      </div>
    </div>
  );
}

export default BlogCard;
