import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }], // Skills required
    salaryRange: {
        min: Number,
        max: Number
    },
    location: { type: String },
    type: { type: String, default: 'Full-time' }, // Remote, On-site, etc.
    batch: [{ type: String }], // Allowed batches (e.g., 2024, 2025)

    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyName: { type: String }, // Simply the company name as string
    companyLinkedinUrl: { type: String }, // For referral links
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    applicationLink: { type: String },
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
