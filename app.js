const express = require("express");
const app = express();
const { getTopics } = require("./controllers");
// const handleServerErrors = require("./errors.js");

// app.use(handleServerErrors);

app.get("/api/topics", getTopics);

app.all('*', (req, res)=>{
    res.status(404).send({msg: '404 Not Found'})
})

module.exports = app;
