import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function BlogForm({ formData, isEditing, onClose, onSuccess }) {
  const [data, setData] = useState(formData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const loadingToast = toast.loading(isEditing ? "Updating blog..." : "Posting blog...");

    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/post/${data.id}/update`,
          data
        );
        toast.success("Updated blog successfully!", { id: loadingToast });
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/post/create`,
          data
        );
        toast.success("Blog posted successfully!", { id: loadingToast });
      }

      if (response.status < 400) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Something went wrong while saving the blog!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-10 w-full max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Update Blog" : "Create New Blog"}
        </h2>

        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Blog Title"
          className="w-full border p-2 rounded mb-4"
          required
        />
        <input
          type="text"
          name="image"
          value={data.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-2 rounded mb-4"
        />
        <textarea
          name="content"
          value={data.content}
          onChange={handleChange}
          placeholder="Blog content..."
          className="w-full border p-2 rounded mb-4"
          rows="5"
          required
        ></textarea>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>

      {/* Place Toaster outside the form so it works globally */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default BlogForm;
