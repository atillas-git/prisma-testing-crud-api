const express = require("express")
const prisma = require("../lib/prismaClient")

const router = express.Router()

router.get("/",async(req,res,next)=>{
    try {
        const categoryName = req.query.categoryName
        const skip = req.query.skip;
        const limit = req.query.limit
        let categories = null
        if(categoryName){
            categories = await prisma.category.findFirst({
                where:{
                    name:categoryName
                },
                skip:skip ? skip : 0,
                take:limit ? limit : 50
            })            
        }
        else{
            categories = await prisma.category.findMany({
                skip:skip ? skip :0,
                take:limit ? limit : 50
            })
        }
        return res.status(200).json(categories)
    } catch (error) {
        next(error)
    }
})

router.post("/",async(req,res,next)=>{
    try {
        const categoryName = req.body.categoryName
        if(!categoryName){
            return res.status(400).json("Invalid Category Name")
        }
        const exists = await prisma.category.findFirst({
            where:{
                name : categoryName
            }
        })
        if(exists){
            return res.status(400).json("Category already exists!")
        }
        const category = await prisma.category.create({
            data:{
                name:categoryName
            }
        })
        return res.status(200).json(category)
    } catch (error) {
        next(error)
    }
})

router.delete("/:id",async(req,res,next)=>{
    try {
        const categoryId = req.params.id
        const deletedCategory = await prisma.category.delete({
            where:{
                id:categoryId
            }
        })
        return res.status(200).json(deletedCategory)
    } catch (error) {
        next(error)
    }
})

module.exports = router;