import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import Like from "../models/like.model.js";

export const createPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  // 1️⃣ Validate input
  if (!title || !content || !category) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"All fields are required"))
    throw new ApiError(400, "Title, content, and category are required");
  }

  // 2️⃣ Handle optional image upload
  let imageURL;
  if (req.file) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path, "posts");
    if (!cloudinaryResult) {
      res
    .status(400)
    .send(new ApiResponse(400,{},"Image upload failed"))
      throw new ApiError(400, "Image upload failed");
    }
    imageURL = cloudinaryResult.secure_url;
  }

  // 3️⃣ Create post
  const post = await Post.create({
    title,
    content,
    category,
    image: imageURL || undefined,
    author: req.user._id, // coming from authMiddleware
  });

  // 4️⃣ Respond with success
  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "Post created successfully!"));
});

export const getPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Slug is required");
  }

  const post = await Post.findOne({ slug }).populate("author", "name email");

  if (!post) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"No post found"))
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});




export const getAllPost = asyncHandler(async (req, res) => {
  const allPosts = await Post.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  if (!allPosts || allPosts.length === 0) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"No posts found"))
    throw new ApiError(404, "No posts found");
  }

  // ✅ Preload all likes for performance
  const postIds = allPosts.map((p) => p._id);
  const likes = await Like.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: "$post", count: { $sum: 1 } } },
  ]);

  // Convert likes to a Map for quick lookup
  const likeMap = new Map(likes.map((l) => [l._id.toString(), l.count]));

  // ✅ (Optional) If user is logged in, check which posts they liked
  let userLikes = new Set();
  if (req.user?._id) {
    const userLikedPosts = await Like.find({
      user: req.user._id,
      post: { $in: postIds },
    }).select("post");
    userLikes = new Set(userLikedPosts.map((l) => l.post.toString()));
  }

  // ✅ Format posts cleanly
  const formattedPosts = allPosts.map((post) => ({
    id: post._id,
    title: post.title,
    content: post.content,
    image: post.image,
    category: post.category,
    authorName: post.author?.name || "Unknown",
    date: new Date(post.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    likes: likeMap.get(post._id.toString()) || 0,
    isLiked: userLikes.has(post._id.toString()), // ✅ useful for frontend
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, formattedPosts, "Posts fetched successfully"));
});

export const getMyPosts = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: Please login first");
  }

  // 🧠 Fetch posts created by this user
  const userPosts = await Post.find({ author: userId }).sort({ createdAt: -1 });

  if (!userPosts) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"No post found"))
    throw new ApiError(404, "You haven’t created any posts yet");
  }

  // 🧩 Get likes count + whether user liked their own post
  const formattedPosts = await Promise.all(
    userPosts.map(async (post) => {
      const likesCount = await Like.countDocuments({ post: post._id });
      const isLiked = await Like.exists({ post: post._id, likedBy: userId });

      return {
        _id: post._id,
        title: post.title,
        content: post.content,
        image: post.image,
        category: post.category,
        authorName: req.user.name || "You",
        date: new Date(post.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        likes: likesCount,
        isLiked: !!isLiked,
      };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, formattedPosts, "Your posts fetched successfully"));
});




export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1️⃣ Validate input
  if (!id) {
    throw new ApiError(400, "Post ID is required");
  }

  // 2️⃣ Find post
  const post = await Post.findById(id);
  if (!post) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"No Post found"))
    throw new ApiError(404, "Post not found");
  }

  // 3️⃣ Authorization check
  if (post.author.toString() !== req.user._id.toString()) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"You are not authorized to delete this post"))
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  // 4️⃣ Delete post
  await Post.findByIdAndDelete(id);

  // 5️⃣ Respond success
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingLike = await Like.findOne({ post: id, user: req.user._id });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Post unliked successfully")
      );
  } else {
    await Like.create({ post: id, user: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: true }, "Post liked successfully"));
  }
});


export const getPostLikes = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Post ID is required");

  const [totalLikes, userLiked] = await Promise.all([
    Like.countDocuments({ post: id }),
    Like.exists({ post: id, user: req.user._id }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalLikes,
        userLiked: !!userLiked,
      },
      "Like data fetched successfully"
    )
  );
});

export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let post = await Post.findById(id);

  if (!post) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"Post not found"))
    throw new ApiError(400, "Post not found");
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"You are not authorized"))
    throw new ApiError(403, "You are not authorized to update this post");
  }

  const { title, category, content } = req.body;

  let imageURL;
  if (req.file) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path, "posts");
    if (!cloudinaryResult) {
      res
    .status(400)
    .send(new ApiResponse(400,{},"Image not found"))
      throw new ApiError(400, "Image upload failed");
    }
    imageURL = cloudinaryResult.secure_url;
  }
  
  if (title) post.title = title;
  if (content) post.content = content;
  if (category) post.category = category;
  if (imageURL) post.image = imageURL;

  await post.save();

  const updatedPost = await Post.findById(post._id)
    .populate("author", "name email")
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});


export const getHomePosts = asyncHandler(async (req, res) => {
  // Fetch the latest 6 posts and populate author details
  const posts = await Post.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .limit(6);

  if (!posts || posts.length === 0) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"No posts found"))
    throw new ApiError(404, "No posts yet");
  }

  // Format posts with likes count
  const formattedPosts = await Promise.all(
    posts.map(async (post) => {
      const likesCount = await Like.countDocuments({ post: post._id });

      return {
        _id: post._id,
        title: post.title,
        content: post.content,
        image: post.image,
        category: post.category,
        authorName: post.author?.name || "Unknown",
        date: new Date(post.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        likes: likesCount,
        isLiked: false,
      };
    })
  );

  // Send response
  res.status(200).json({
    success: true,
    count: formattedPosts.length,
    posts: formattedPosts,
  });
});
