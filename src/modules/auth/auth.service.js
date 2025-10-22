import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { getDB } from "../../config/db.js";
import { ObjectId } from "mongodb";

const col = () => getDB().collection("users");
const RegisterDTO = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  name: z.string().min(2),
});

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = RegisterDTO.parse(req.body);
    const exists = await col().findOne({ email });
    if (exists) return res.status(409).json({ message: "Email exists" });
    const hash = await bcrypt.hash(password, 12);
    const { insertedId } = await col().insertOne({
      email,
      name,
      password: hash,
    });
    res.status(201).json({ id: insertedId, email, name });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await col().findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ uid: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { httpOnly: true });
    res.json({ token, user: { id: user._id, email, name: user.name } });
  } catch (e) {
    next(e);
  }
};

export const profile = async (req, res, next) => {
  try {
    const user = await col().findOne(
      { _id: new ObjectId(req.user.uid) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    next(e);
  }
};
