import mongoose, { Schema } from 'mongoose';

export interface WeatherInterface {
    lat: number;
    lon: number;
    data: any;
    fetchedAt: Date;
}

const weatherSchema = new Schema({
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    data: Schema.Types.Mixed,
    fetchedAt: { type: Date, default: Date.now, }
});

export const Weather = mongoose.model<WeatherInterface>('Weather', weatherSchema);