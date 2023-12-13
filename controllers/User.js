import User from "../models/model.user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    const validEmail = validator.isEmail(email);
    const validUserName = validator.isAlpha(username);
    if (!validEmail) {
        return res.status(400).json({ message: "Email is invalid" });
    }
    if (!validUserName) {
        return res.status(400).json({ message: "Username is invalid" });
    }
    try {
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(500).json({ message: "User with this email already exist" });
        }
        const usernameExist = await User.findOne({ username });
        if (usernameExist) {
            return res.status(500).json({ message: "User with this username already exist" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, username, password: hashedPassword });
        if (newUser) {
            const token = await jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            res.cookie("jwt", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            const { password, ...others } = newUser._doc;
            return res.status(201).json(others);
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password: userPassword } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!userPassword) {
            return res.status(400).json({ message: "Password is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }
        const match = await bcrypt.compare(userPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: "User email or password is incorrect" });
        }
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        const { password, ...others } = user._doc;
        return res.status(201).json(others);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

export const dashboard = async (req, res) => {
    const userId = req.user;
    try {
        const user = await User.findById(userId);
        const { password, ...others } = user._doc;
        return res.status(200).json(others);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

export const allUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};
