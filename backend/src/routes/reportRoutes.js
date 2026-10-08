const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getUserDashboardStats,
  exportComplaintsCSV,
  getOfficerDashboardStats,
} = require('../controllers/reportController');
const { protect, admin, officer } = require('../middleware/authMiddleware');

router.get('/admin-dashboard', protect, admin, getAdminDashboardStats);
router.get('/user-dashboard', protect, getUserDashboardStats);
router.get('/export-csv', protect, admin, exportComplaintsCSV);

router.get('/officer-dashboard', protect, officer, getOfficerDashboardStats);

module.exports = router;
