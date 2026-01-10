import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PlanType = 'monthly' | 'yearly' | 'lifetime';
export type PaymentMethod = 'paypal' | 'card' | 'sepa' | 'stripe';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  planType: PlanType;
  paymentMethod: PaymentMethod;
  paypalOrderId?: string;
  stripePaymentId?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'EUR',
    },
    planType: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime'],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'card', 'sepa', 'stripe'],
      required: true,
      default: 'paypal',
    },
    paypalOrderId: {
      type: String,
      default: null,
    },
    stripePaymentId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ profileId: 1 });
// Índices únicos parciales solo para valores no null
PaymentSchema.index(
  { paypalOrderId: 1 },
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { paypalOrderId: { $ne: null } }
  }
);
PaymentSchema.index(
  { stripePaymentId: 1 },
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { stripePaymentId: { $ne: null } }
  }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);

