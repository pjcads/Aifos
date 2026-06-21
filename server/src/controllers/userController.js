const db = require('../../db');
const bcrypt = require('bcryptjs');
const idGenerator = require('../utils/idGenerator');

const passwordGenerator =
    require('../utils/passwordGenerator');
    
/**
 * GET ALL USERS (exclude passwords)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            `
            SELECT
                id,
                username,
                full_name,
                role,
                is_active,
                is_system_account,
                created_at
            FROM users
            `
        );
        res.json({
            success: true,
            users: rows
        });
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
            `
            SELECT
                id,
                username,
                full_name,
                role,
                is_active,
                is_system_account,
                created_at
            FROM users
            WHERE id = ?
            `,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            success: true,
            user: rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * CREATE USER (SUPER_ADMIN ONLY)
 */
exports.createUser = async (req, res) => {

    try {

        const {
            username,
            full_name,
            role
        } = req.body;

        const id =
            idGenerator.userId();

        const temporaryPassword =
            passwordGenerator
                .generatePassword();

        const hashedPassword =
            await bcrypt.hash(
                temporaryPassword,
                10
            );

        await db.query(
            `
            INSERT INTO users
            (
                id,
                username,
                full_name,
                password,
                role
            )
            VALUES
            (
                ?, ?, ?, ?, ?
            )
            `,
            [
                id,
                username,
                full_name,
                hashedPassword,
                role
            ]
        );

        res.json({

            success: true,

            userId:
                id,

            temporaryPassword

        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

/**
 * UPDATE USER
 */
exports.updateUser = async (req, res) => {
    const [existing] =
        await db.query(
            `
            SELECT
                is_system_account
            FROM users
            WHERE id = ?
            `,
            [req.params.id]
        );

    if (
        existing.length === 0
    )
    {
        return res
            .status(404)
            .json({
                error:
                    'User not found'
            });
    }

    if (
        existing[0]
            .is_system_account
    )
    {
        return res
            .status(400)
            .json({
                error:
                    'System account cannot be modified'
            });
    }

    try {
        const {
            full_name,
            role,
            is_active
        } = req.body;

        await db.query(
            `UPDATE users 
             SET full_name=?, role=?, is_active=?
             WHERE id=?`,
            [
                full_name,
                role,
                is_active,
                req.params.id
            ]
        );

        res.json({ message: 'User updated successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword =
    async (req, res) => {

        const [rows] =
            await db.query(
                `
                SELECT is_system_account
                FROM users
                WHERE id = ?
                `,
                [req.params.id]
            );

        if (
            rows.length === 0
        )
        {
            throw new Error(
                'User not found'
            );
        }

        if (
            rows[0].is_system_account
        )
        {
            throw new Error(
                'System account password cannot be reset'
            );
        }
                
        try {

            const temporaryPassword =
                passwordGenerator
                    .generatePassword();

            const hashedPassword =
                await bcrypt.hash(
                    temporaryPassword,
                    10
                );

            await db.query(
                `
                UPDATE users
                SET password = ?
                WHERE id = ?
                `,
                [
                    hashedPassword,
                    req.params.id
                ]
            );

            res.json({
                success: true,
                temporaryPassword
            });

        } catch (err) {

            res.status(500).json({
                success: false,
                error: err.message
            });

        }

    };