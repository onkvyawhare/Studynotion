const SubSection=require("../models/Subsection");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageuploader");
const Course=require("../models/Course");

//create subsection

exports.createSubSection=async(req,res) =>{
    try{ 
        //fetch data from req body
        const{sectionId,title,timeDuration,description}=req.body;
        //extract file/video
        const video=req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || !description ){
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            })
        }
        //upload video to cloudinary
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create a sub section

        const SubSectionDetails=await  SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,

        })
        //update details with this subsection objectid

        const updatedSection=await Section.findbyIdAndUpdate(
        {_id:sectionId},
        {$push:{
            SubSection:SubSectionDetails._id,

        }},
        {new:true}
    ).populate("subSection");

    //log updated section here,after adding populate query
        //return response
        return res.status(200).json({
            success:true,
            message:'Sub section created succesfully'
        });
        


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:false,
            error:error.message,
        })

    }
}


//deleteaccount

exports.deleteAccount=async (req,res) =>{
    try{

        //getid
        const id=req.user.id;
        //validation
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'user not found'
            })
        }

        //delete profile
        await Profile.findbyIdAndDelete(
            {_id:userDetails.additionalDetails}
        );
    
        //todo:hw enroll user from an enrolled course
        for (const courseId of user.courses) {
            await Course.findByIdAndUpdate(
              courseId,
              { $pull: { studentsEnroled: id } },
              { new: true }
            )
          }
        //delete user
        await User.findbyIdAndDelete({_id:id});
        
        //return response
        return res.status(200).json({
            success:true,
            message:'user deleted succesfully',
        })
        



    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'user cannot be deleted succesfully',
        })

    }
}


exports.getAllUserDetails=async(req,res)=>{
    try{
        //get id
        const id=req.user.id;

        const userDetails=await findbyId(id).populate("additionalDetails").exec();
        //return response
       return res.status(200).json({
            success:true,
            message:'user data fetched succesfully',
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            error:message.error,
        })
    }
}