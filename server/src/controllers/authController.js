const jwt = require('jsonwebtoken');
const db = require('../../db');

const config = require('../config/config');

const JWT_SECRET = config.Jwt.Secret;

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = users[0];

        const bcrypt = require('bcryptjs');

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: "Login successful",
            token,
            role: user.role
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};