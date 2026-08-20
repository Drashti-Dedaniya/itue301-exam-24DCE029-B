import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: [true, 'Appointment date is required'] },
  timeSlot: { type: String, required: [true, 'Appointment time slot is required'] },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  reason: { type: String, maxlength: [300, 'Reason cannot exceed 300 characters'] },
});

export default mongoose.model('Appointment', appointmentSchema);
