import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  bio?: string;
  age?: number;
  location?: string;
  interests?: string[];
  favoriteSocialNetwork?: string;
  // Promotion fields
  isOnFreePromotion?: boolean;
  freePromotionStartDate?: Date;
  freePromotionEndDate?: Date;
  // Favorites
  favoriteProfiles?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    age: {
      type: Number,
      min: 13,
      max: 120,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    interests: {
      type: [String],
      default: [],
    },
    favoriteSocialNetwork: {
      type: String,
      enum: ['tiktok', 'youtube', 'instagram', 'facebook', 'linkedin', 'twitch', 'x', 'otros', null],
      default: null,
    },
    // Promotion fields
    isOnFreePromotion: {
      type: Boolean,
      default: false,
    },
    freePromotionStartDate: {
      type: Date,
      default: null,
    },
    freePromotionEndDate: {
      type: Date,
      default: null,
    },
    // Favorites - Array de IDs de perfiles favoritos
    favoriteProfiles: {
      type: [Schema.Types.ObjectId],
      ref: 'Profile',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password antes de guardar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordString = String(this.password);
    this.password = await bcrypt.hash(passwordString, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Método para comparar passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Los índices se crean automáticamente con unique: true en los campos username y email

export default mongoose.model<IUser>('User', UserSchema);

