import mongoose from "mongoose";

const connectdb = async() => {
    try {
        const connectedto = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`)
        console.log(`connected to ${connectedto.connection.host}`)
    } catch (error) {
        console.log(error)
        console.log("db isn't connected")
    }

}

export {connectdb}