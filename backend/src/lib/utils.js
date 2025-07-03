import jwt from "jsonwebtoken"

export const generateToken = (userId,res) => {

    const token = jwt.sign({userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    // send jwt in cookie
    res.cookie("jwt", token, {
   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
   httpOnly: true, // prevent XSS attacks cross-site attacks
   sameSite: "strict", // prevent CSRF attacks
   secure: process.env.NODE_ENV !== "development", // use secure cookies in development
   });

   return token;
}