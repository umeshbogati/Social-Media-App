import mongoose from "mongoose";
import { connectDB } from "../../config/db";
import User from "../../models/user";
import Post from "../../models/post";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Sample data for seeding the database
const sampleUsers = [
  {
    username: "umesh_bogati",
    name: "Umesh Bogati",
    email: "umesh@gmail.com",
    password: "umesh123!", // This will be hashed
    role: "user" as const,
  },
  {
    username: "sachin_singh_kc",
    name: "Sachin Singh KC",
    email: "sachin@example.com",
    password: "sachin123!", // This will be hashed
    role: "admin" as const,
  },
];

const samplePosts = [
  {
    description: "This is my first post!",
    image: "", // Empty string means no image
  },
  {
    description: "Beautiful sunset today.",
    image: "", // Empty string means no image
  },
];

// Main function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("Connected to database for seeding...");

    // Remove all existing data to start fresh
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("Existing data cleared.");

    // Prepare users with hashed passwords
    console.log("Preparing users with hashed passwords...");
    const usersWithHashedPasswords = [];
    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      usersWithHashedPasswords.push({
        ...user,
        password: hashedPassword,
      });
    }

    // Insert users into database
    const insertedUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`Seeded ${insertedUsers.length} users successfully!`);

    // Prepare posts with user IDs
    console.log("Preparing posts with user references...");
    const postsWithUserIds = samplePosts.map((post, index) => {
      // Assign posts to users in round-robin fashion
      const userIndex = index % insertedUsers.length;
      const assignedUser = insertedUsers[userIndex]!; // Non-null assertion since we know users exist

      return {
        ...post,
        userId: assignedUser._id, // Reference to the user who created the post
      };
    });

    // Insert posts into database
    const insertedPosts = await Post.insertMany(postsWithUserIds);
    console.log(`Seeded ${insertedPosts.length} posts successfully!`);

    console.log(" Database seeding completed successfully!");
    console.log("You can now start the server and test the API.");

    process.exit(0); // Exit with success code
  } catch (error) {
    console.error(" Error during database seeding:", error);
    process.exit(1); // Exit with error code
  }
};

// Utility to delete users by email
const deleteUserByEmail = async (email: string) => {
  await connectDB();
  const result = await User.deleteMany({ email });
  console.log(`Deleted ${result.deletedCount} user(s) with email: ${email}`);
};

// Run this utility before seeding
(async () => {
  await deleteUserByEmail("sachin@example.com");
  // Uncomment the next line to run the full seed after deletion
  // await seedDatabase();
  process.exit();
})();

// Run the seeding function
seedDatabase();
