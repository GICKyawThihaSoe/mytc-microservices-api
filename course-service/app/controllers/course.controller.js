const db = require("../models");
const Course = db.courses;
const axios = require('axios');

async function getStudent(studentId) {
    try {
        // Make a request to the API Gateway
        const response = await axios.get(`http://localhost:8000/users/students/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student details:", error.message);
        throw error;
    }
}

async function getTeacher(teacherId) {
    try {
        // Make a request to the API Gateway
        const response = await axios.get(`http://localhost:8000/users/teachers/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching teacher details:", error.message);
        throw error;
    }
}

// Create and Save a new Course
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.teacherId || !req.body.lessons) {
        const missingFields = [];

        if (!req.body.title) {
            missingFields.push('Title');
        }
        if (!req.body.description) {
            missingFields.push('Description');
        }
        if (!req.body.price) {
            missingFields.push('Price');
        }
        if (!req.body.teacherId) {
            missingFields.push('TeacherId');
        }
        if (!req.body.lessons) {
            missingFields.push('Lessons');
        }
        return res.status(400).send({ message: `${missingFields.join(', ')} cannot be empty!` });
    }

    try {
        // Create a Course
        const course = new Course({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            teacherId: req.body.teacherId,
            lessons: req.body.lessons,
            enrolledStudents: req.body.enrolledStudents || []
        });
        // Save Course in the database
        const data = await course.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the student."
        });
    }
};

// Retrieve all Courses from the database.
exports.findAll = async (req, res) => {
    try {
        const course = await Course.find();

        if (course.length === 0) {
            return res.status(404).send({ message: "Courses not found!" });
        }

        res.send({ courses: course });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving courses." });
    }
};

// Find a single Course with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).send({ message: "Course not found!" });
        }

        res.send({ courses: course });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving Course with id=" + id });
    }
};

// Enroll a student in a course
exports.enroll = async (req, res) => {
    const { courseId, studentId } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: "Course not found" });
        }
        const studentData = await getStudent(studentId);
        const teacherData = await getTeacher(course.teacherId)
        // Check if the student is already enrolled
        const isEnrolled = course.enrolledStudents.some(student => student.student_id == studentId);
        if (isEnrolled) {
            return res.status(400).send({ message: "Student is already enrolled in this course." });
        }
        if (studentData.student.money < course.price) {
            return res.status(400).send({ message: 'Insufficient funds' });
        } else {
            studentData.student.money -= course.price;
            teacherData.teacher.money += course.price;
            await axios.put(`http://localhost:8000/users/students/${studentId}`, { money: studentData.student.money });
            await axios.put(`http://localhost:8000/users/teachers/${course.teacherId}`, { money: teacherData.teacher.money });
            // Add the student to the enrolledStudents array
            course.enrolledStudents.push({ student_id: studentId });
            await course.save();
        }

        res.send({ message: "Student enrolled successfully" });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while enrolling the student."
        });
    }
};

