const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3002;

mongoose.connect('mongodb://localhost:27017/paymentdb', { useNewUrlParser: true, useUnifiedTopology: true });

const transactionSchema = new mongoose.Schema({
    studentId: mongoose.Schema.Types.ObjectId,
    teacherId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.use(express.json());

// Transfer money from student to teacher
app.post('/transfer', async (req, res) => {
    const { studentId, teacherId, amount } = req.body;

    const student = await Student.findById(studentId);
    const teacher = await Teacher.findById(teacherId);

    if (student.money < amount) {
        return res.status(400).send({ message: 'Insufficient funds' });
    }

    student.money -= amount;
    teacher.money += amount;

    await student.save();
    await teacher.save();

    const transaction = new Transaction({ studentId, teacherId, amount });
    await transaction.save();

    res.send({ message: 'Transfer successful', transaction });
});

// Get transaction history
app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.send(transactions);
});

app.listen(port, () => {
    console.log(`Payment service running on port ${port}`);
});
