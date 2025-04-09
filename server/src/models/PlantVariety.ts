import { Schema, model, Document, ObjectId } from 'mongoose';

interface IPlantVariety extends Document {
    plant: ObjectId;
    variety: string;
    seedDepth: string;
    seedSpacing: string;
    waterRequirements: string;
    sunlightRequirements: string;
}

const plantVarietySchema = new Schema<IPlantVariety>(
    {
        plant: {
            type: Schema.Types.ObjectId,
            ref: 'Plant'
        },
        variety: {
            type: String,
            required: true,
            trim: true,
        },
        seedDepth: {
            type: String,
            required: true,
        },
        seedSpacing: {
            type: String,
            required: true,
        },
        waterRequirements: {
            type: String,
            required: true,
        },
        sunlightRequirements: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true },
    }
);

const PlantVariety = model<IPlantVariety>('PlantVariety', plantVarietySchema);

export default PlantVariety