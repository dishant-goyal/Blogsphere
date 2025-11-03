import express from "express";
import { createPost, deletePost, getAllPost, getHomePosts, getMyPosts, getPostBySlug, getPostLikes, toggleLike, updatePost } from "../controller/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.js"

const router=express.Router()

router.post("/create",upload.single('image'),authMiddleware,createPost)
router.get("/getpost/:slug",authMiddleware,getPostBySlug)
router.get("/getall",authMiddleware,getAllPost)
router.get("/my-posts",authMiddleware,getMyPosts)
router.delete("/:id/delete",authMiddleware,deletePost)
router.post("/:id/like",authMiddleware,toggleLike)
router.get("/:id/getlike",authMiddleware,getPostLikes)
router.put("/:id/updatePost",upload.single("image"),authMiddleware,updatePost)
router.get("/getHomePosts",getHomePosts)

export default router

