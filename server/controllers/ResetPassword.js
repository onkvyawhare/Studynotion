const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const crypto=require("crypto");
const bcrypt=require("bcrypt");

//resetpasswordtoken

exports.resetPasswordToken=async(req,res)=>{

    try{
        //get email from res body
    const email=req.body.email;

    //check user for this email,email verification
    const user=await User.findOne({email:email});
    if(!user){
        return res.json({success:false,
            message:'Your email is not registerd with us'
        });
    }
    //generate token
    const token=crypto.randomUUID();
    //update user by adding token and expiration time
    const updateDetails=await User.findOneAndUpdate(
        {email:email},
        {
            token:token,
            resetPasswordExpires:Date.now()+ 5*60*1000,
        },
        {new:true}
    )
    
    //create url
    const url=`http://localhost:3000/update-password/${token}`

    //send mail containing url
    await mailSender(email,
        "password reset link",
        `Password Reset Link:${url} `);
    
    // return Response

    return res.json({
        success:true,
        message:'Email sent succesfully,please check email and try password'
    });

    }
    catch(error){

        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while resetting password'
        })


    }
  
}

exports.resetPassword=async(req,res) =>{
    try{
    //data fetch
    const{password,confirmPassword,token}=req.body;
    //validation

    if(password !== confirmPassword){
        return res.json({
            success:false,
            message:"Password not matching",
        })
    }
    //get userdetails from db using token
    const userDetails=await User.findOne({token:token});
    //if no entry=invalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:'Token is invalid',
        });
     }

     //token time check
     if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success:false,
            message:"Token is expired please regenerate your token",
        })
    }
    
    //password hashing
    const hashedPassword=await bcrypt.hash(password,10);

    //password update

    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    );

    //retrun response
    return res.status(200).json({
        success:true,
        message:"password reset succesfully",
    })
    }
    catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            message:"something went wrong while reseting password",
        })

    }


}