module.exports = mongoose => {
    const courseSchema = mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student"
            }
        ]
    }, {
        timestamps: true
    });

    courseSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Course = mongoose.model("Course", courseSchema);
    return Course;
};
