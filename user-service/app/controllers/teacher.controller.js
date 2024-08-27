require('dotenv').config();
const db = require("../models");
const Teacher = db.teachers;
const jwt = require('jsonwebtoken'); // Optional: for JWT authentication
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

// Create and Save a new Teacher
exports.create = async (req, res) => {
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
        const existingTeacher = await Teacher.findOne({ email: req.body.email });
        if (existingTeacher) {
            return res.status(400).send({ message: "Email is already exists!" });
        }
        const password = String(req.body.password);  // Ensure password is a string
        const saltRounds = 10; // Ensure salt rounds is a number
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a Teacher
        const teacher = new Teacher({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age,
            money: 500000,
            type: "teacher",
        });

        // Save Student in the database
        const data = await teacher.save();
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
        const teacher = await Teacher.findOne({ email: email });

        if (!teacher) {
            return res.status(404).send({ message: "Teacher not found!" });
        }
        const isPasswordValid = await bcrypt.compare(password, teacher.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password!" });
        }

        const token = jwt.sign({ id: teacher._id }, JWT_SECRET, { expiresIn: '1h' });

        res.send({ teacher: teacher, token: token });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while logging in the teacher." });
    }
};

// Retrieve all Teachers from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    const condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

    Teacher.find(condition)
        .populate('course', 'title price') // Populate enrolled courses with specific fields
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving teachers."
            });
        });
};

// Find a single Teacher with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).send({ message: "Teacher not found!" });
        }

        res.send({ teacher: teacher });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving teacher with id=" + id });
    }
};

// Update a Teacher by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }

    const id = req.params.id;

    try {
        const data = await Teacher.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        if (!data) {
            return res.status(404).send({
                message: `Cannot update Teacher with id=${id}. Maybe Teacher was not found!`
            });
        }
        res.send({ message: "Teacher was updated successfully." });
    } catch (err) {
        res.status(500).send({
            message: "Error updating Teacher with id=" + id
        });
    }
};

// Delete a Teacher with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Teacher.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Teacher with id=${id}. Maybe Teacher was not found!`
                });
            } else {
                res.send({
                    message: "Teacher was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Teacher with id=" + id
            });
        });
};

// Delete all Teachers from the database.
exports.deleteAll = (req, res) => {
    Teacher.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} teachers were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all teachers."
            });
        });
};
