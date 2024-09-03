const db = require("../models");
const Lesson = db.lessons;

// Create and Save a new Course
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title || !req.body.video || !req.body.course) {
        const missingFields = [];

        if (!req.body.title) {
            missingFields.push('Title');
        }
        if (!req.body.video) {
            missingFields.push('Video');
        }
        if (!req.body.course) {
            missingFields.push('Course');
        }
        return res.status(400).send({ message: `${missingFields.join(', ')} cannot be empty!` });
    }

    try {
        // Create a Course
        const lesson = new Lesson({
            title: req.body.title,
            video: req.body.video,
            course: req.body.course
        });
        // Save Course in the database
        const data = await lesson.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the lesson."
        });
    }
};

exports.findWithCourseId = async (req, res) => {
    const courseId = req.params.courseId; 
    try {
        // Fetch all courses with the given teacherId
        const lessons = await Lesson.find({ course: courseId });
        console.log(lessons)
        if (lessons.length === 0) {
            return res.status(404).send({ message: "lessons not found for the given CourseId!" });
        }

        res.send({ lessons: lessons });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving lessons for courseId=" + courseId });
    }
};