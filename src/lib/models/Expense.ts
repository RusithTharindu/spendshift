import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExpense extends Document {
  expenseId: string;
  userId: string;
  merchant: string;
  amount: number;
  currency: string;
  amountOriginal?: number;
  rate?: number;
  categoryId: string;
  date: Date;
  note: string;
  recurring: boolean;
}

const ExpenseSchema = new Schema<IExpense>({
  expenseId:      { type: String, required: true },
  userId:         { type: String, required: true, index: true },
  merchant:       { type: String, required: true },
  amount:         { type: Number, required: true },
  currency:       { type: String, required: true },
  amountOriginal: { type: Number },
  rate:           { type: Number },
  categoryId:     { type: String, required: true },
  date:           { type: Date, required: true },
  note:           { type: String, default: '' },
  recurring:      { type: Boolean, default: false },
});

ExpenseSchema.index({ userId: 1, expenseId: 1 }, { unique: true });
ExpenseSchema.index({ userId: 1, date: -1 });

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
export default Expense;
