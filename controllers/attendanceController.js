import Attendance from '../models/Attendance.js';

// Helper function to get start and end of the day
const getStartAndEndOfDay = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

// Constants for office timings
const OFFICE_START_TIME = 9; // 9 AM
const OFFICE_END_TIME = 17; // 5 PM

// Handle check-in
export const checkIn = async (req, res) => {
    const { employeeId } = req.body;
    try {
        const { start, end } = getStartAndEndOfDay();

        // Check if the employee has already checked in today
        const existingCheckIn = await Attendance.findOne({
            employeeId,
            checkIn: { $gte: start, $lte: end }
        });

        if (existingCheckIn) {
            return res.status(400).send({ message: 'You have already checked in today.' });
        }

        const currentTime = new Date();

        // Determine if late arrival (after 9:00 AM)
        const lateArrival = currentTime.getHours() >= OFFICE_START_TIME && currentTime.getMinutes() > 0;

        // Record a new check-in
        const newCheckIn = new Attendance({
            employeeId,
            checkIn: currentTime,
            isCheckedIn: true,
            isCheckedOut: false,
            lateArrival
        });

        await newCheckIn.save();
        res.status(201).send({ message: 'Check-in recorded successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error recording check-in', error });
    }
};

// Handle check-out
export const checkOut = async (req, res) => {
    const { employeeId } = req.body;
    try {
        const { start, end } = getStartAndEndOfDay();

        // Find today's check-in record for the employee
        const attendance = await Attendance.findOne({
            employeeId,
            checkIn: { $gte: start, $lte: end }
        });

        if (!attendance) {
            return res.status(404).send({ message: 'No check-in record found for today!' });
        }

        // Check if check-out is already recorded
        if (attendance.isCheckedOut) {
            return res.status(400).send({ message: 'You have already checked out today.' });
        }

        const currentTime = new Date();

        // Determine if early dispatch (before 5:00 PM)
        const earlyDispatch = currentTime.getHours() < OFFICE_END_TIME;

        // Record the check-out time
        attendance.checkOut = currentTime;
        attendance.isCheckedOut = true;
        attendance.earlyDispatch = earlyDispatch;

        await attendance.save();
        res.status(200).send({ message: 'Check-out recorded successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error recording check-out', error });
    }
};

// Get today's check-ins for all employees
export const getTodayCheckIns = async (req, res) => {
    try {
        const { start, end } = getStartAndEndOfDay();

        const todayCheckIns = await Attendance.find({
            checkIn: { $gte: start, $lte: end }
        });

        res.status(200).send(todayCheckIns);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching today\'s check-ins', error });
    }
};

// Get all check-in records for all employees
export const getAllCheckIns = async (req, res) => {
    try {
        const allCheckIns = await Attendance.find();

        res.status(200).send(allCheckIns);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all check-in records', error });
    }
};

// Get check-in records for a specific user
export const getCheckInByUser = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const { start, end } = getStartAndEndOfDay();

        const userCheckIn = await Attendance.findOne({
            employeeId,
            checkIn: { $gte: start, $lte: end }
        });

        if (!userCheckIn) {
            return res.status(404).send({ message: 'No check-in record found for this user today. Please Check In ' });
        }

        res.status(200).send(userCheckIn);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching user check-in record', error });
    }
};


export const getAllCheckInsByWeek = async (req, res) => {
    try {
        const allCheckIns = await Attendance.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$checkIn" }, // Group by year
                        week: { $week: "$checkIn" } // Group by week number
                    },
                    records: { $push: "$$ROOT" } // Push all records into an array
                }
            },
            {
                $sort: { "_id.year": 1, "_id.week": 1 } // Sort by year and week number
            }
        ]);

        res.status(200).send(allCheckIns);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching check-ins by week', error });
    }
};