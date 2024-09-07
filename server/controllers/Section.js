const Section=require("../models/Section");
const Course=require("../models/Course");
const SubSection=require("./SubSection");


exports.createSection=async (req,res)=>{
    try{
        //data fetch
        const{sectionName,courseId}=req.body;

        //data valodTAION

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'missing properties',
        })
    }

    //create section

    const newSection=await Section.craeate({sectionName});

    //UPDATE COURSE WITH SECTion object id
    const updatedCourseDetails=await Course.findByIdAndUpdate(
        courseId,
        {
             $push:{
                courseContent:newSection._id,
             }
        },
        {new:true},
        
    )

    //use populate to replcae section/subsection both in updatedcoursedetails
    .populate({
        path: "courseContent",
        populate: {
            path: "subSection",
        },
    })
    .exec();
    //retrurn response
    return res.status(200).json({
        success:true,
        message:'Section created succesfully',
        updatedCourseDetails,
})
    
}
catch(error){
    console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create new section",
            error:error.message,
        })




}
}


exports.updateSection=async(req,res)=>{
    try{

        //data input
        const{sectionName,sectionId}=req.body;

        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'missing properties',
        })
    }

        //updtae data 

        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        //return res
        return res.status(200).json({
            success:true,
            message:'Section updateed succesfully',
            updatedCourseDetails,
    })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create new section",
            error:error.message,
        })





    }
};

exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   