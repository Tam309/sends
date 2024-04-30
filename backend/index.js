require('dotenv').config()
//console.log(process.env)
const express = require('express')
const cors = require('cors')
//const { query } = require('./helpers/db.js');
const { postRouter } = require('./routes/posts.js');
const { commentRouter } = require('./routes/comments.js');
const { userRouter } = require('./routes/user.js');
const { reactRouter }  = require('./routes/react.js');
const { searchRouter } = require('./routes/search.js');
const { feedbackRouter } = require('./routes/feedback.js');
const { deleteRouter } = require('./routes/delete.js');

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/',postRouter)
app.use('/',commentRouter)
app.use('/',userRouter)
app.use('/', reactRouter);
app.use('/', searchRouter);
app.use('/', feedbackRouter);
app.use('/', deleteRouter);

const port = process.env.PORT;

app.listen(port)


