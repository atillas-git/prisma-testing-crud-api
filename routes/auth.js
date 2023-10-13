const express = require("express")
const bcrypt = require("bcrypt")
const prisma = require("../lib/prismaClient")

const router = express.Router()

router.post("/register",async(req,res,next)=>{
    try {
        const user = {
            username : req.body.username,
            password : req.body.password,
            email:req.body.email
        }
        if(!user.email || !user.password){
            return res.status(400).json("Invalid Credentials")
        }
        const exists = await prisma.user.findUnique({
            where:{
                email:user.email
            }
        })
        if(exists){
            return res.status(400).json("Email already exists!")
        }
        
        const salt = bcrypt.genSaltSync(10)
        const np = await bcrypt.hash(user.password,salt)
        user.password = np;

        const createdUser = await  prisma.user.create({
            data:user
        })
        return res.status(200).json(createdUser)   
    } catch (error) {
        next(error)
    }
})

router.post("/login",async(req,res,next)=>{
    try {
        const user = {
            password : req.body.password,
            email:req.body.email
        }
        if(!user.email || !user.password){
            return res.status(400).json("Invalid Credentials")
        }
        const dbUser = await prisma.user.findUnique({
            where:{
                email:user.email
            }
        })
        if(!dbUser){
            return res.status(404).json("User does not exists!")
        }
        const compare = await bcrypt.compare(user.password,dbUser.password)
        if(!compare){
            return res.status(400).json("Invalid Credentials!")
        }
        return res.status(200).json("Login success!")
    } catch (error) {
        next(error)
    }
})

module.exports = router