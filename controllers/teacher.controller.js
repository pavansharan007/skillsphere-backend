import { decode } from "jsonwebtoken";
import { Teacher } from "../models/teacher.models.js";
import { Courses } from "../models/course.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const teacherSignUp = async(req ,res) => {
  const{email,password}=req.body
  const existedteacher = await Teacher.findOne({email})
  if(existedteacher){
    return res.status(401)
    .json("email already exists please login")
  }

  const hashedpass = await bcrypt.hash(password,10)
  const teacher  = await Teacher.create(
    {
      email,
      password:hashedpass
    }
  )

  return res.status(200)
  .json(
    {
      message:"success",
      teacher
    }
  )
}

const teacherSignIn = async(req , res)=> {
  const {email,password}= req.body

  if(!email){
    return res.status(404)
    .json("email is required")
  }

  if(!password){
    return res.status(404)
    .json("password is required")
  }

  if (!email && !password){
    return res.status(404)
    .json("all fields are required")
  }
  const teacher = await Teacher.findOne({email})
  const decodedPass =await bcrypt.compare(password,teacher.password)

  if(!decodedPass){
    return res.status(401)
    .json("passwords didn't matched")
  }

  const accessToken = jwt.sign({id:teacher._id,email:email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
  res.status(200)
  .cookie("TeacherAccessToken",accessToken,{httpOnly:true,secure:true})
  .json("techer logged in succesfully")
}

const logout = async(req ,res) => {
  const teacher =await Teacher.findById(req.teacher._id)
  if(!teacher){
    return res.status(404)
    .json("need to logged in first to logout")
  }

  res.status(200)
  .clearCookie("accessToken",{httpOnly:true,secure:true,sameSite: "None"})
  .json("teacher logged out succesfully")
}

const yourCourses = async (req , res) => {
  const teacher = await Teacher.findById(req.teacher._id)

  if(teacher){
    const PublishedCourses = teacher.courses
    console.log(PublishedCourses)
    if(PublishedCourses.length===0){
      return res.status(200)
      .json({
        message:"No courses yet",
        
      })
    }else{

      return res.status(200).json({
        message:"No courses yet",
        message:true,
        PublishedCourses
      })
    }
  }else{
    return res.status(404)
    .json("Please Login")
  }
}

const getEnrolledStudents = async (req, res) => {
  try {
    const { name } = req.body;

    // Find the course
    const course = await Courses.findOne({ name });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Get all users
    const users = await User.find({});

    const EnrolledUsers = [];

    for (const user of users) {
      
      const userCourse = user.modulesProgress.find(c => c.name === name);
      if (!userCourse) continue; 

      
      let markedModules = 0;
      for (const content of userCourse.contentmarked) {
        markedModules += content.markedModules.length;
      }

      
      let courseModules = 0;
      for (const content of course.contents) {
        courseModules += content.modules.length;
      }

      
      const totalProgress = courseModules > 0 
        ? (markedModules / courseModules) * 100 
        : 0;

      EnrolledUsers.push({
        fullname: user.fullname,
        totalProgress: Math.round(totalProgress) 
      });
    }

    return res.status(200).json(EnrolledUsers);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


const getCourse = async(req,res) => {
  const {enrollmentId}=req.body
  const course = await Courses.findOne({courseEnrollmentId : enrollmentId})

  if(!course){
    return res.status(400)
    .json({
      message:false
    })
  }

  return res.status(200)
  .json({
    message:true,
    course
  })
}
const getcurrentteacher= async(req , res) => {
  const teacher = await Teacher.findById(req.teacher._id)
  if(!teacher){
    return res.status(404)
    .json({
      loggedIn:false
    })

  }

  return res.status(200)
  .json({
    loggedIn:true,
    fetchTeacher:teacher
  })
}

export {teacherSignUp,teacherSignIn,logout,getcurrentteacher,yourCourses,getCourse,getEnrolledStudents}