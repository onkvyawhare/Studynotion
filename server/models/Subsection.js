// models/Subsection.js
const mongoose = require('mongoose');

const SubSectionSchema = new mongoose.Schema({
	title: { type: String },
 timeDuration: { type: String },
	description: { type: String },
	videoUrl: { type: String },
  // other fields
});

// Check if the model already exists in mongoose.models
const SubSection = mongoose.models.SubSection || mongoose.model('SubSection', SubSectionSchema);

module.exports = SubSection;
