import Job from '../models/Job.js';
import Company from '../models/Company.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const count = await Job.countDocuments({ ...keyword });
        const jobs = await Job.find({ ...keyword })
            .populate('company', 'name logo location')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ jobs, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('company', 'name logo website about');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recruiter's own jobs
// @route   GET /api/jobs/my
// @access  Private/Recruiter
const getMyJobs = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'admin') {
            // Admin sees all
        } else {
            query = { postedBy: req.user._id };
        }

        const jobs = await Job.find(query)
            .populate('company', 'name logo location')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = async (req, res) => {
    try {
        const { title, description, requirements, salaryRange, location, type, batch, applicationLink, companyName, companyLinkedinUrl } = req.body;

        // Ensure user is a recruiter or admin
        if (req.user.role !== 'recruiter' && req.user.role !== 'admin' && req.user.role !== 'company') {
            return res.status(403).json({ message: 'Not authorized to post jobs' });
        }

        const job = new Job({
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements.split(',').map(s => s.trim()),
            salaryRange,
            location,
            type,
            batch: Array.isArray(batch) ? batch : (batch ? batch.split(',').map(b => b.trim()) : []),
            applicationLink,
            companyName,
            companyLinkedinUrl,
            postedBy: req.user._id,
            company: req.user.companyId
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getJobs, getJobById, createJob, getMyJobs };
