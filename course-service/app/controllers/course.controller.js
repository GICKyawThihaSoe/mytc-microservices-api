const db = require("../models");
const Course = db.courses;
const Teacher = db.teachers;

// Create and Save a new Course
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title || !req.body.description || !req.body.price) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Check if the user is a teacher
    const teacher = await Teacher.findById(req.body.teacherId);
    if (!teacher) {
        return res.status(404).send({ message: "Teacher not found" });
    }

    // Create a Course
    const course = new Course({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        teacherId: req.body.teacherId,
        lessons: req.body.lessons,
    });

    // Save Course in the database
    course
        .save(course)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the course."
            });
        });
};

// Retrieve all Courses from the database.
exports.findAll = (req, res) => {
    Course.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving courses."
            });
        });
};

// Find a single Course with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Course.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Course with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Course with id=" + id });
        });
};

// Enroll a student in a course
exports.enroll = async (req, res) => {
    const { courseId, studentId } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: "Course not found" });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }

        course.enrolledStudents.push(studentId);
        await course.save();

        res.send({ message: "Student enrolled successfully" });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while enrolling the student."
        });
    }
};
