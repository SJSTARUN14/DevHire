import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }], 
    salaryRange: {
        min: Number,
        max: Number
    },
    location: { type: String },
    type: { type: String, default: 'Full-time' }, 
    batch: [{ type: String }], 

    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyName: { type: String }, 
    companyLinkedinUrl: { type: String }, 
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    applicationLink: { type: String },
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
