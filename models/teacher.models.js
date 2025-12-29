import mongoose, { Schema } from "mongoose"

const teacherSchema =new  Schema(
  {
    email:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    courses:[
      {
        name:String,
        enrollmentId:String,
        courseImage:String
      }
    ]
  },
  {
    timestamps:true
  }
)

export const Teacher = mongoose.model("Teacher",teacherSchema)