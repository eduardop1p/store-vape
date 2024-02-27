import { Schema, model, models, type Document, Model } from 'mongoose';

export interface VapeType {
  name: string;
  mark: string;
  price: number;
  descount?: number;
  stock: number;
  status?: string;
  category: string;
  flavors?: string[];
  fileNames: string[];
}

export interface VapeDocumentType extends VapeType, Document {}

const vapeSchema = new Schema<VapeDocumentType>({
  name: { type: String, required: true },
  mark: { type: String, required: true },
  price: { type: Number, required: true },
  descount: { type: Number, required: false },
  stock: { type: Number, required: true },
  status: { type: String, required: false },
  category: { type: String, required: true },
  flavors: [String],
  fileNames: [String],
});

const vapeModel: Model<VapeDocumentType> = models.Vape || model<VapeDocumentType>('Vape', vapeSchema); // eslint-disable-line

export default vapeModel;
