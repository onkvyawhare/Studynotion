const mongoose=require("mongoose");

//console.log


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
