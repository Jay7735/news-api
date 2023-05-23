const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("3. GET /api/topics", () => {
  it("should return all the required keys ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  it("the keys should have the correct types", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("Error handling", () => {
  it("should return a 404 error when passed a non-existent route", () => {
    return request(app)
      .get("/api/blahblah")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404 Not Found");
      });
  });
});

describe("3.5 GET /api", () => {
  it("should return a JSON object showing all possible endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body["GET /api"]).toEqual({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
        expect(response.body["GET /api/topics"]).toEqual({
          description: "serves an array of all topics",
          queries: [],
          exampleResponse: {
            topics: [{ slug: "football", description: "Footie!" }],
          },
        });
        expect(response.body["GET /api/articles"]).toEqual({
          description: "serves an array of all topics",
          queries: ["author", "topic", "sort_by", "order"],
          exampleResponse: {
            articles: [
              {
                title: "Seafood substitutions are increasing",
                topic: "cooking",
                author: "weegembump",
                body: "Text from the article..",
                created_at: "2018-05-30T15:59:13.341Z",
                votes: 0,
                comment_count: 6,
              },
            ],
          },
        });
      });
  });
});

describe("4 GET /api/articles/:article_id", () => {
  it("should return an object that has specified properties", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toHaveProperty("article_id");
        expect(response.body.article["article_id"]).toBe(7);
        expect(response.body.article).toHaveProperty("title");
        expect(response.body.article).toHaveProperty("topic");
        expect(response.body.article).toHaveProperty("author");
        expect(response.body.article).toHaveProperty("body");
        expect(response.body.article).toHaveProperty("created_at");
        expect(response.body.article).toHaveProperty("votes");
        expect(response.body.article).toHaveProperty("article_img_url");
      });
  });
  it("should return error 400 when passed an incorrect id type", () => {
    return request(app)
      .get("/api/articles/blahblah")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  it("should return error 404 when passed an id that does not exist", () => {
    return request(app)
      .get("/api/articles/777")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Non-existent ID: 777");
      });
  });
});

describe("5 GET /api/articles", () => {
  it("should return an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  it("should not have a body on the article objects", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article.body).toBe(undefined);
        });
      });
  });
  it("should be sorted in descending date order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("6 GET /api/articles/:article_id/comments", () => {
  it("should have the specified properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        response.body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  it("should return an array of appropriate length", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);
      });
  });
  it("should return the comments with most recent first (ie DESC by date)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("should return 400 error when passed an incorrect ID type", () => {
    return request(app)
      .get("/api/articles/blahblah/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  it("should return 404 when passed a non-existent ID", () => {
    return request(app)
      .get("/api/articles/777/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Non-existent ID: 777");
      });
  });
  it("should return 200 and an empty array when passed a valid ID which has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(0);
        expect(response.body.comments).toEqual([]);
      });
  });
});

describe.only("7 POST /api/articles/:article_id/comments", () => {
  it("should add comments and respond with the posted comment ", () => {
    const comment = {
      author: "butter_bridge",
      body: "I am making a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then((response) => {
        console.log(response.body.comments, "body from test");
        const returnedObj = response.body.comments[0];
        expect(returnedObj.body).toBe("I am making a comment");
        expect(returnedObj.article_id).toBe(1);
        expect(returnedObj.author).toBe("butter_bridge");
        expect(returnedObj).toHaveProperty("comment_id");
        expect(returnedObj).toHaveProperty("votes");
        expect(returnedObj).toHaveProperty("created_at");
      });
  });
  it("should return 400 error when passed an incorrect ID type", () => {
    const comment = {
      author: "butter_bridge",
      body: "I am making a comment",
    };
    return request(app)
      .post("/api/articles/blahblah/comments")
      .send(comment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  it("should return 404 when passed a non existent ID", () => {
    const comment = {
      author: "butter_bridge",
      body: "I am making a comment",
    };
    return request(app)
    .post("/api/articles/777/comments")
    .send(comment)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Non-existent ID: 777");
    });
  });
  it('should add comment and respond with posted comment even when given more than author and body', () => {
    const comment = {
      author: "butter_bridge",
      body: "I am making a comment",
      blah: "blah blah comment"
    };
    return request(app)
    .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then((response) => {
        console.log(response.body.comments, "body from test");
        const returnedObj = response.body.comments[0];
        expect(returnedObj.body).toBe("I am making a comment");
        expect(returnedObj.article_id).toBe(1);
        expect(returnedObj.author).toBe("butter_bridge");
        expect(returnedObj).toHaveProperty("comment_id");
        expect(returnedObj).toHaveProperty("votes");
        expect(returnedObj).toHaveProperty("created_at");
        expect(returnedObj).not.toHaveProperty("blah")
  });
})})

