const { default: mongoose } = require("mongoose");
const moongoose=require("mongoose");

const userSchema=new moongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,

    },
    password:{
        type:String,
        required:true,

    },
    accountType:{
        type:String,
        enum:["Admin","User","Instructor"],
    
        required:true,

    },
    additionalDetails:{
        type:moongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:[
        {
            type:moongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    image:{
        type:String,
        required:true,
    },

    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,

    },
    courseProgress:[

        {
          type: mongoose.Schema.Types.ObjectId,
          ref:"CourseProgress" ,
        }
    ],
})

module.exports=moongoose.model("User",userSchema);