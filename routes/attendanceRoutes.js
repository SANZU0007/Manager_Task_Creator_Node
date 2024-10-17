import express from 'express';
import {
    checkIn,
    checkOut,
    getTodayCheckIns,
    getAllCheckIns,
    getCheckInByUser,
    getAllCheckInsByWeek
} from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/today-checkins', getTodayCheckIns);
router.get('/all-checkins', getAllCheckIns);
router.get('/checkin/:employeeId', getCheckInByUser); // New route
router.get('/weekly', getAllCheckInsByWeek);



export default router;
