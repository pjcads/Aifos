const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

exports.getAllCustomers = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM customers ORDER BY id DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM customers WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;

        const id = idGenerator.customerId();

        await db.query(
            `INSERT INTO customers (id, name, phone, email, address)
             VALUES (?, ?, ?, ?, ?)`,
            [id, name, phone, email, address]
        );

        res.json({
            message: 'Customer created successfully',
            id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { name, phone, email, address, loyalty_points } = req.body;

        await db.query(
            `UPDATE customers 
             SET name=?, phone=?, email=?, address=?, loyalty_points=?
             WHERE id=?`,
            [name, phone, email, address, loyalty_points, req.params.id]
        );

        res.json({ message: 'Customer updated successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        await db.query(
            'DELETE FROM customers WHERE id=?',
            [req.params.id]
        );

        res.json({ message: 'Customer deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};