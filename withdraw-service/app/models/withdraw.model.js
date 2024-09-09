module.exports = mongoose => {
    const withdrawSchema = mongoose.Schema({
        teacherId: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            trim: true
        },
        status: {
            type: String,
            trim: true
        },
        date: { type: Date, default: Date.now },
    }, {
        timestamps: true
    });

    withdrawSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Withdraw = mongoose.model("Withdraw", withdrawSchema);
    return Withdraw;
};

