const mongoose = require("mongoose"),
   { Schema } = mongoose;

const userSchema = new Schema(
    {
        app_id: {
            type: String,
            required: true,
            unique: true,
        },
        organisation_name: {
            type: String,
            unique: true,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        username: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["active", "disabled"],
            default: "active",
        },
        sign_up_date: {
            type: Date,
            default: Date.now(),
        },
        last_login: {
            type: Date,
        },
        department: {
            type: String,

        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);