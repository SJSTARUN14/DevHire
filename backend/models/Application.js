import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String, required: true }, // Snapshot of resume at time of apply
    status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
    atsScore: { type: Number, default: 0 },
    matchDetails: {
        matchedSkills: [{ type: String }],
        missingSkills: [{ type: String }],
        similarity: { type: Number, default: 0 }
    }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
