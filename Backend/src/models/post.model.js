import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [150, "Title must be less than 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
    },
    image: {
      type: String,
      default:
        "https://www.wpbeginner.com/wp-content/uploads/2017/08/set-a-default-fallback-image-for-wordpress-post-thumbnails-thumbnail.png",
    },
    category: {
      type: String,
      enum: [
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
      ],
      default: "Technology",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author reference is required"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    }
  },
  { timestamps: true }
);

postSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  let newSlug = slugify(this.title, { lower: true, strict: true });
  const slugExists = await mongoose.models.Post.findOne({ slug: newSlug });
  if (slugExists) {
    newSlug = `${newSlug}-${Date.now()}`; 
  }

  this.slug = newSlug;
  next();
});


const Post = mongoose.model("Post", postSchema);

export default Post;
