const moongoose=require("mongoose");


const courseProgress=new moongoose.Schema({

    courseID:{
        type:moongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVideos:{
        type:moongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }

})

module.exports=moongoose.model("courseProgress",courseProgress);