import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken"

// const verifyJwt = async(req ,res ,next)=>{
//     try {
//         const token=req.cookies.accessToken
    
//         if(!token){
//             return res.status(404)
//             .json("unauthorized request")
//         }
    
//         const orginalToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
//         const user =await User.findOne(orginalToken._id)
    
//         req.user = user
//         next()
//     } catch (error) {
//         return res.json(error)
//     }

// }

const verifyJwt = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(404).json({ error: "Unauthorized request" });
    }
    /* getting accestoken token from cookies which contains user id and email, 
    further used for accessing user and creating routes based on it by 
    storing the user details in the middleware and can able to access directly by passing a req

    */
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    /*verifying the jwt tokens which is made by using our secret sample one  */
    const user = await User.findById(decoded?.id)


    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export default verifyJwt

