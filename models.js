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

