module.exports = mongoose => {
    const transitionSchema = mongoose.Schema({
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
            required: true,
            trim: true
        },
        date: { type: Date, default: Date.now },
    }, {
        timestamps: true
    });

    transitionSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Transition = mongoose.model("Transition", transitionSchema);
    return Transition;
};

