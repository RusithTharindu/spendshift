import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBudget extends Document {
  budgetId: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'month';
}

const BudgetSchema = new Schema<IBudget>({
  budgetId:   { type: String, required: true },
  userId:     { type: String, required: true, index: true },
  categoryId: { type: String, required: true },
  amount:     { type: Number, required: true },
  period:     { type: String, default: 'month' },
});

BudgetSchema.index({ userId: 1, budgetId: 1 }, { unique: true });

const Budget: Model<IBudget> = mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
export default Budget;
