module.exports = mongoose => {
    const teacherSchema = mongoose.Schema({
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
        age: {
            type: Number,
            required: true
        },
        money: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
    });

    teacherSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Teacher = mongoose.model("Teacher", teacherSchema);
    return Teacher;
};
