const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus, createOfficer } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getUsers);
router.put('/:id/status', protect, admin, updateUserStatus);

router.post('/officer', protect, admin, createOfficer);

module.exports = router;
