import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Get company dashboard stats
// @route   GET /api/companies/stats
// @access  Private/Company
const getCompanyStats = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const companyId = req.user.companyId;

        let jobQuery = {};
        if (isAdmin) {
            // Admin sees all
        } else if (companyId) {
            jobQuery = { company: companyId };
        } else {
            jobQuery = { postedBy: req.user._id };
        }

        const jobs = await Job.find(jobQuery);
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.status === 'active').length;

        // Get total applicants for these jobs
        const jobIds = jobs.map(job => job._id);
        const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });

        // Calculate Average ATS Score
        const applications = await Application.find({ job: { $in: jobIds } }).select('atsScore');
        const avgATS = applications.length > 0
            ? Math.round(applications.reduce((acc, curr) => acc + curr.atsScore, 0) / applications.length)
            : 0;

        // Recruiter count: If admin, show total recruiters. If company, show company's recruiters.
        let totalRecruiters = 0;
        if (isAdmin) {
            totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        } else if (companyId) {
            totalRecruiters = await User.countDocuments({ companyId: companyId, role: 'recruiter' });
        } else {
            totalRecruiters = 1; // Direct recruiter
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

// @desc    Add a new recruiter
// @route   POST /api/companies/recruiters
// @access  Private/Company
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

        // Add to company recruiters list
        await Company.findByIdAndUpdate(companyId, { $push: { recruiters: user._id } });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all recruiters for company
// @route   GET /api/companies/recruiters
// @access  Private/Company
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
