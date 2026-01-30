import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Main contact
    logo: { type: String },
    website: { type: String },
    about: { type: String },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // The admin user
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;
