import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import requestLogger from './middleware/requestLogger.js';
import errorHandler from './middleware/errorHandler.js';
import { connectMongoDB } from './database.js';
import Patient from './models/Patient.js';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';

const app = express();
const port = process.env.PORT || 5000;

const doctors = [
  { id: 'doctor-1', name: 'Dr. Maya Patel', email: 'maya.patel@medcareplus.com', specialisation: 'Cardiology', available: true },
  { id: 'doctor-2', name: 'Dr. Daniel Wong', email: 'daniel.wong@medcareplus.com', specialisation: 'Dermatology', available: true },
  { id: 'doctor-3', name: 'Dr. Sofia Martins', email: 'sofia.martins@medcareplus.com', specialisation: 'Paediatrics', available: false },
];
const appointments = [];
const patients = [];
let mongoConnected = false;

app.use(cors());
app.use(requestLogger);
app.use(express.json());

app.get('/api/v1/patients', async (request, response, next) => {
  try {
    const data = mongoConnected ? await Patient.find() : patients;
    response.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/patients', async (request, response, next) => {
  try {
    const { name, email, phone, bloodGroup, age } = request.body;
    if (!name || !email) {
      const error = new Error('Patient name and email are required.');
      error.statusCode = 400;
      throw error;
    }
    const patient = mongoConnected
      ? await Patient.findOneAndUpdate({ email }, { name, email, phone, bloodGroup, age }, { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true })
      : { id: `patient-${patients.length + 1}`, name, email, phone, bloodGroup, age };
    if (!mongoConnected) patients.push(patient);
    response.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/appointments', async (request, response, next) => {
  try {
    const data = mongoConnected ? await Appointment.find().populate('patientId doctorId') : appointments;
    response.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/appointments', async (request, response, next) => {
  try {
    const { patientId, doctorId, date, timeSlot, status = 'pending', reason } = request.body;
    if (!patientId || !doctorId || !date || !timeSlot) {
      const error = new Error('patientId, doctorId, date and timeSlot are required.');
      error.statusCode = 400;
      throw error;
    }
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      const error = new Error('status must be pending, confirmed or cancelled.');
      error.statusCode = 400;
      throw error;
    }
    if (reason && reason.length > 300) {
      const error = new Error('reason cannot exceed 300 characters.');
      error.statusCode = 400;
      throw error;
    }
    let appointment;
    if (mongoConnected) {
      if (!mongoose.isValidObjectId(patientId) || !mongoose.isValidObjectId(doctorId)) {
        const error = new Error('patientId and doctorId must be valid MongoDB IDs.');
        error.statusCode = 400;
        throw error;
      }
      appointment = await Appointment.create({ patientId, doctorId, date, timeSlot, status, reason });
    } else {
      appointment = { id: `appointment-${appointments.length + 1}`, patientId, doctorId, date, timeSlot, status, reason: reason || '' };
      appointments.push(appointment);
    }
    response.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/doctors', async (request, response, next) => {
  try {
    const data = mongoConnected ? await Doctor.find() : doctors;
    response.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

if (process.env.MONGO_URI) {
  connectMongoDB()
    .then(async () => {
      mongoConnected = true;
      await Doctor.bulkWrite(doctors.map((doctor) => ({
        updateOne: { filter: { email: doctor.email }, update: { $set: doctor }, upsert: true },
      })));
      const patient = await Patient.findOneAndUpdate(
        { email: 'aarav.sharma@example.com' },
            { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '555-0101', bloodGroup: 'O+', age: 30 },
            { returnDocument: 'after', upsert: true, runValidators: true },
      );
      const doctor = await Doctor.findOne({ email: 'maya.patel@medcareplus.com' });
      if (await Appointment.countDocuments() === 0) {
        await Appointment.create({ patientId: patient._id, doctorId: doctor._id, date: '2026-08-24', timeSlot: '10:30 AM', status: 'confirmed', reason: 'Routine consultation' });
      }
          console.log('MongoDB connected and seed data ready');
    })
    .catch((error) => console.error('MongoDB connection failed:', error.message));
}

app.listen(port, () => console.log(`MedCare Plus API running on port ${port}`));

export default app;
