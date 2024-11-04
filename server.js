const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage for simplicity (use a database for production)
let users = [];

// Register route
app.post('/register', async (req, res) => {
    const { email, password, 'g-recaptcha-response': recaptcha } = req.body;

    if (!recaptcha) {
        return res.send('Please complete the reCAPTCHA.');
    }

    // Verify reCAPTCHA
    const secretKey = '6Lfg8nMqAAAAAEytzqiasLf26DNZtvFiqYmpUc9g';
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`;

    try {
        const response = await axios.post(verificationUrl);
        if (response.data.success) {
            users.push({ email, password }); // Store user data
            res.send('Registration successful!');
        } else {
            res.send('reCAPTCHA verification failed.');
        }
    } catch (error) {
        res.send('Error verifying reCAPTCHA.');
    }
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        res.send('Login successful!');
    } else {
        res.send('Invalid email or password.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
