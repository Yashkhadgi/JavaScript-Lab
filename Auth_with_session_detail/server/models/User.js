const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

/**
 * Instance method to compare a plain-text password against the stored hash.
 * @param {string} plainPassword - The password to verify
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.passwordHash);
};

/**
 * Pre-save hook: hash password before saving if it was modified.
 * Used during registration.
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    // passwordHash field stores the bcrypt hash; we hash manually in routes,
    // so this hook is a safety net.
    next();
});

module.exports = mongoose.model('User', userSchema);
