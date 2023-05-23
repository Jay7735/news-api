const {
  selectTopics,
  selectEndpoints,
  selectArticleById,
  selectArticles,
  selectComments,
  addComments
} = require("./models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  selectEndpoints().then((endpoints) => {
    res.status(200).send(endpoints);
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const id = req.params.article_id
    selectComments(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComments = (req, res, next) => {
    const id = req.params.article_id;
    //console.log(id, 'from controler')
    //console.log(req.body, 'from controller also')
    const {author, body} = req.body
    
    addComments(author, body, id).then((result)=>{
        res.status(201).send({comments: result})
        //console.log({comments: result}, 'return of the controller')
    }).catch(next)
}