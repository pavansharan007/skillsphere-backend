import mongoose, { model, Schema } from "mongoose";

const moduleSchema = new Schema({
    modulecontent: { type: String }
});

const contentSchema = new Schema({
    contentname: { type: String },
    modules: [moduleSchema]
});

const courseSchema = new Schema(
    {
        name: { type: String, required: true },
        courseEnrollmentId:String,
        courseImage:String,
        contents: [contentSchema]
    },
    { timestamps: true }
);

export const Courses = model("Courses", courseSchema);