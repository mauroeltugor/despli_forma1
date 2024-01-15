const bcrypt = require("bcrypt");
const Mongoose = require("mongoose");
const { generateAccessToken, generateRefreshToken } = require("../services/generateTokens");
const getUserInfo = require("../models/getUserInfo");
const Token = require("../models/token");

const UserSchema = new Mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    roles: [{ type: String, enum: ['administrador', 'cliente'], default: ['cliente'] }],

    confirmed: { type: Boolean, default: false },
});

UserSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        try {
            const hash = await bcrypt.hash(this.password, 10);
            this.password = hash;
            next();
        } catch (error) {
            return next(error);
        }
    } else {
        next();
    }
});

UserSchema.methods.usernameExist = async function (username) {
    const result = await this.constructor.find({ username });
    return result.length > 0;
};

UserSchema.methods.comparePassword = async function (password) {
    const same = await bcrypt.compare(password, this.password);
    return same;
};

UserSchema.methods.createAccessToken = function () {
    return generateAccessToken(getUserInfo(this));
};

UserSchema.methods.createRefreshToken = async function () {
    const refreshToken = generateRefreshToken(getUserInfo(this));
    try {
        await new Token({ token: refreshToken }).save();
        return refreshToken;
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to be caught by the caller
    }
};

module.exports = Mongoose.model("User", UserSchema);
