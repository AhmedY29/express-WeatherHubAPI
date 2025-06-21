import mongoose, { Schema } from "mongoose";

export interface HistoryInterface {
  user: mongoose.Types.ObjectId;
  weather: mongoose.Types.ObjectId;
  lat: number;
  lon: number;
  requestedAt: Date;
}

const historySchema = new Schema({
    user:   { type: mongoose.Types.ObjectId, ref: 'User',    index: true },
    weather:{ type: mongoose.Types.ObjectId, ref: 'Weather' },
    lat: Number,
    lon: Number,
    requestedAt: { type: Date, default: Date.now, index: true }
})

export const History = mongoose.model<HistoryInterface>('History', historySchema);