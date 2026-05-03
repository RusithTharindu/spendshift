import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  baseCurrency: string;
  accentId: string;
  theme: 'light' | 'dark' | 'system';
  onboarded: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  userId:       { type: String, required: true, unique: true, index: true },
  email:        { type: String, required: true, unique: true, sparse: true, index: true },
  passwordHash: { type: String, required: true },
  name:         { type: String, default: 'You' },
  baseCurrency: { type: String, default: 'USD' },
  accentId:     { type: String, default: 'sage' },
  theme:        { type: String, default: 'light', enum: ['light', 'dark', 'system'] },
  onboarded:    { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
