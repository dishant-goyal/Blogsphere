import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
    image: null,
    category: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate=useNavigate()
  const API_URL = import.meta.env.VITE_API_URL;

  const categories = [
    "Technology",
    "Entertainment",
    "Business",
    "Lifestyle",
    "Health",
    "Sports",
    "Education",
    "Science",
    "Travel",
    "Food",
  ];

  // ✅ Fetch user's blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/post/my-posts`, {
          withCredentials: true,
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          const safeData = res.data.data.filter((b) => b && b._id);
          setBlogs(safeData);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("❌ Error fetching blogs:", error);
        alert(error.response?.data?.message || "Failed to fetch blogs");
      }
    };

    fetchBlogs();
  }, [API_URL]);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Create or Update blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("category", formData.category);
      if (formData.image) data.append("image", formData.image);

      let response;
      if (isEditing) {
        response = await axios.put(
          `${API_URL}/api/v1/post/${formData.id}/updatePost`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        const updatedPost = response.data.data?.post || response.data.data;
        if (updatedPost && updatedPost._id) {
          setBlogs((prev) =>
            prev.map((b) => (b._id === formData.id ? updatedPost : b))
          );
        } else {
          console.warn("⚠️ Unexpected update response:", response.data);
        }
        window.location.reload();

      } else {
        response = await axios.post(`${API_URL}/api/v1/post/create`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        const newPost = response.data.data?.post || response.data.data;
        if (newPost && newPost._id) {
          setBlogs((prev) => [newPost, ...prev]);
        } else {
          console.warn("⚠️ Unexpected create response:", response.data);
        }
        window.location.reload();

      }

      resetForm();
    } catch (error) {
      console.error("❌ Error saving blog:", error);
      alert(error.response?.data?.message || "Error saving blog");
    }
  };

  // ✅ Delete blog
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${API_URL}/api/v1/post/${id}/delete`, {
        withCredentials: true,
      });
      setBlogs((prev) => prev.filter((b) => b && b._id !== id));
    } catch (error) {
      console.error("❌ Error deleting blog:", error);
      alert(error.response?.data?.message || "Error deleting blog");
    }
  };

  // ✅ Edit blog
  const handleEdit = (blog) => {
    setFormData({
      id: blog._id,
      title: blog.title,
      content: blog.content,
      image: null,
      category: blog.category || "",
    });
    setIsEditing(true);
    setShowForm(true);
  };

  // ✅ Create blog

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  // ✅ Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      content: "",
      image: null,
      category: "",
    });
    setIsEditing(false);
    setShowForm(false);
  };

  

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 mt-20 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
  <div>
    <h1 className="text-3xl font-bold text-base-content">Hi Goyal 👋</h1>
    <p className="text-base-content/70 text-sm mt-1">
      Here you can handle and edit your posted blogs easily.
    </p>
  </div>

  <button
    onClick={handleCreate}
    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all"
  >
    <FaPlus className="text-white" /> Create Blog
  </button>
</div>


      {/* Form */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="shadow-xl rounded-2xl p-8 mb-10 border border-gray-100"
        >
          <h2 className="text-2xl font-semibold mb-6">
            {isEditing ? "✏️ Edit Blog" : "📝 Create New Blog"}
          </h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Category */}
         <div className="mb-4">
  <label className="block font-medium mb-1">Category</label>
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
    className=
    "select p-3 select-bordered w-full focus:ring-2 focus:ring-blue-500 bg-base-100 text-base-content w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none "
  >
    <option value="">Select category</option>
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>

          {/* Image */}

          <div className="mb-4">
            <label className="block font-medium mb-1">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg text-gray-500 file:mr-4 file:py-2 file:px-4 
               file:rounded-lg file:border-0 file:text-sm file:font-semibold 
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block font-medium mb-1">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content..."
              rows="6"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md"
            >
              {isEditing ? "Update Blog" : "Publish Blog"}
            </button>
          </div>
        </form>
      )}

      {Array.isArray(blogs) && blogs.filter((b) => b && b._id).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs
            .filter((b) => b && b._id)
            .map((blog) => (
              <div
                key={blog._id}
                className="rounded-xl shadow-md transition-all duration-300 overflow-hidden cursor-pointer w-82 flex flex-col h-[380px] border hover:scale-95"
              >
                {/* Image */}

                {blog.image && (
                  <div className="relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="px-4 py-4 flex flex-col justify-between flex-grow">
                  <span className="text-sm text-blue-600 font-semibold uppercase">
                    {blog?.category}
                  </span>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold">{blog?.title}</h2>
                    <p className="text-sm line-clamp-3">{blog?.content}</p>
                  </div>

                  {/* Bottom Section */}
                  <div>
                    <div className="flex items-center justify-between my-3 text-xs">
                      <span>✍️ {blog.authorName}</span>
                      <span>📅 {blog.date}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-2 mt-2">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(blog._id)}
                        className="flex items-center gap-1 text-sm hover:text-red-600 transition"
                      >
                        
                          <FaHeart className="text-red-500" />
                        
                        
                        <span>{blog.likes}</span>
                      </button>

                      {/* Edit & Delete Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow transition"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20">
          You haven’t created any blogs yet.
        </p>
      )}

      {/* Blogs Grid */}
    </div>
  );
}

export default MyProfile;
