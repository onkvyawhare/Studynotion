const moongoose=require("mongoose");


const ratingAndReviewSchmea=new moongoose.Schema({
    user:{
        type:moongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    rating:{
        type:Number,
        required:true,
    },
   

    
});

module.exports=moongoose.model("RatingAndReview",ratingAndReviewSchmea)
