const{instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailsender=require("../utils/mailSender");
const{courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const mailSender = require("../utils/mailSender");

//capture the payment and initiate the razorpay order

exports.capturePayment=async(req,res)=>{
    //get courdeud and user id
    const{course_id}=req.body;
    const userId=req.user.id;
    //validation
    //valid courseid
    if(!course_id){
        return res.json({
            success:false,
            message:'please provide valid course id'
        })
    }

    //valid courseDetails
    let course;
    try{
        course=await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:'could not find the course',
            })
        }

        //user already uy the same course

        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:'students is already enrolled in course',
            })

        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'could not find the course',
        })

    }

    //order create

const amount=Course.price;
const curruncy="INR";

const options={
    amount:amount*100,
    curruncy,
    recipt:Math.random(Date.now()).toString(),
    notes:{
        courseId:course_id,
        userId,
    }

}

//return response
      try{
        const paymentResponse=await instance.orders.create(options);
        console.log(paymentResponse);

       
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            curruncy:paymentResponse.curruncy,
            amount:paymentResponse.amount,


           
        });
      }
      catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'could not find the course',
        })

      }
}


//verify signature

exports.verifySignature=async(req,res)=>{
    const webhookSecret='12345678';

    const signature=req.headers["x-razorpay-signature"];

    crypto.createHmac("sha256",webhookSecret);
     shasum.update(JSON.stringify(req.bdy))
    const digest=shasum.digest("hex");

    if(signature === digest){
        console.log("payment is authorised");

        const{courseId,userId}=req.body.payload.payment.entitiy.notes;

    try{
        //fulfill the action


        //find the course and enroll student init
        const enrolledCourse=await Course.findOneAndUpdate(
            {_id:courseId},
            {$push:{studentsEnrolled:userId}},
            {new:true},

    );
    if(!enrolledCourse){
        return res.status(500).json({
            success:false,
            message:'could not found',
        })

    }

    console.log(enrolledCourse);

    //find the student and add the course to their enrolled list

    const enrolledStudent=await User.findOneAndUpdate(
        {_id:userId},
        {$push:{courses:courseId}},
        {new:true},

    )
    console.log(enrolledStudent);

    //emailsend confirmation

    const emailResponse=await mailSender(enrolledStudent.email,
        "congratulations from onk",
        "congratulations you are enrolled in the course",
    )

    console.log(emailResponse);
    return res.status(200).json({
        success:true,
        message:"Signature verified and course added",
    })


    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
    }

    

}


exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
      const enrolledStudent = await User.findById(userId)
  
      await mailsender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }
  
  // enroll the student in the courses
  const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnroled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }


