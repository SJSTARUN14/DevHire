import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';




const getCompanyStats = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const companyId = req.user.companyId;

        let jobQuery = {};
        if (isAdmin) {
            
        } else if (companyId) {
            jobQuery = { company: companyId };
        } else {
            jobQuery = { postedBy: req.user._id };
        }

        const jobs = await Job.find(jobQuery);
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.status === 'active').length;

        
        const jobIds = jobs.map(job => job._id);
        const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });

        
        const applications = await Application.find({ job: { $in: jobIds } }).select('atsScore');
        const avgATS = applications.length > 0
            ? Math.round(applications.reduce((acc, curr) => acc + curr.atsScore, 0) / applications.length)
            : 0;

        
        let totalRecruiters = 0;
        if (isAdmin) {
            totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        } else if (companyId) {
            totalRecruiters = await User.countDocuments({ companyId: companyId, role: 'recruiter' });
        } else {
            totalRecruiters = 1; 
        }

        res.json({
            totalRecruiters,
            totalJobs,
            activeJobs,
            totalApplicants,
            avgATS
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const addRecruiter = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const companyId = req.user.companyId;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'recruiter',
            companyId
        });

        
        await Company.findByIdAndUpdate(companyId, { $push: { recruiters: user._id } });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const getRecruiters = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const recruiters = await User.find({ companyId: companyId, role: 'recruiter' }).select('-password');
        res.json(recruiters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getCompanyStats, addRecruiter, getRecruiters };
