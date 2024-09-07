const mongoose=require("mongoose");


const SubSectionSchmea=new mongoose.Schema({
    title:{
        type:String,
    },
    timeDuration:{
        type:String,
    },
    description:{
        type:String,
       

    },
    videoUrl:{
        type:Number,
       

    }
});

module.exports=mongoose.model("SubSection",SubSectionSchmea)
