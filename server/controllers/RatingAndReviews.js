const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const { default: mongoose } = require("mongoose");


exports.createRating=async(req,res)=>{
    try{
        //get user id

        const userId=req.user.id;
        //fetchdata from req body
        const{rating,review,courseId}=req.body;
        //check if user is enrolled or not
        const courseDetails=await Course.findOne(
            { _id:courseId,
                studentsenrolled:{$eleMatch:{req:userId}},
            })


        //check if user already review the course
        const alredyReviewed=await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });

        if(!alredyReviewed){
            return res.json(403).json({
                success:false,
                message:'Course is already reviewed by user'
            });
        }

        //create rating an dreview
        const ratingReview=await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId,
        });

        //update course with this rating/review
        await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    RatingAndReview:ratingReview._id,
                }
            },
            {new:true});

            //return response
            return res.status(200).json({
                success:true,
                message:"Rating and Review created Successfully",
                ratingReview,
            })

       
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}


//get average rating
exports.getAverageRating=async(req,res)=>{

    try{
        //get course id
        const courseId=req.body.courseId;

        //calculate avg rating

        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId)
                },

                
                $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
               
                }

            

        ])

        //return rating
        if(result.length > 0) {

            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })

        }

        //return rating
        if(result.length > 0) {

            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })

        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }



}


exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}