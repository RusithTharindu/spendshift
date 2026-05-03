import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spendshift';

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
}

let cached = global._mongooseConn;

export async function connectDB() {
  if (cached) return cached;
  cached = await mongoose.connect(MONGODB_URI);
  global._mongooseConn = cached;
  return cached;
}
