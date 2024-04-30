const express = require('express');
const { query } = require('../helpers/db.js');
const bcrypt = require('bcrypt');

const deleteRouter = express.Router();

async function deleteCommentReacts(id) {
    const sql = 'delete from comment_reacts where comment_id in (select comment_id from comments inner join posts on comments.post_id = posts.post_id where posts.user_id = $1)';
    const result = await query(sql, [id]);
    return result
}
async function deleteComments(id) {
    const sql = 'delete from comments where user_id = $1';
    const result = await query( sql, [id]);
    return result
}

async function deletePostReacts(id) {
    const sql = 'delete from post_reacts where user_id = $1';
    const result = await query(sql, [id]);
    return result
}

async function deletePosts(id) {
    const sql = 'delete from posts where user_id = $1'
    const result = await query(sql, [id]);
    return result
}



deleteRouter.delete("/delete/users/:user_id", async(req, res) => {
    const userId = parseInt(req.params.user_id);
    console.log(userId);
    try {
        const sql = 'SELECT * FROM users WHERE user_id = $1';
        const data = await query(sql,[userId]);
        console.log(data.rowCount);
        if(data.rowCount === 1) {
            console.log(data.rows[0]);
            const checkPassword = await bcrypt.compare(req.body.password, data.rows[0].password);
            if (checkPassword) {
                await deleteCommentReacts(userId);
                await deleteComments(userId);
                await deletePostReacts(userId);
                await deletePosts(userId);
                const result = await query('DELETE FROM users WHERE user_id = $1', [userId]);
                res.status(200).json({ user_id: userId, message: 'Account deleted successfully'});
            } else {
                res.status(401).json({ error : 'Incorrect Password' })
            }
        } else {
            res.status(401).json({ error : 'Account not found'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error});
    }
});

module.exports = { deleteRouter };