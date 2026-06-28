import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender, profilePhoto } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // profilePhoto
        const maleProfilePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff&rounded=true`;
        const femaleProfilePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E91E8C&color=fff&rounded=true`;

        const defaultPhoto = gender === "male" ? maleProfilePhoto : femaleProfilePhoto;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: profilePhoto || defaultPhoto,
            gender
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        // In production the frontend and backend are on different domains, so the
        // cookie must be SameSite=None and Secure for the browser to send it.
        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'strict',
            secure: isProduction,
        };

        return res.status(200).cookie("token", token, cookieOptions).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'strict',
            secure: isProduction,
        }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}