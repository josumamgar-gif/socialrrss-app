import mongoose, { Schema, Document } from 'mongoose';
import { PlanType } from '../constants/pricing';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  socialNetwork: string;
  profileData: Record<string, any>;
  images: string[];
  link: string;
  isActive: boolean;
  isPaid: boolean;
  planType: PlanType | null;
  paidUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    socialNetwork: {
      type: String,
      required: true,
    },
    profileData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    images: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    planType: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime', null],
      default: null,
    },
    paidUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ isActive: 1 });
ProfileSchema.index({ isPaid: 1 });

export default mongoose.model<IProfile>('Profile', ProfileSchema);


