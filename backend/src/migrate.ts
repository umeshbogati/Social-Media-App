import mongoose from "mongoose";
import { connectDB } from "./config/db";
import Post from "./models/post";
import dotenv from "dotenv";

dotenv.config();

const migrateDB = async () => {
  await connectDB();
  console.log("Connected to DB, running migration...");

  // Update Posts
  const postsResult = await Post.collection.updateMany(
    { userId: { $exists: true } },
    { $rename: { "userId": "user" } }
  );
  console.log("Posts updated:", postsResult.modifiedCount);

  // Update Comments inside Posts
  const posts = await Post.find({ "comments.userId": { $exists: true } });
  let commentsModified = 0;

  for (const post of posts) {
    let changed = false;
    post.comments = post.comments.map((c: any) => {
      if (c.userId) {
        c.user = c.userId;
        delete c.userId;
        changed = true;
      }
      return c;
    });

    if (changed) {
      await Post.updateOne(
        { _id: post._id },
        { $set: { comments: post.comments } }
      );
      commentsModified++;
    }
  }

  console.log("Posts with comments updated:", commentsModified);

  console.log("Migration complete!");
  process.exit(0);
};

migrateDB();
