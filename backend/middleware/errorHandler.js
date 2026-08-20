import { formatMongooseError } from '../database.js';

export default function errorHandler(error, request, response, next) {
  const databaseError = error.name === 'ValidationError' || error.code === 11000
    ? formatMongooseError(error)
    : null;
  const statusCode = databaseError?.statusCode || error.statusCode || 500;
  response.status(statusCode).json({
    success: false,
    message: databaseError?.message || (statusCode === 500 ? 'An unexpected server error occurred.' : error.message),
  });
}
