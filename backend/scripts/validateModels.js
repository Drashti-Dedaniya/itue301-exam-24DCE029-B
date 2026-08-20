import mongoose from 'mongoose';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import { connectMongoDB, formatMongooseError } from '../database.js';

async function runValidationDemo() {
  if (process.env.MONGO_URI) {
    await connectMongoDB();
    const savedDoctor = await Doctor.create({ name: 'Database Demo Doctor', specialisation: 'General Medicine' });
    console.log('MongoDB operation: saved doctor', savedDoctor.name);
    await Doctor.deleteOne({ _id: savedDoctor._id });
  }

  const validPatient = new Patient({ name: 'Test Patient', email: `test-${Date.now()}@example.com`, bloodGroup: 'O+' });
  console.log('Valid patient:', await validPatient.validate().then(() => 'passed'));

  const invalidPatient = new Patient({ name: 'Invalid Patient', email: 'invalid@example.com', bloodGroup: 'C+' });
  console.log('Invalid blood group:', await invalidPatient.validate().catch((error) => formatMongooseError(error).message));

  const invalidAppointment = new Appointment({
    patientId: new mongoose.Types.ObjectId(), doctorId: new mongoose.Types.ObjectId(), date: '2026-08-24', timeSlot: '10:30 AM', status: 'unknown',
  });
  console.log('Invalid appointment status:', await invalidAppointment.validate().catch((error) => formatMongooseError(error).message));

  const doctor = new Doctor({ name: 'Demo Doctor', specialisation: 'General Medicine' });
  console.log('Doctor default availability:', doctor.available);
  if (mongoose.connection.readyState) await mongoose.disconnect();
}

runValidationDemo().catch((error) => {
  console.error('Validation demo failed:', error.message);
  process.exitCode = 1;
});
