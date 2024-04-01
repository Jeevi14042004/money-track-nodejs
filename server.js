const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/money', { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB Schema
const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String // 'expense' or 'income'
});

// MongoDB Collection (Model)
const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

// Routes
app.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.render('index', { transactions }); // Render index.ejs template with transactions data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/transaction', async (req, res) => {
    try {
        const { description, amount, type } = req.body;
        const newTransaction = new Transaction({ description, amount, type });
        await newTransaction.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Server listening
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
