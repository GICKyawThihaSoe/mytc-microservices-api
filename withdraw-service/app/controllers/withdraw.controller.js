const db = require("../models");
const Withdraw = db.withdraw;
const axios = require('axios');

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

// Create and Save a new Transition
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.teacherId || !req.body.amount) {
        const missingFields = [];

        if (!req.body.teacherId) {
            missingFields.push('teacherId');
        }
        if (!req.body.amount) {
            missingFields.push('amount');
        }
        return res.status(400).send({ message: `${missingFields.join(', ')} cannot be empty!` });
    }
    try {
        const teacherData = await getTeacher(req.body.teacherId);
        const teacher = teacherData.teacher;
        if (teacher?.money < req.body.amount) {
            return res.status(400).send({ message: `Insufficient funds!` });
        }
        // Create a Transition
        const withdraw = new Withdraw({
            teacherId: req.body.teacherId,
            amount: req.body.amount,
            status: req.body.status || 0
        });
        const withdrawdata = await Withdraw.find();
        if (withdrawdata.length !== 0) {
            const validStatuses = withdrawdata.every(withdraw => withdraw.status === '1' || withdraw.status === '2');
            if (!validStatuses) {
                return res.status(400).send({ message: "Please Waiting..." });
            }
        }
        // Save Transition in the database
        const data = await withdraw.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the withdraw."
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const withdraw = await Withdraw.find();

        if (withdraw.length === 0) {
            return res.status(404).send({ message: "Withdraw not found!" });
        }

        res.send({ withdraw: withdraw });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving withdraw." });
    }
};

// Find a single Course with an id
exports.findOne = async (req, res) => {
    const teacherId = req.params.teacherId; // Assuming you pass teacherId as a parameter in the route
    try {
        const withdraw = await Withdraw.find({ teacherId: teacherId });

        if (withdraw.length === 0) {
            return res.status(404).send({ message: "No withdraw found for this teacher!" });
        }

        res.send({ withdraw: withdraw });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving withdraw for teacherId=" + teacherId });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;

    // Validate request
    if (!req.body.status) {
        return res.status(400).send({ message: "Status must be provided for update!" });
    }

    try {
        // Check if the withdrawal exists
        const existingWithdraw = await Withdraw.findById(id);
        if (!existingWithdraw) {
            return res.status(404).send({ message: "Withdrawal not found!" });
        }

        // Update the withdrawal
        if (req.body.status) {
            existingWithdraw.status = req.body.status;
        }
        const updatedWithdraw = await existingWithdraw.save();
        res.send(updatedWithdraw);
        const teacherData = await getTeacher(existingWithdraw.teacherId);
        teacherData.teacher.money -= existingWithdraw.amount;
        await axios.put(`http://localhost:8000/users/teachers/${existingWithdraw.teacherId}`, { money: teacherData.teacher.money });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error updating the withdrawal." });
    }
};