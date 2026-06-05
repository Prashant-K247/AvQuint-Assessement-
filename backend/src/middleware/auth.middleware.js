import user from "../models/User.js";
import jwt from "jsonwebtoken";

const protect = async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            const verify = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await user.findById(verify.id).select("-password");
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({message: "Not authorized"});
        }
    }
    if (!token) {
        return res.status(401).json({message: "No token provided"});
    }
}

export default protect;