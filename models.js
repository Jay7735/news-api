const connection = require("./db/connection");
const fs = require('fs/promises')

exports.selectTopics = () => {
    return connection
    .query("SELECT * FROM topics;")
    .then((result) => result.rows)
    ;
};

exports.selectEndpoints = () => {
    return fs.readFile('endpoints.json', 'utf-8').then((result)=>{
        const jsEndpoints = JSON.parse(result)
        return jsEndpoints
    })
}

exports.selectArticleById = (id) => {
    return connection.query("SELECT * from articles WHERE article_id = $1", [id]).then((result)=> {
        const article = result.rows[0]
        if(!article){
            return Promise.reject({
                status: 404,
                msg: `Non-existent ID: ${id}`
            })
        }
        return article
    })
}