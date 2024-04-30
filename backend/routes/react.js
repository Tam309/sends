const express = require('express');
const { query } = require('../helpers/db.js');

const reactRouter = express.Router()

// Get reacts from a post
reactRouter.get("/posts/:post_id/reacts", async(req,res) => {
    const post_id = req.params.post_id;
    try{
        const result = await query('SELECT count(id) FROM post_reacts WHERE post_id = $1', [post_id]);
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// reactRouter.post("/posts/:post_id/reacts", async(req,res) => {
//     const post_id = req.params.post_id;
//     const react_id = req.body.react_id;
//     const user_id = req.body.user_id;
//     try {
//         const result = await query('INSERT INTO post_reacts (post_id, react_id, user_id) VALUES ($1, $2, $3) RETURNING *', [post_id, react_id, user_id]);
//         const rows = result.rows ? result.rows : [];
//         res.status(200).json({ post_id: post_id, react_id: react_id, user_id: user_id});
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Hit a reaction to a post
reactRouter.post("/posts/:post_id/reacts", async(req,res) => {
    const post_id = req.params.post_id;
    const react_id = req.body.react_id;
    const user_id = req.body.user_id;
    try {
        const existingReact = await query('SELECT * FROM post_reacts WHERE post_id = $1 AND user_id = $2', [post_id, user_id]);
        console.log(existingReact.rows.length)    
        if (existingReact.rows.length > 0) {
            return res.status(409).json({ error: 'User has already reacted to this post' });
        } else {
        const result = await query('INSERT INTO post_reacts (post_id, react_id, user_id) VALUES ($1, $2, $3) RETURNING *', [post_id, react_id, user_id]);
        const rows = result.rows ? result.rows : [];
        res.status(201).json({ post_id: post_id, react_id: react_id, user_id: user_id});
        }
    } catch (error) {
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
});

reactRouter.delete("/posts/:post_id/reacts", async(req,res) => {
    const post_id = req.params.post_id;
    const user_id = req.body.user_id;
    try {
        await query('DELETE FROM post_reacts WHERE post_id = $1 AND user_id = $2', [post_id, user_id]);
        res.status(200).json({ post_id: post_id, user_id: user_id});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = { reactRouter };