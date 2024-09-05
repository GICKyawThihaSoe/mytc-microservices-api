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
            type: String,
            required: true
        },
        lessons: [
            {
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
                note: {
                    type: String,
                    required: true,
                    trim: true
                },
                video:{
                    type: String,
                    required: true,
                    trim: true
                }
            }
        ],
        enrolledStudents: [
            {
                student_id: {
                    type: Number,
                    trim: true
                }
            }
        ],
        status: {
            type: String,
            trim: true
        }
    }, {
        timestamps: true
    });

    courseSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Course = mongoose.model("Course", courseSchema);
    return Course;
};

