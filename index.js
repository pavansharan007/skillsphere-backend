import dotenv from "dotenv"
import { app } from "./app.js"
import { connectdb } from "./db/connectdb.js"

dotenv.config({path : './.env'})

connectdb()
.then(
    app.listen(process.env.PORT, () => {
        console.log(`server running at port ${process.env.PORT}`)
    })
)
.catch((errror)=> {
    console.log("error",errror)
})