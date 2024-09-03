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
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.teacherId) {
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
        return res.status(400).send({ message: `${missingFields.join(', ')} cannot be empty!` });
    }

    try {
        // Create a Course
        const course = new Course({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            teacherId: req.body.teacherId,
            lessons: req.body.lessons || [],
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
        const courses = await Course.find();
        if (courses.length === 0) {
            return res.status(404).send({ message: "Courses not found!" });
        }

        // Iterate through each course and fetch detailed information for enrolled students
        const coursesWithStudentDetails = await Promise.all(
            courses.map(async (course) => {
                const enrolledStudents = Array.isArray(course.enrolledStudents) ? course.enrolledStudents : [];

                const studentDetailsPromises = enrolledStudents.map(async (enrollment) => {
                    const studentData = await getStudent(enrollment.student_id);
                    return {
                        name: studentData.student.name,
                        phoneNumber: studentData.student.phoneNumber,
                        email: studentData.student.email,
                        password: studentData.student.password,
                        age: studentData.student.age,
                        money: studentData.student.money,
                        type: studentData.student.type,
                        id: studentData.student.id,
                    };
                });

                const enrolledStudentsDetails = await Promise.all(studentDetailsPromises);

                return {
                    ...course.toObject(),
                    enrolledStudents_count: enrolledStudents.length,
                    enrolledStudents: enrolledStudentsDetails,
                };
            })
        );

        res.send({ courses: coursesWithStudentDetails });
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

        // Fetch detailed information for each enrolled student
        const enrolledStudents = Array.isArray(course.enrolledStudents) ? course.enrolledStudents : [];
        const studentDetailsPromises = enrolledStudents.map(async (enrollment) => {
            const studentData = await getStudent(enrollment.student_id);
            return studentData.student; // Assuming student details are under `student` key
        });

        const enrolledStudentsDetails = await Promise.all(studentDetailsPromises);

        const courseWithStudentDetails = {
            ...course.toObject(), // Convert Mongoose document to a plain object
            enrolledStudents_count: enrolledStudents.length,
            enrolledStudents: enrolledStudentsDetails,
        };

        res.send({ course: courseWithStudentDetails });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving Course with id=" + id });
    }
};

exports.findWithTeacherId = async (req, res) => {
    const teacherId = req.params.teacherId; 
    try {
        // Fetch all courses with the given teacherId
        const courses = await Course.find({ teacherId: teacherId });

        if (courses.length === 0) {
            return res.status(404).send({ message: "Courses not found for the given teacherId!" });
        }

        // Process each course to get student details and remove __v field
        const coursesWithStudentDetails = await Promise.all(
            courses.map(async (course) => {
                const enrolledStudents = Array.isArray(course.enrolledStudents) ? course.enrolledStudents : [];

                const studentDetailsPromises = enrolledStudents.map(async (enrollment) => {
                    const studentData = await getStudent(enrollment.student_id);
                    return studentData.student; // Assuming student details are under `student` key
                });

                const enrolledStudentsDetails = await Promise.all(studentDetailsPromises);

                // Convert Mongoose document to a plain object and remove __v field
                const courseObject = course.toObject ? course.toObject() : course._doc;
                delete courseObject.__v;

                return {
                    ...courseObject, // Spread operator to include all course properties except __v
                    enrolledStudents_count: enrolledStudents.length,
                    enrolledStudents: enrolledStudentsDetails,
                };
            })
        );

        res.send({ courses: coursesWithStudentDetails });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving courses for teacherId=" + teacherId });
    }
};

// Update a Course by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }

    const id = req.params.id;

    try {
        const data = await Course.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        if (!data) {
            return res.status(404).send({
                message: `Cannot update Course with id=${id}. Maybe Course was not found!`
            });
        }
        res.send({ message: "Course was updated successfully." });
    } catch (err) {
        res.status(500).send({
            message: "Error updating Course with id=" + id
        });
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
            // Add the student to the enrolledStudents array
            course.enrolledStudents.push({ student_id: studentId });
            await course.save();
            studentData.student.money -= course.price;
            teacherData.teacher.money += course.price;
            await axios.put(`http://localhost:8000/users/students/${studentId}`, { money: studentData.student.money });
            await axios.put(`http://localhost:8000/users/teachers/${course.teacherId}`, { money: teacherData.teacher.money });
            await axios.post(`http://localhost:8000/transitions/create`, { studentId: studentId, teacherId: course.teacherId, courseId: courseId, amount: course.price });
        }

        res.send({ message: "Student enrolled successfully" });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while enrolling the student."
        });
    }
};

