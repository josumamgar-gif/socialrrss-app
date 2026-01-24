import mongoose, { Schema, Document } from 'mongoose';

export type PromotionType = 'free_trial_30_days';
export type PromotionStatus = 'active' | 'expired' | 'converted';

export interface IPromotion extends Document {
  userId: mongoose.Types.ObjectId;
  type: PromotionType;
  status: PromotionStatus;
  startDate: Date;
  endDate: Date;
  convertedAt?: Date;
  convertedToPlan?: string;
  usageCount: number; // Track how many times promotion was used
  maxUsage: number; // Maximum allowed usage (e.g., 100 for free trial)
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One promotion per user
    },
    type: {
      type: String,
      enum: ['free_trial_30_days'],
      required: true,
      default: 'free_trial_30_days',
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'converted'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    convertedAt: {
      type: Date,
      default: null,
    },
    convertedToPlan: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime'],
      default: null,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    maxUsage: {
      type: Number,
      default: 100, // First 100 users get free trial
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one active promotion per user per type
PromotionSchema.index({ userId: 1, type: 1 }, { unique: true });

// Index for finding expired promotions
PromotionSchema.index({ endDate: 1, status: 1 });

export default mongoose.model<IPromotion>('Promotion', PromotionSchema);