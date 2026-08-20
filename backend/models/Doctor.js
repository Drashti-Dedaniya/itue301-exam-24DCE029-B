import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Doctor name is required'] },
  email: String,
  specialisation: { type: String, required: [true, 'Doctor specialisation is required'] },
  available: { type: Boolean, default: true },
});

export default mongoose.model('Doctor', doctorSchema);
