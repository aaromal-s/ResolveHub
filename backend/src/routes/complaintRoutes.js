const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  getComplaintById,
  getDepartmentComplaints,
  assignComplaint,
  claimComplaint,
  updateComplaintStatus,
} = require('../controllers/complaintController');
const { protect, admin, officer } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// User & Admin shared/protected routes
router.post('/', protect, upload.array('attachments', 5), createComplaint);
router.get('/', protect, getUserComplaints);
router.get('/all', protect, admin, getAllComplaints);
router.get('/department', protect, officer, getDepartmentComplaints);
router.get('/:id', protect, getComplaintById);

// Admin / Authority specific routes
router.put('/:id/assign', protect, admin, assignComplaint);
router.put('/:id/claim', protect, claimComplaint);
router.put('/:id/status', protect, updateComplaintStatus);

module.exports = router;
