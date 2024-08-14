import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import mongooseErrors from "mongoose-errors";

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['superadmin', 'admin', 'farmer', 'supplier', 'user'] }
}, {
    timestamps: true
});

const resetTokenSchema = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
    expired: { type: Boolean, default: false },
    expiredAt: {
        type: Date,
        default: () => new Date().setHours(new Date().getHours() + 2)
    }
}, {
    timestamps: true
});

userSchema.plugin(mongooseErrors).plugin(toJSON);
resetTokenSchema.plugin(toJSON);

export const UserModel = model('User', userSchema);
export const ResetModel = model('ResetToken', resetTokenSchema);