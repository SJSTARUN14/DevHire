import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { parseResume } from '../utils/resumeParser.js';
import { calculateATSScore } from '../utils/atsScoring.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/Student
const applyJob = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can apply' });
        }

        const { jobId } = req.body;
        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) {
            return res.status(400).json({ message: 'Resume is required' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const alreadyApplied = await Application.findOne({
            job: jobId,
            applicant: req.user._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // ATS Logic
        const resumeText = await parseResume(resumePath);
        const jobKeywords = `${job.description} ${job.requirements.join(' ')}`;

        const atsResult = await calculateATSScore(resumeText, jobKeywords);

        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            resume: resumePath,
            atsScore: atsResult.score,
            matchDetails: {
                matchedSkills: atsResult.matchedKeywords,
                missingSkills: atsResult.missingKeywords,
                similarity: atsResult.score
            }
        });

        res.status(201).json(application);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my applications
// @route   GET /api/applications/my
// @access  Private/Student
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('job', 'title company location status')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a job (Recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user is the one who posted the job or is an admin
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view applicants for this job. You can only view applicants for jobs you posted.' });
        }

        const applications = await Application.find({ job: jobId })
            .populate('applicant', 'name email studentProfile')
            .sort({ atsScore: -1 }); // Sort by highest score

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if user applied for a job
// @route   GET /api/applications/check/:jobId
// @access  Private/Student
const checkApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user._id
        });

        res.json({ applied: !!application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Company
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const application = await Application.findById(id).populate('applicant', 'name email').populate('job', 'title postedBy');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check authorization
        if (application.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update status for this application' });
        }

        application.status = status;
        await application.save();

        // Send Email Notification
        let subject = '';
        let message = '';

        if (status === 'shortlisted') {
            subject = 'Congratulations! Your profile has been shortlisted';
            message = `Hi ${application.applicant.name},\n\nYour profile has been shortlisted for the position of "${application.job.title}". We will get in touch with you shortly for the next steps.\n\nBest regards,\nDevHire Team`;
        } else if (status === 'rejected') {
            subject = 'Application Status Update';
            message = `Hi ${application.applicant.name},\n\nUnfortunately, your profile does not match our current requirements for the position of "${application.job.title}". We appreciate your interest in DevHire and wish you luck in your future endeavors.\n\nBest regards,\nDevHire Team`;
        }

        if (subject && message) {
            try {
                await sendEmail({
                    email: application.applicant.email,
                    subject,
                    message,
                });
            } catch (error) {
                console.error('Email sending failed, but status was updated');
            }
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply for an external job (Company site)
// @route   POST /api/applications/external
// @access  Private/Student
const applyExternalJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const alreadyApplied = await Application.findOne({
            job: jobId,
            applicant: req.user._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already recorded an application for this job' });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            resume: 'External Application', // Placeholder since it's external
            status: 'applied',
            atsScore: 0 // Cannot calculate ATS for external links without file upload
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { applyJob, getMyApplications, getJobApplications, checkApplicationStatus, updateApplicationStatus, applyExternalJob };
