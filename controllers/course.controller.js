
import { Courses } from "../models/course.model.js";
import { Teacher } from "../models/teacher.models.js";
import { User } from "../models/user.model.js";
import {customAlphabet } from "nanoid";
import { uploadOnCloudinary } from "../config/clodinary.js";
// const addCourse = async(req ,res)=>{
//     const {name,courseImage,contents,contentname,modules,modulecontent}= req.body
//     const teacher = await Teacher.findById(req.teacher._id)
//     const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 5)
//     console.log(req.body)
//     if(!teacher){
//         return res.status(404)
//         .json("nned to be logged in to add course")
//     }
//     const existingCourseWithEnrollmentId= await Courses.find({name})
    
//     if(existingCourseWithEnrollmentId.length===0){
//         const enrollmentId= nanoid()
//         await Courses.create({
//             name,
//             courseEnrollmentId:enrollmentId,
//             courseImage,
//             contents,
//             contentname,
//             modules,
//             modulecontent
//         })
//         courseObj={
//             name:name,
//             enrollmentId:enrollmentId
//         }
//         teacher.courses.push(courseObj)
//         await teacher.save()
//     }else{
//         res.status(401)
//         .json("the course already exists")
//     }
    
    
//     return res.status(200)
//     .json({
//         teacher,
        
//     })
// }

// const addCourse = async (req, res) => {
//   try {
//     const { name, courseImage, contents, contentname, modules, modulecontent } = req.body;
//     const teacher = await Teacher.findById(req.teacher._id);

//     if (!teacher) {
//       return res.status(404).json("Need to be logged in to add course");
//     }

//     const existingCourse = await Courses.findOne({ name });
//     if (existingCourse) {
//       return res.status(401).json("The course already exists");
//     }
//     let courseImageUrl = "";
//     if (req.file) {
//       const result = await uploadOnCloudinary(req.file.path);
//       courseImageUrl = result?.secure_url || "";
//     }

//     const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 5);
//     const enrollmentId = nanoid();

//     const newCourse = await Courses.create({
//       name,
//       courseEnrollmentId: enrollmentId,
//       courseImage: courseImageUrl,
//       contents,
//       contentname,
//       modules,
//       modulecontent
//     });

//     teacher.courses.push({
//       name: newCourse.name,
//       enrollmentId: newCourse.courseEnrollmentId
//     });

//     await teacher.save();

//     // re-fetch to ensure fresh data
//     const updatedTeacher = await Teacher.findById(req.teacher._id);

//     return res.status(200).json({ teacher: updatedTeacher });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json("Server error");
//   }
// };
const addCourse = async (req, res) => {
  try {
    // Multer attaches text fields to req.body
    const { name, contents } = req.body;

    const teacher = await Teacher.findById(req.teacher._id);
    if (!teacher) {
      return res.status(404).json("Need to be logged in to add course");
    }

    const existingCourse = await Courses.findOne({ name });
    if (existingCourse) {
      return res.status(401).json("The course already exists");
    }

    // Upload file if present
    let courseImageUrl = "";
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      courseImageUrl = result?.secure_url || "";
    }

    const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);
    const enrollmentId = nanoid();

    const newCourse = await Courses.create({
      name,
      courseEnrollmentId: enrollmentId,
      courseImage: courseImageUrl,
      contents: contents ? JSON.parse(contents) : [], // parse JSON string
    });

    teacher.courses.push({
      name: newCourse.name,
      enrollmentId: newCourse.courseEnrollmentId,
      courseImage:courseImageUrl
    });
    await teacher.save();

    const updatedTeacher = await Teacher.findById(req.teacher._id);
    return res.status(200).json({ teacher: updatedTeacher });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
};



const editCourse = async(req, res)=> {
    const course = JSON.parse(req.body.course);

    console.log(course)
    const Findcourse = await Courses.findOne({courseEnrollmentId:course.courseEnrollmentId})

    if (req.file) {
      // If a new file is uploaded, push to Cloudinary
      const result = await uploadOnCloudinary(req.file.path);
      Findcourse.courseImage = result?.secure_url || Findcourse.courseImage;
    } else {
      // If no new file uploaded, keep the existing one
      Findcourse.courseImage = course.courseImage || Findcourse.courseImage;
    }

    Findcourse.name=course.name
    Findcourse.contents=course.contents

    await Findcourse.save()

    return res.status(200)
    .json("course updated succesfully")
}

const deleteCourse = async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    
    if (!enrollmentId) {
      return res.status(400).json({ message: "enrollmentId is required" });
    }
    
    await Teacher.findByIdAndUpdate(
      req.teacher._id,
      { $pull: { courses: { enrollmentId } } },
      { new: true }
    );

    const deletedCourse = await Courses.findOneAndDelete({
      courseEnrollmentId: enrollmentId,
    });

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const markContent = async(req, res)=>{
    const {coursename,contentname}=req.body
    const user =await User.findById(req.user._id)
    if(!user){
        return res.status(404)
        .json("user not found")
    }

    let course = user.progress.find(p => p.coursename===coursename)

    
    if(!course){
        course={coursename:coursename,markedContent:[]}
        user.progress.push(course)
    }

    if(!course.markedContent.includes(contentname)){
        course.markedContent.push(contentname)
    }        
    await user.save ()

    return res.status(200)
    .json(`${contentname} marked succesfully`)
}

const unMarkContent = async(req,res)=>{
    const{coursename,contentname}=req.body
    const user= await User.findById(req.user._id)
    if(!user){
        return res.status(401)
        .json("user nott found or login first")
    }

    let course= user.progress.find(p => p.coursename===coursename)

    if(course){
        const index= course.markedContent.indexOf(contentname)
        course.markedContent.splice(index,1)
        
        await user.save()
        return res.status(200)
        .json(`${contentname} is unmarked`)
    }

    return res.status(401)
    .json("something went wrong")
}
const modulecontents = async(req,res) => {
    
    const {name,contentname,modulecontent}=req.body
    const user= await User.findById(req.user._id)

    if(!user){
        return res.status(404)
        .json("user not found")
    }

    let message=`${modulecontent} marked`
    let markedContent = user.modulesProgress.find(m => m.name===name)
    if(!markedContent){
        markedContent={
            name:name,
            contentmarked:[
                {
                    contentname:contentname,
                    markedModules:[],
                    modulepercentage:0
                }
            ]
        }
        user.modulesProgress.push(markedContent)
    }
    let needmarked = markedContent.contentmarked.find(c => c.contentname === contentname)
    if (!needmarked) {
    needmarked = {
        contentname: contentname,
        markedModules: [],
        modulepercentage: 0
    };
    markedContent.contentmarked.push(needmarked);
}

    if(needmarked.markedModules.includes(modulecontent)){
        const index = needmarked.markedModules.indexOf(modulecontent)
        needmarked.markedModules.splice(index,1)
        message=`${modulecontent} unmarked`
    }else{
        if(!needmarked.markedModules.includes(modulecontent)){
        needmarked.markedModules.push(modulecontent)
    }
    }
    
    let userModules= needmarked?.markedModules?.length || 0

    const course = await Courses.findOne({name})
    if(!course){
        return res.status(404)
        .json("content didn't found")
    }
    
    const module =course.contents.find(c => c.contentname===contentname)
    
    const totalModules= module.modules.length
    console.log("user",userModules)
    console.log("mod",totalModules)    
    
    let totalModulesProgress = ((userModules)/(totalModules))*100
    needmarked.modulepercentage = Math.floor(totalModulesProgress);

    let contentProgress = user.progress.find( p => p.name===name)
    if(!contentProgress){
        contentProgress={name,completedContents:[]}
        user.progress.push(contentProgress)
    }

    if(totalModulesProgress === 100){

        if(!contentProgress.completedContents.includes(contentname)){
            contentProgress.completedContents.push(contentname)
        }
        
    }else{
        
            const index = contentProgress.completedContents.indexOf(contentname)
            if(index !== -1){
                contentProgress.completedContents.splice(index,1)
            }
    }

    await user.save()

    return res.status(200)
    .json(
        {
            fetchedUser:user,
            message:message,
            totalModulesProgress,
            markedModules: needmarked.markedModules,   // 👈 send back the updated list
  modulepercentage: needmarked.modulepercentage
        }
    )

}
const getCourse = async(req ,res)=>{
    const {name}=req.body
    const course = await Courses.findOne({name})
    if(!course){
        return res.status(401)
        .json("icepoot")
    }

    return res.status(200).json({
      message: "Course fetched successfully",
      course,
    });

}

const userProgress = async(req ,res)=>{
    const user= await User.findById(req.user._id)

    const{name,contentname} = req.body
    if(!user){
        return res.status(404)
        .json("user not found")
    }
    const course = await Courses.findOne({name})
    
    if(!course){
        return res.status(404).json("course not found")
    }
    // const contents = course.contents.find(c => c.contentname === contentname)
    // if(contents){
    //     let TotalContents = contents.modules.length
    // }
    //blah blah blah lets start
    const coursecontents = course.contents.length
    let usercompleted= user.progress.find(p => p.name === name)
    let usercontents = usercompleted?.completedContents?.length || 0;

    let courseProgress=((usercontents)/(coursecontents))*100
    
    const module = course.contents.find(c => c.contentname === contentname)

    const moduleconts = module?.modules?.length || 0;


    let userModules = user.modulesProgress.find(m => m.contentname === contentname)

    let usercompletedmodules = userModules?.markedModules?.length || 0;


    let moduleProgress = ((usercompletedmodules)/(moduleconts))*100 

    const Module = user.modulesProgress.find(m => m.contentname===contentname)
    const modulepercentage = userModules?.modulepercentage || 0;

    return res.status(200)
    .json({
        user:user,
        modulepercentage,
        progress:user.progress,
        modules:user.modulesProgress,
        courseProgress,
        moduleProgress,
        userModules

    })

}

const showModuleProgress= async(req ,res)=>{
    const{name,contentname}=req.body
    const user=await User.findById(req.user._id)

    if(!user){
        return res.status(404)
        .json("user not found")
    }

    const content = user.modulesProgress.find(m => m.name === name)
    const markedcontent = content.contentmarked.find(c => c.contentname === contentname)
    if(!content){
        return res.status(404)
        .json("something went wrong")
    }

    return res.status(200)
    .json({
        modulepercentage:markedcontent?.modulepercentage || 0
    })
}
const allCourses = async(req,res)=>{
    const courses = await Courses.find({})
    return res.status(200)
    .json(courses)
}
const courseProgress= async(req ,res) => {
    const {name}= req.body
    const course= await Courses.findOne({name})
    const contents = course.contents
    let totalContents=0
    contents.map((content) => {
        totalContents+=content?.modules?.length
    })

    const user =await User.findById(req.user._id)
    if(!user){
        return res.status(404)
        .json("user not found")
    }
    let usermarkedmodules=0
    let fetchcoursefromuser=user.modulesProgress.find( m => m.name === name)
    fetchcoursefromuser.contentmarked.map((markedcontent) => {
        usermarkedmodules+=markedcontent?.markedModules?.length || 0
    })
    let courseprogress=Math.floor(((usermarkedmodules)/totalContents)*100)
    const uprogress=user.progress.find(p => p.name === name)
    if(!uprogress.courseprogress){
        uprogress.courseprogress=0
    }
    uprogress.courseprogress=courseprogress
    user.markModified('progress');

    await user.save()
    return res.status(200)
    .json(
        {
            courseprogress,
            usermarkedmodules,
            totalContents
        }
    )
}
export {addCourse,markContent,unMarkContent,modulecontents,userProgress,getCourse,showModuleProgress,allCourses,
    courseProgress,editCourse,deleteCourse
}