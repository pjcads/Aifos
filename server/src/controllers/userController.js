const db = require('../../db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/**
 * GET ALL USERS (exclude passwords)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, username, role, is_active, created_at FROM users'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * GET USER BY ID
 */
exports.getUserById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, username, role, is_active FROM users WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * CREATE USER (SUPER_ADMIN ONLY)
 */
exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const id = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (id, username, password, role)
             VALUES (?, ?, ?, ?)`,
            [id, username, hashedPassword, role]
        );

        res.json({
            message: 'User created successfully',
            id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * UPDATE USER
 */
exports.updateUser = async (req, res) => {
    try {
        const { username, role, is_active } = req.body;

        await db.query(
            `UPDATE users 
             SET username=?, role=?, is_active=?
             WHERE id=?`,
            [username, role, is_active, req.params.id]
        );

        res.json({ message: 'User updated successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
    try {
        await db.query(
            'DELETE FROM users WHERE id=?',
            [req.params.id]
        );

        res.json({ message: 'User deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};