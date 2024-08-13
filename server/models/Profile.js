
const moongoose=require("mongoose");


const profileSchmea=new moongoose.Schema({
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,

    },
    conatctNumber:{
        type:Number,
        trim:true,

    }
});

module.exports=moongoose.model("Profile",profileSchmea)
