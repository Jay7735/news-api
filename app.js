const express = require("express");
const app = express();
const { getTopics, getEndpoints } = require("./controllers");

app.get("/api/topics", getTopics);

app.get('/api', getEndpoints);

app.all('*', (req, res)=>{
    res.status(404).send({msg: '404 Not Found'})
})

module.exports = app;
