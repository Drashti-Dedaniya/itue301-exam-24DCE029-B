export default function requestLogger(request, response, next) {
  console.log(`[${request.method}] ${request.path} [${new Date().toISOString()}]`);
  next();
}
