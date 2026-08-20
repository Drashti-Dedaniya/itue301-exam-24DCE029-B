import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Patient name is required'] },
  email: { type: String, required: [true, 'Patient email is required'], unique: true },
  phone: String,
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  age: Number,
});

export default mongoose.model('Patient', patientSchema);
