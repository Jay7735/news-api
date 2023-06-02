const express = require("express");
const app = express();
const { getTopics, getEndpoints, getArticleById, getArticles, getArticlesByTopic, getComments, postComments, updateVotes } = require("./controllers");
const cors = require('cors')

app.use(cors())

app.use(express.json())

app.get("/api/topics", getTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/:topic/articles', getArticlesByTopic)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', postComments)

app.patch('/api/articles/:article_id', updateVotes)

app.all('*', (req, res)=>{
    res.status(404).send({msg: '404 Not Found'})
})

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  else if(err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid input' });
  } else res.status(500).send({msg: 'Internall Server Error' });
});

module.exports = app;
