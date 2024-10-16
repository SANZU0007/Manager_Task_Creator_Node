import mongoose from 'mongoose';

const goalSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    enum: ['Low', 'High', 'Medium'],
    default: 'Low',
  },
  duration: {
    type: Number, // Duration in minutes
    default: 0,
  },
  completedDuration: {
    type: Number, // Duration in minutes
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  userId: {
    type: String,
    required: [true, 'Please add a UserId'],
  },
  userRole: {
    type: String,
    required: [true, 'Please add a UserRole'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Goal', goalSchema);
