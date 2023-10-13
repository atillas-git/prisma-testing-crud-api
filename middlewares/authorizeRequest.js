const authorizeRequest = (req,res,next)=>{
    try {
        const apiKey = req.query.apiKey || req.headers["x-api-key"]
        if(apiKey === process.env.API_KEY){
            return next()
        }
        return res.status(401).json("UnAuthorized!")
    } catch (error) {
        return next(error)
    }
}
module.exports = authorizeRequest