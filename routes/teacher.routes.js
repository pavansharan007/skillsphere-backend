import express, { Router } from "express"
import VerifyTeacherToken from "../middlewares/teacher.middleware.js"
import { getCourse, getcurrentteacher, getEnrolledStudents, logout, teacherSignIn, teacherSignUp, yourCourses } from "../controllers/teacher.controller.js"

const router = Router()

router.route('/teacherlogin').post(teacherSignIn)
router.route('/tecahersignup').post(teacherSignUp)
router.route('/teacherlogout').get(VerifyTeacherToken,logout)  
router.route('/getEnrolledStudents').post(getEnrolledStudents)
router.route('/getcurrentteacher').get(VerifyTeacherToken,getcurrentteacher)
router.route('/yourcourses').get(VerifyTeacherToken,yourCourses)
router.route('/getCourse').post(getCourse)
export default router