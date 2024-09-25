const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.post('/submit-form', async (req, res) => {
    const recaptchaToken = req.body['g-recaptcha-response'];
    const secretKey = 'your_secret_key'; // Your reCAPTCHA v3 secret key

    if (!recaptchaToken) {
        return res.status(400).json({ message: 'reCAPTCHA token is missing' });
    }

    try {
        // Verify token with Google reCAPTCHA API
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: secretKey,
                response: recaptchaToken
            }
        });

        const verificationResult = response.data;
        if (verificationResult.success && verificationResult.score >= 0.5) {
            // Token is valid and the user is likely human
            res.json({ message: 'Form submission successful' });
        } else {
            // Token is invalid or suspicious activity detected
            res.status(400).json({ message: 'reCAPTCHA verification failed', score: verificationResult.score });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying reCAPTCHA', error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
