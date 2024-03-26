import { DescriptionType } from '@/components/addProducts/form';
import { Schema, model, models, type Document, Model } from 'mongoose';

export interface VapeType {
  name: string;
  mark: string;
  basePrice: number;
  finalPrice: number;
  pixPrice: number;
  productDescount?: number;
  pixDescount?: number;
  stock: number;
  status?: string;
  category: string;
  subcategory2?: string;
  subcategory3?: string;
  description?: DescriptionType[];
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
  basePrice: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  pixPrice: { type: Number, required: true, default: 0 },
  productDescount: { type: Number, required: false, default: 0 },
  pixDescount: { type: Number, required: false, default: 0 },
  stock: { type: Number, required: true },
  status: { type: String, required: false },
  category: { type: String, required: true },
  subcategory2: { type: String, required: false },
  subcategory3: { type: String, required: false },
  description: [
    new Schema({
      title: { type: String, require: true },
      tag: { type: String, require: true },
      value: { type: String, require: false },
    }),
  ],
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
