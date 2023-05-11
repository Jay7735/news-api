const connection = require("./db/connection");
const fs = require("fs/promises");

exports.selectTopics = () => {
  return connection
    .query("SELECT * FROM topics;")
    .then((result) => result.rows);
};

exports.selectEndpoints = () => {
  return fs.readFile("endpoints.json", "utf-8").then((result) => {
    const jsEndpoints = JSON.parse(result);
    return jsEndpoints;
  });
};

exports.selectArticleById = (id) => {
  return connection
    .query("SELECT * from articles WHERE article_id = $1", [id])
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `Non-existent ID: ${id}`,
        });
      }
      return article;
    });
};

exports.selectArticles = () => {
  return connection
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectComments = (id) => {
   
  return connection.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [id]).then((result)=>{
    if(result.rows.length === 0){
        return Promise.reject({
            status: 404,
            msg: `No comments found for ID: ${id}`
        })
    }
    return result.rows
  })
};
