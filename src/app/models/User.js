import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, required: true, enum: ["Pending", "Approved", "Rejected"] },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
