import jwt from "jsonwebtoken";
export const validateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(400).json({ message: "You not authorized" });
        }
        const verified = await jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(400).json({ message: "Unauthorized access" });
        }
        req.user = verified.userId;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(500).json({ message: "Jwt token is Expired" });
        } else {
            return res.status(500).json({ message: "Something went wrong", error });
        }
    }
};
