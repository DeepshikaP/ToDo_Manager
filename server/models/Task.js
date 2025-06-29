import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  status: String,
  priority: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
