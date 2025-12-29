import { User } from "../models/user.model.js";
import bcrypt, { genSalt } from "bcrypt"
import jwt from "jsonwebtoken"
import {Courses} from "../models/course.model.js"

const signup = async(req ,res)=>{
    //get user details
    const {fullname,email,password}=req.body

    if(!fullname){
        return res.status(401)
        .json("fullname is required")
    }
    if(!email){
        return res.status(401)
        .json("email is required")
    }
    if(!password){
        return res.status(200)
        .json("password is required")
    }
    if(!fullname && !email && !password){
        return res.status(401)
        .json("all fields are required")
    }

    const existsUser = await User.findOne({email})

    if(existsUser){
        return res.status(401)
        .json("user with email already exists please login")
    }

    const hashPass =await bcrypt.hash(password,10)
    const user = User.create({
        fullname,
        email,
        password:hashPass
    })

    if(!user){
        return res.status(404)
        .json("something went wrong")
    }
    return res.status(200)
    .json("user creayed succesfully")
}

const login = async(req ,res) => {
    const {email,password} = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.status(401)
        .json("user with email id is not found or user is not registered")
    }

    const originalPass = await bcrypt.compare(password,user.password)

    if(!originalPass){
        return res.status(401)
        .json("password didn't match")
    }

    const accesstoken = jwt.sign({id : user._id,email:user.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
    const refreshtoken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})

    user.refreshToken=refreshtoken
    await user.save({validateBeforeSave:false})
    return res.status(200)
    
    .cookie("accessToken",accesstoken,{httpOnly:true,secure:true,sameSite: "none" })
    .cookie("refreshToken",refreshtoken,{httpOnly:true,secure:true,sameSite: "none" })
    .json("user logged in succesfulkky")
    
}

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    console.log("Cookies before clearing:", req.cookies);

    res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ loggedIn: false });
      console.log(req.cookies)
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};

const getUserProgress = async(req ,res) => {
    const user = await User.findById(req.user._id)
    const{name,contentname} = req.body
    if(!user){
        return res.status(404)
        .json("user not foound")
    }
    
    const content = user.modulesProgress.find(m => m.contentname ==- contentname)
    let modpercent = content.modulepercentage
    return res.status(200)
    .json(modpercent)
}

const getcurrentuser = async(req ,res)=>{
    const user = await User.findById(req.user._id)
    if(!user){
        return res.status(404)
        .json({loggedIn:false})
    }
    return res.status(200)
    .json({loggedIn:true,
        fetchuser:user
    })
}

const checkId = async(req , res) => {
    const user = await User.findById(req.user._id)
    const {courseEnrollmentId} = req.body
    if(!user){
        return res.status(404)
        .json(
            "Please login"
        )
    }
    const foundCourse= await Courses.findOne({courseEnrollmentId : courseEnrollmentId})
    if(!foundCourse){
        return res.status(200)
        .json({
            flag:false,
            ice:"Course not found 😭"
        })
    }
    console.log(foundCourse)
    return res.status(200)
    .json({
        flag:true,
        foundCourse
    })

}

const onclickEnroll = async (req, res) => {
    const user = await User.findById(req.user._id)
    const {courseEnrollmentId}=req.body

    if(!user){
        return res.status(404)
        .json("User not found")
    }

    const alreadyEnrolled = user.enrolledCourses.includes(courseEnrollmentId);

    console.log(alreadyEnrolled)
  if (alreadyEnrolled) {
    return res.status(200).json(
       "Course already enrolled"
    );
  }

    console.log(user.enrolledCourses)
        user.enrolledCourses.push(
            courseEnrollmentId
        )
        await user.save()
    return res.status(200)
    .json("succesfully enrolled")
}

const userCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json("User not found, please login");
    }

    let userCourses = [];
    console.log(user.enrolledCourses)
    // Loop through each enrolled course code
    for (const courseCode of user.enrolledCourses) {
      // If enrolledCourses stores course codes
      const singleCourse = await Courses.findOne({ courseEnrollmentId: courseCode });

      // If enrolledCourses actually stores ObjectIds as strings, use:
      // const singleCourse = await Courses.findById(courseCode);

      if (singleCourse) {
        userCourses.push(singleCourse);
      }
    }

    return res.status(200).json(userCourses);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
};


export {
    signup,
    login,
    logout,
    getUserProgress,
    getcurrentuser,
    checkId,
    onclickEnroll,
    userCourses
}