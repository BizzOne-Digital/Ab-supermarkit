// Local development entry point. On Vercel, api/index.js is used instead (serverless — no app.listen).
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`AB's Supermarket API server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();
