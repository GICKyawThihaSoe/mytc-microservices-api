require('dotenv').config();
const db = require("../models");
const Student = db.students;
const jwt = require('jsonwebtoken'); // Optional: for JWT authentication
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

// Create and Save a new Student
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.password || !req.body.confirm_password) {
        const missingFields = [];

        if (!req.body.name) {
            missingFields.push('Name');
        }
        if (!req.body.password) {
            missingFields.push('Password');
        }
        if (!req.body.confirm_password) {
            missingFields.push('Confirm Password');
        }
        return res.status(400).send({ message: `${missingFields.join(', ')} cannot be empty!` });
    }

    if (req.body.password !== req.body.confirm_password) {
        return res.status(400).send({ message: "Passwords do not match!" });
    }
    try {
        const existingStudent = await Student.findOne({ email: req.body.email });
        if (existingStudent) {
            return res.status(400).send({ message: "Email is already exists!" });
        }
        const password = String(req.body.password);  // Ensure password is a string
        const saltRounds = 10; // Ensure salt rounds is a number
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a Student
        const student = new Student({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age,
            money: 500000,
            type: "student",
        });

        // Save Student in the database
        const data = await student.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the student."
        });
    }
};

exports.login = async (req, res) => {
    const { email } = req.body;
    const password = String(req.body.password);  // Ensure password is a string

    if (!email || !password) {
        return res.status(400).send({ message: "Email and Password cannot be empty!" });
    }

    try {
        const student = await Student.findOne({ email: email });

        if (!student) {
            return res.status(404).send({ message: "Student not found!" });
        }
        const isPasswordValid = await bcrypt.compare(password, student.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password!" });
        }

        const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: '1h' });

        res.send({ student: student, token: token });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while logging in the student." });
    }
};

// Retrieve all Students from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    const condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

    Student.find(condition)
        .populate('enrolled_in', 'title price') // Populate enrolled courses with specific fields
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving students."
            });
        });
};

// Find a single Student with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Student.findById(id)
        .populate('enrolled_in', 'title price') // Populate enrolled courses with specific fields
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Student with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving Student with id=" + id });
        });
};

// Update a Student by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Student.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Student with id=${id}. Maybe Student was not found!`
                });
            } else res.send({ message: "Student was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Student with id=" + id
            });
        });
};

// Delete a Student with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Student.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Student with id=${id}. Maybe Student was not found!`
                });
            } else {
                res.send({
                    message: "Student was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Student with id=" + id
            });
        });
};

// Delete all Students from the database.
exports.deleteAll = (req, res) => {
    Student.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} students were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all students."
            });
        });
};
