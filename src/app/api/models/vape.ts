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
  colors?: string[];
  withBattery: boolean;
  ohm?: string;
  nicotina?: string;
  ml?: string;
  qtdItems?: string;
  qtdIBuyItems?: number;
  relevance?: number;
  fileNames: string[];
  createdIn?: string;
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
  colors: [String],
  withBattery: { type: Boolean, required: false },
  ohm: { type: String, required: false },
  nicotina: { type: String, required: false },
  ml: { type: String, required: false },
  qtdItems: { type: String, required: false },
  qtdIBuyItems: { type: Number, required: false },
  relevance: { type: Number, required: false },
  createdIn: { type: Date, required: false, default: Date.now },
  fileNames: [String],
});

const vapeModel: Model<VapeDocumentType> = models.Vape || model<VapeDocumentType>('Vape', vapeSchema); // eslint-disable-line

export default vapeModel;
