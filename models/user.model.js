import mongoose, { Schema } from "mongoose"
const markedContentSchema = new Schema(
    {
        type:String
    },
    {
        timestamps:true
    }
)
const markedModuleSchema = new Schema({
    type:String
},{timestamps:true})
const userSchema = new Schema(
    {
        fullname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        enrolledCourses: {
        type: [String],
        },

        progress:[

            {
                // coursename:String,
                // markedContent: [String]
                // for marking and unmarking (like kinda todos)
                name:String,
                completedContents:[],
                courseprogress:Number
            }
        ],
        modulesProgress:[
            {
                name:String,
                contentmarked:[{contentname:String,
                markedModules:[String],
                modulepercentage:Number}]
            }
        ],
        refreshToken:{
            type:String
        }
    },
    {timestamps:true}
)


export const User = mongoose.model("User",userSchema)

