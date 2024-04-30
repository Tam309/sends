const express = require('express');
const { query } = require('../helpers/db.js');

const feedbackRouter = express.Router();

// Get all feedbacks:
feedbackRouter.get('/feedbacks', async(req, res) => {
    try {
        const sql = 'SELECT * FROM feedbacks';
        const result = await query(sql);
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows); 
    } catch (error) {
        res.statusMessage = error;
        res.status(500).json({ error : error.message })
    }
})

// Post a feedback:
feedbackRouter.post('/feedbacks', async(req, res) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const user = req.body.user_id;
        const sql = 'INSERT INTO feedbacks(title, content, user_id) VALUES ($1, $2, $3) RETURNING title, content, user_id';
        const result = await query(sql, [title, content, user]);
        const rows = result.rows ? result.rows : [];
        res.status(200).json({ id: rows[0].id });
    } catch (error) {
        res.statusMessage = error;
        res.status(500).json({ error: error.message })
    }
})

module.exports = { feedbackRouter }