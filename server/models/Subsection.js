const moongoose=require("mongoose");


const SubSectionSchmea=new moongoose.Schema({
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

module.exports=moongoose.model("SubSection",SubSectionSchmea)
