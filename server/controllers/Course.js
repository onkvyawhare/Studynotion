const Course=require("../models/Course");const RatingAndReview = require("../models/RatingAndReview");
const Tag=require("../models/Category");
const User=require("../models/User");
require("dotenv").config();
const {uploadImageToCloudinary}=require("../utils/imageuploader");


//createcourse handler

exports.createCourse=async(req,res)=>{

    try{

        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;

        //grt thumbnail
        const thumbnail=req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn ||!price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:'All codes are required',

            })
        }

        //check for instructor

        const userId=req.user.id;
        const instructorDetails=await User.findbyId(userId);
        console.log("Instructor Details: ",instructorDetails);

        //todo:verify the userid 


        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:'Instructor details not found',


            });

        }

        //check given tag is valid or not for postman
        const tagDeatils=await Tag.findbyId(tag);
        if(!tagDeatils){
            return res.status(404).json({
                success:false,
                message:'Tag details not found',

            });

        }

        //upload image to cloudinary

        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create an entry in db
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDeatils._id,
            thumbnail:thumbnailImage,
        })

        //add the new course to the user scheema of istructor
        await User.findbyIdAndUpdate(
            {
                _id:instructorDetails._id
            },
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        )

        //getallcourse handler function


    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create new course",
            error:error.message,
        })

    }

};




exports.getAllCourses=async(req,res)=>{
    try{
        //get id
        const{courseId}=req.body;

        const courseDetails=await Course.find(
            {_id:courseId})
            .populate(
                {
                    path:"instructor",
                    populate:{
                        path:"additionalDetails",
                    },
                }
            )
            .populate("category")
                  .populate("ratingAndReviews")
                  .populate({
                    path: "courseContent",
                    populate: {
                      path: "subSection",
                    },
                  })
                  .exec();

                  //validation
                  if (!courseDetails) {
                          return res.status(400).json({
                            success: false,
                            message: `Could not find course with id: ${courseId}`,
                          })
                        }

             //return response
             return res.status(200).json({
                      success: true,
                      message:"Course details fetched succesfully",
                      data: courseDetails,
                    })

    }

    
    catch(error){
        return res.status(500).json({
                  success: false,
                  message: error.message,
                })

    }

    
}









