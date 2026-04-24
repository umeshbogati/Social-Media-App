import mongoose from "mongoose";
import { text } from "node:stream/consumers";

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true},
    image: { type: String},
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
    comments:[
        {
            userId:  mongoose.Schema.Types.ObjectId,
            text: String
        }
    ]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);