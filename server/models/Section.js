const moongoose=require("mongoose");


const sectionSchmea=new moongoose.Schema({
    sectionName:{
        type:String,
    },
    subSection:{
        type:moongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SubSection"
    }
   
});

module.exports=moongoose.model("Section",sectionSchmea)
