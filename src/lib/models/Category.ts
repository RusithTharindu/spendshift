import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  categoryId: string;
  userId: string;
  name: string;
  glyph: string;
  tone: string;
  isDefault: boolean;
}

const CategorySchema = new Schema<ICategory>({
  categoryId: { type: String, required: true },
  userId:     { type: String, required: true, index: true },
  name:       { type: String, required: true },
  glyph:      { type: String, default: '◇' },
  tone:       { type: String, default: '#807C73' },
  isDefault:  { type: Boolean, default: false },
});

CategorySchema.index({ userId: 1, categoryId: 1 }, { unique: true });

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
