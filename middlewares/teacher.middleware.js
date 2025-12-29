import { Teacher } from "../models/teacher.models.js";
import jwt from "jsonwebtoken"

const VerifyTeacherToken = async(req ,res , next) => {
  const token = req.cookies?.TeacherAccessToken

  if(!token){
    return res.status(401)
    .json("user not logged in or user not found please login")
  }

  const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  const teacher =await Teacher.findById(decodedToken.id)

  req.teacher = teacher
  next()

}

export default VerifyTeacherToken