module.exports = mongoose => {
    const studentSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        phoneNumber: {
            type: Number,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true,
            trim: true
        },
        money: {
            type: Number,
            required: true,
            trim: true
        },
        type: {
            type: String,
            required: true,
            trim: true
        },
    });

    studentSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Student = mongoose.model("Student", studentSchema);
    return Student;
};
