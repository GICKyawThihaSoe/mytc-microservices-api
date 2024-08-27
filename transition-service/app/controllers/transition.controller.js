const db = require("../models");
const Transition = db.transitions;

// Create and Save a new Transition
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.studentId || !req.body.teacherId || !req.body.courseId || !req.body.amount) {
        const missingFields = [];

        if (!req.body.studentId) {
            missingFields.push('studentId');
        }
        if (!req.body.teacherId) {
            missingFields.push('teacherId');
        }
        if (!req.body.courseId) {
            missingFields.push('courseId');
        }
        if (!req.body.amount) {
            missingFields.push('amount');
        }
        return res.status(400).send({ message: `${missingFields.join(', ')} cannot be empty!` });
    }

    try {
        // Create a Transition
        const transition = new Transition({
            studentId: req.body.studentId,
            teacherId: req.body.teacherId,
            courseId: req.body.courseId,
            amount: req.body.amount,
        });
        // Save Transition in the database
        const data = await transition.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the transition."
        });
    }
};

// Retrieve all Courses from the database.
exports.findAll = async (req, res) => {
    try {
        const transition = await Transition.find();

        if (transition.length === 0) {
            return res.status(404).send({ message: "Transitions not found!" });
        }

        res.send({ transition: transition });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving transitions." });
    }
};

// Find a single Course with an id
exports.findOne = async (req, res) => {
    const teacherId = req.params.teacherId; // Assuming you pass teacherId as a parameter in the route
    try {
        const transitions = await Transition.find({ teacherId: teacherId });

        if (transitions.length === 0) {
            return res.status(404).send({ message: "No transitions found for this teacher!" });
        }

        res.send({ transitions: transitions });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving transitions for teacherId=" + teacherId });
    }
};

