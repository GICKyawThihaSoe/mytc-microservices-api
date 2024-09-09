module.exports = mongoose => {
    const adminSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
    });

    adminSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Admin = mongoose.model("Admin", adminSchema);
    return Admin;
};
