module.exports = mongoose => {
    const lessonSchema = mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        video: {
            type: String,
            required: true,
            trim: true
        },
        course: {
            type: String,
            required: true,
            trim: true
        }
    }, {
        timestamps: true
    });

    lessonSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Lesson = mongoose.model("Lesson", lessonSchema);
    return Lesson;
};

