const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

exports.getAllProducts = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
};

exports.getProductById = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
};

exports.createProduct = async (req, res) => {
    const { name, price, stock_quantity } = req.body;

    const id = idGenerator.productId();

    await db.query(
        `INSERT INTO products (id, name, price, stock_quantity)
         VALUES (?, ?, ?, ?)`,
        [id, name, price, stock_quantity]
    );

    res.json({ message: 'Product created', id });
};

exports.updateProduct = async (req, res) => {
    const { name, price, stock_quantity } = req.body;

    await db.query(
        `UPDATE products SET name=?, price=?, stock_quantity=? WHERE id=?`,
        [name, price, stock_quantity, req.params.id]
    );

    res.json({ message: 'Product updated' });
};

exports.deleteProduct = async (req, res) => {
    await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Product deleted' });
};