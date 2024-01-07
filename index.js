const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User.model');
const ProductModel = require('./models/Product.model');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(
    cors({
        origin: '*',
    })
);

// Define your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URL

async function main() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connection successful!');
    } catch (error) {
        console.log('Connection to MongoDB failed:', error);
    }
}
main();

app.get('/', (req, res) => {
    res.send('Base endpoint running');
});

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.send({ msg: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        res.send({ msg: 'Signup successful!' });
    } catch (error) {
        res.status(500).send({ error: 'Signup failed!' });
        console.error(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.send({ msg: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.send({ msg: 'Incorrect password' });
        }
        const token = jwt.sign({ userId: user._id }, 'masaisecret');
        res.send({ msg: 'Login successful!', token });
    } catch (error) {
        res.status(500).send({ error: 'Login failed!' });
        console.error(error);
    }
});

// Other routes and endpoints go here...

app.get('/products', async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch products!' });
        console.error(error);
    }
});


app.post('/products', async (req, res) => {
    try {
        const { id, img_url, name, price, category, region, flag, rating } = req.body;
        const newProduct = await ProductModel.create({
            id,
            img_url,
            name,
            price,
            category,
            region,
            flag,
            rating
        });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ... Other routes and configurations


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port 8000}`);
});
