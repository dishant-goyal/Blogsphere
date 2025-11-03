import React, { useEffect, useState } from "react";
import BlogCard from "./Card";
import axios from "axios";

function BlogPage() {
  // sample blog post data (you can replace this later with API data)


  const [allBlogs,setAllBlogs]=useState([])

  useEffect(() => {
    async function getBlogs() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/post/getall`,
          { withCredentials: true }
        );

        if (res.data.success) {
          console.log("Fetched successfully ✅");
          setAllBlogs(res.data.data);
        } else {
          alert(res.data.message || "Failed to fetch!");
        }
      } catch (error) {
        console.error("Error in fetching all the blogs:", error);
        alert(error.response?.data?.message || "Something went wrong!");
      }
    }

    getBlogs();
  }, []);


  const blogs = [

    {
      id: 1,
      image: "https://source.unsplash.com/800x600/?writing,blog",
      title: "The Art of Thoughtful Writing",
      content:
        "Writing isn’t just about words — it’s about connection, emotion, and perspective. Here’s how you can make your stories truly resonate and capture readers’ hearts through authentic storytelling.",
      author: "Alex Carter",
      date: "Nov 2, 2025",
      likes: 128,
    },
    {
      id: 2,
      image: "https://source.unsplash.com/800x600/?journal,notes",
      title: "Finding Inspiration in Everyday Life",
      content:
        "You don’t need to travel far to find ideas. Inspiration is everywhere — in people, nature, and even quiet moments. Learn how to spot beauty in the ordinary and turn it into meaningful writing.",
      author: "Sophia Lane",
      date: "Oct 28, 2025",
      likes: 95,
    },
    {
      id: 3,
      image: "https://source.unsplash.com/800x600/?typing,desk",
      title: "Why Writing Daily Changes Everything",
      content:
        "Consistency builds mastery. A daily writing habit trains your mind to think clearly, express freely, and improve naturally. Here’s how to stay disciplined without burning out.",
      author: "Liam Jones",
      date: "Oct 20, 2025",
      likes: 210,
    },
    {
      id: 4,
      image: "https://source.unsplash.com/800x600/?reading,book",
      title: "The Relationship Between Reading and Writing",
      content:
        "Every great writer is an avid reader. Reading broadens your vocabulary, sharpens your style, and fuels creativity. Discover how reading intentionally can transform your writing.",
      author: "Emma Brooks",
      date: "Oct 10, 2025",
      likes: 180,
    },
  ];


  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 py-10 min-h-screen mt-20">
      {/* Header */}
      <div className=" mb-12">
        <h1 className="text-4xl font-bold mb-3">All Blogs</h1>
        <p className="">
          Explore our latest posts and discover ideas, stories, and inspiration from passionate writers.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {allBlogs.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}
      </div>
    </div>
  );
}

export default BlogPage;
