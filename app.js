const express = require("express");
const app = express();
const { getTopics, getEndpoints, getArticleById, getArticles } = require("./controllers");




app.get("/api/topics", getTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.all('*', (req, res)=>{
    res.status(404).send({msg: '404 Not Found'})
})

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  else if(err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid input' });
  } else res.status(500).send({msg: 'Internal Server Error' });
});

module.exports = app;
