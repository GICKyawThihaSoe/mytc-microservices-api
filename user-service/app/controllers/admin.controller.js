require('dotenv').config();
const db = require("../models");
const Admin = db.admins;
const jwt = require('jsonwebtoken'); // Optional: for JWT authentication
const bcrypt = require('bcryptjs');

const ADMIN_JWT_SECRET = process.env.STUDENT_JWT_SECRET;

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
        const existingAdmin = await Admin.findOne({ email: req.body.email });
        if (existingAdmin) {
            return res.status(400).send({ message: "Email is already exists!" });
        }
        const password = String(req.body.password);  // Ensure password is a string
        const saltRounds = 10; // Ensure salt rounds is a number
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a Teacher
        const admin = new Admin({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: hashedPassword,
            type: "sub admin",
        });

        // Save Student in the database
        const data = await admin.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the admin."
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
        const admin = await Admin.findOne({ email: email });

        if (!admin) {
            return res.status(404).send({ message: "admin not found!" });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password!" });
        }

        const token = jwt.sign({ id: admin._id }, ADMIN_JWT_SECRET, { expiresIn: '1h' });

        res.send({ admin: admin, token: token });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while logging in the student." });
    }
};
