const express = require('express');
const { query } = require('../helpers/db.js');

const searchRouter = express.Router()

searchRouter.get('/search/posts/:title', async (req, res) => {
    const title = req.params.title.toString();
    try {
        const sql = 'SELECT posts.post_id, posts.title, posts.post_content, posts.saved, users.user_id FROM posts INNER JOIN users ON posts.user_id=users.user_id WHERE posts.title ILIKE $1';
        const result = await query(sql, ['%' + title + '%']);
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

searchRouter.get('/search/users/:user_name', async (req, res) => {
    const user_name = req.params.user_name.toString();
    try {
        const result = await query('SELECT user_id, user_name, email FROM users WHERE user_name ILIKE $1', [user_name + '%']);
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { searchRouter };
