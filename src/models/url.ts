import { model, Schema, Document } from "mongoose";

interface IURL extends Document {
  slug: string;
  url: string;
  expirationTime?: number;
}

const URLSchema = new Schema({
  slug: { type: String, trim: true, unique: true},
  url: { type: String, trim: true, required: true},
  expirationTime: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const URLModel = model<IURL>("URL", URLSchema)

export { IURL }

export default URLModel