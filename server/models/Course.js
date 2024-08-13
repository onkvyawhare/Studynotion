const moongoose=require("mongoose");

const courseSchmea=new moongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
       
        type:String,
    },

    instructor:{
        type:moongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        


    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:{
        type:moongoose.Schema.Types.ObjectId,
        ref:"Section",
    },
    ratingAndReviews:[{
        type:moongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
}],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:moongoose.Schema.Types.ObjectId,
        ref:"Tag"
    },
    studentsEnrolled:[{
        type:moongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }]

    
    
   
});

module.exports=moongoose.model("Course",courseSchmea)
