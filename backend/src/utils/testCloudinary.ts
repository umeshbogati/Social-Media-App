import cloudinary from "../config/cloudinary";

// Test Cloudinary configuration
const testCloudinary = async () => {
  try {
    console.log("Testing Cloudinary configuration...");

    // Test configuration by getting account info
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connected successfully!");
    console.log("Account Info:", {
      cloud_name: cloudinary.config().cloud_name,
      status: result.status,
    });

  } catch (error: any) {
    console.error(" Cloudinary test failed:", error.message);
    console.error(" Check your environment variables:");
    console.error(
      "- CLOUD_NAME:",
      process.env.CLOUD_NAME ? "Set" : "Missing",
    );
    console.error(
      "- CLOUD_API_KEY:",
      process.env.CLOUD_API_KEY ? "Set" : "Missing",
    );
    console.error(
      "- CLOUD_API_SECRET:",
      process.env.CLOUD_API_SECRET ? "Set" : "Missing",
    );
  }
};

export default testCloudinary;
