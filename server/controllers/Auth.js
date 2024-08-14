const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenarator=require("otp-generator");

const Profile = require("../models/Profile");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
require("dotenv").config();


//sendotp
exports.sendotp=async(req,res)=>{
   try{
    const{email}=req.body;

    const checkUserPresent=await User.findOne({email});

    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already registerd"
        })
    }

    //generate otp

    var otp=otpGenarator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,

    });

    console.log("OTP generated: ",otp);

    //check unique otp

    const result=await OTP.findOne({otp:otp});

    while(result){
        otp=otpGenarator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,

        });
        result=await OTP.findout({otp:otp})
    }

    const otpPayload={email,otp};

    //craeate and entry in db for otp
    const otpBody=await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
        success:true,
        message:'Otp sent succesfully',
        otp,
    })

   }
   catch(error){
    console.log(error);
    return res.status(500).json({
        succeess:false,
        message:error.message,

    })

   }
}





//signup

exports.signup =async (req,res) => {

    try{
        //dta fetch from body
    const{
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    }=req.body;

    //validation

    if(!firstName || !lastName || !email || !password || !confirmPassword ||
        !otp ){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        //2 password match
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:'password and confirm passworddo nt match please try again',
            })
        }

        //check user already exist or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'user is already registerd'
            });
        }

        //find most recent otp stored for user
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        //validate otp
        if(recentOtp.length==0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:'otp not found'
            })
        }else if(otp !== recentOtp[0].otp){
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"otp invalid"
          });
        }

        //hash password

        const hashedPassword=await bcrypt.hash(password,10);
         
        const profileDetails=await Profile.create({
            gender:null,
            DateOfBirth:null,
            about:null,
            contactNumber:null,
        })
        //entry create
        const user=await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType: accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

        })
         return res.status(200).json({
            success:true,
            message:'user is registerd succesfully',
            user,
         })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "User cannot be registered. Please try again.",
          })
        

    }


        

}



//login

exports.login= async (req,res) => {
    try{
        //get data from req body

        const{email,password}=req.body;
        

        //validation dtat
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"all fields are required please try again"
            })
        }

        //user check exist or not assword match
        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registerd please signup first"
            })
        }

        
   //jwt token after password matching
   if(await bcrypt.compare(password,user.password)){
    const payload={
        email:user.email,
        id:user._id,
        accountType:user.accountType,
    }
    const token=jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"2h"
    });
    user.token=token;
    user.password=undefined;
   


 //create cookie and send response

        const options={
            expires:new Date(Date.now()+ 3*24*60*60*1000),
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
        })

    }
    else{
        return res.status(400).json({
            success:false,
            message:"password is incorrect"

        })
    }

}
    catch(error){
          console.log(error);
          return res.status(500).json({
            success:false,
            message:'Login failure,please try again'
          });

    }
   
};

//changepassword 

exports.changePassword=async(req,res)=>{

   try{
     //get data from req body
     const userDetails=await User.findbyId(req.user.id);
    //get oldpassword,newpassword,confirmnewpassword
    const{oldPassword,newPassword}=req.body;
    //validation

    const isPasswordMatch=await bcrypt.compare(
        oldPassword,
        userDetails.password
    )

    if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
    //updtae pass in db
    const encryptedPassword=await bcrypt.hash(newPassword,10)
    const updatedUserDetails=await User.findbyIdAndUpdate(
        req.user.id,
        {password:encryptedPassword},
        {new:true}
    )
    //send mail-password update
    try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }

    //return response
    return res.status(200).json(
    { success: true, message: "Password updated successfully" })
  }

   


   catch(error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })

   }



}
