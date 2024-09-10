const jwt=require("jsonwebtoken");
require("dotenv").config();

const User=require("../models/User");

exports.auth=(req,res,next) => {
    try{
        //extract token
        const token=req.cookies.token 
        || req.body.token 
        || req.header("Authorisation").replace("Bearer","");
        console.log(req.headers);


        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing"
            });
        }

        //verify the token
        try{
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid",
            })
        }
        next();


    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'something went erong while validating the token',

        });

    }
}

//isstudent

exports.isStudent=(req,res,next)=>{
    try{
       if(req.user.accountType !== "student"){
        return res.status(401).json({
            success:false,
            message:"this is a protected route for student"
        })
       }
        next();
        
    }
   catch(error){
        return res.json.status(500).json({
            success:false,
            message:"user role is not verified please try again",
        })


    }
}


exports.isInstructor=(req,res,next)=>{
    try{
       if(req.user.accountType !== "Instructor"){
        return res.status(401).json({
            success:false,
            message:"this is a protected route for instructor"
        })
       }
        next();
        
    }
   catch(error){
        return res.json.status(500).json({
            success:false,
            message:"user role is not verified please try again",
        })


    }

}


exports.isAdmin=(req,res,next)=>{
    try{
       if(req.user.accountType !== "Admin"){
        return res.status(401).json({
            success:false,
            message:"this is a protected route for admin"
        })
       }
        next();
        
    }
   catch(error){
        return res.json.status(500).json({
            success:false,
            message:"user role is not verified please try again",
        })


    }
}