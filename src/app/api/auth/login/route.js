import dbConnect from "../../../utils/dbConnect";  // Adjust the relative path based on the file location
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  await dbConnect();
  
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.status(200).json({ token, username });
}
