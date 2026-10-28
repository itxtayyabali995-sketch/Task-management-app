import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized user (Token not found)",
                success: false,
            });
        }
        const secret = process.env.SECRET_KEY || "mysecretkey";
        const decode = jwt.verify(token, secret);
        
        req.id = decode.userId; 
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({
            message: "Unauthorized user (Token verification failed)",
            success: false,
        });
    }
};

export default isAuthenticated;