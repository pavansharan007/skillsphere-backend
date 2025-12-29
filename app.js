import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
  origin: "https://skillsphere-frontend-blush.vercel.app",
  credentials: true
}));
//cors error

app.use(express.json({
    limit:'16kb'
}))// to configure json actaully to comunicate data

app.use(express.urlencoded({
    extended:true,limit:'16kb'
}))// to allow data from url of encoded sources like %sja+,etc..

//cookie parser
app.use(cookieParser())

app.use(express.static("public"))
// to store files and assests in public directory

app.get('/icepooting',(req,res)=>{
    res.json({
        "icepoot":"mg"
    })
    console.log("hi")
})
app.use("/ice",(req,res)=>{
    res.send("ice")
})
import router from "./routes/course.routes.js"
app.use ("/course",router)

import userRouter from "./routes/user.routes.js"
app.use("/user",userRouter)

import teacherRouter from "./routes/teacher.routes.js"
app.use("/teacher",teacherRouter)
export {app}
