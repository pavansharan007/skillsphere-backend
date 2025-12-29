import express from "express"
import { Router } from "express"
import { getcurrentuser, getUserProgress, login, logout, signup,checkId,userCourses,onclickEnroll } from "../controllers/user.controller.js"
import verifyJwt from "../middlewares/auth.middleware.js"
const router =Router()

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").get(verifyJwt,logout)
router.route('/getuser').post(verifyJwt,getUserProgress)
router.route("/getcurrentuser").get(verifyJwt,getcurrentuser)
router.route("/checkid").post(verifyJwt,checkId)
router.route("/enroll").post(verifyJwt,onclickEnroll)
router.route("/getCourses").get(verifyJwt,userCourses)
export default router
