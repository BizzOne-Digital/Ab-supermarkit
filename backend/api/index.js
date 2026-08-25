// Vercel serverless entry point — no app.listen, DB connection is cached across warm invocations.
import app from '../app.js';
import connectDB from '../config/db.js';

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
