const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const User = require('../models/user.model');

exports.signup = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 8);

        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid password.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


















// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { OAuth2Client } = require('google-auth-library');
// const User = require('../models/user.model');

// const client = new OAuth2Client("335158331702-nd64d7su3nrdj6sm7arcbepa5n188169.apps.googleusercontent.com");

// exports.signup = async (req, res) => {
//     try {
//         const { firstname, lastname, email, password } = req.body;

//         const hashedPassword = await bcrypt.hash(password, 8);

//         const user = await User.create({
//             firstname,
//             lastname,
//             email,
//             password: hashedPassword
//         });

//         res.status(201).send({ message: 'User registered successfully!' });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };

// exports.signin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ where: { email } });

//         if (!user) {
//             return res.status(404).send({ message: 'User not found.' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(401).send({ message: 'Invalid password.' });
//         }

//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//             expiresIn: 86400 // 24 hours
//         });

//         res.status(200).send({
//             id: user.id,
//             firstname: user.firstname,
//             lastname: user.lastname,
//             email: user.email,
//             accessToken: token
//         });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };

// exports.googleSignin = async (req, res) => {
//     const { tokenId } = req.body;

//     try {
//         const ticket = await client.verifyIdToken({
//             idToken: tokenId,
//             audience: "335158331702-nd64d7su3nrdj6sm7arcbepa5n188169.apps.googleusercontent.com"
//         });

//         const { name, email, picture } = ticket.getPayload();

//         let user = await User.findOne({ where: { email } });

//         if (!user) {
//             user = await User.create({
//                 firstname: name.split(' ')[0],
//                 lastname: name.split(' ')[1],
//                 email,
//                 password: bcrypt.hashSync('dummy_password', 8) // Dummy password as it won't be used
//             });
//         }

//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//             expiresIn: 86400 // 24 hours
//         });

//         res.status(200).send({
//             id: user.id,
//             firstname: user.firstname,
//             lastname: user.lastname,
//             email: user.email,
//             accessToken: token
//         });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };
