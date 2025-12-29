import { Router } from "express"
import verifyJwt from "../middlewares/auth.middleware.js"
import VerifyTeacherToken from "../middlewares/teacher.middleware.js"
import { upload } from "../middlewares/upload.js"
import { 
    
    addCourse, allCourses, courseProgress, deleteCourse, editCourse, getCourse, markContent, modulecontents, showModuleProgress, unMarkContent, userProgress } from "../controllers/course.controller.js"
const router = Router()

router.route("/postcourse").post(VerifyTeacherToken,upload.single("file"),addCourse)
router.route('/editCourse').post(upload.single("file"),editCourse)
router.route('/delete').post(VerifyTeacherToken,deleteCourse)
router.route("/mark").post(verifyJwt,markContent)
router.route("/unmark").post(verifyJwt,unMarkContent)
router.route("/modulecontents").post(verifyJwt,modulecontents)
router.route("/userprogress").post(verifyJwt,userProgress)
router.route('/modulepercent').post(verifyJwt,showModuleProgress)
router.route("/ice").post(verifyJwt,getCourse)
router.route('/allcourses').get(allCourses)
router.route('/courseprogreess').post(verifyJwt,courseProgress)
// ...existing code...
router.get("/test", (req, res) => {
    res.send("Course route working!");
});
// ...existing code...


export default router