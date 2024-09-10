// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature,sendPaymentSuccessEmail } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/Auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth,verifySignature)
router.post("/sendPaymentSuccessEmail", auth, sendPaymentSuccessEmail)

module.exports = router;