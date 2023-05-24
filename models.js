const connection = require("./db/connection");
const fs = require("fs/promises");
const format = require("pg-format");

const selectTopics = () => {
  return connection
    .query("SELECT * FROM topics;")
    .then((result) => result.rows);
};

const selectEndpoints = () => {
  return fs.readFile("endpoints.json", "utf-8").then((result) => {
    const jsEndpoints = JSON.parse(result);
    return jsEndpoints;
  });
};

const selectArticleById = (id) => {
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

const selectArticles = () => {
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

const selectComments = (id) => {
  return selectArticleById(id)
    .then((result) => {
      return connection.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
        [id]
      );
    })
    .then((result) => {
      return result.rows;
    });
};

const addComments = (author, body, id) => {
  return selectArticleById(id).then((result) => {
    return connection
      .query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
        [author, body, id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

const updateArticleVotes = (update, id) => {
  return connection
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [update, id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = {
  selectArticleById,
  selectTopics,
  selectEndpoints,
  selectArticles,
  selectComments,
  addComments,
  updateArticleVotes,
};
