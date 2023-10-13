require("dotenv").config()
const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")

const authRouter = require("./routes/auth");

const app = express()


app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())

app.use("/api/auth",authRouter)

const port = process.env.PORT || 5000

app.get("/",(req,res)=>{
    return res.status(200).send({
        status:200,
        msg:"Hello from the server!"
    })
})

app.listen(port,()=>{
    console.log("Server is listening on port",port)
})