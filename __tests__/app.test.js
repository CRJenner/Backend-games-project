const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/data/development-data/index");
const { response } = require("express");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("app", () => {
  describe("1. GET: /api/categories", () => {
    test("200: responds with an array of categories which should have the following properties, slug and description", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          const {
            body: { category },
          } = response;
          category.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("2. GET: /api/reviews/:review_id", () => {
    test("200: responds with a review object containing properties", () => {
      const review_id = 2;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then((response) => {
          const review = response.body.review;
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
  });
  describe("3. GET: /api/users", () => {
    test("200: responds with an array of users which should have the following properties, username,name and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const {
            body: { users },
          } = response;
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("Error handling", () => {
  describe("1. GET /api/categories", () => {
    test("responds with a 404 for invalid path error", () => {
      return request(app).get("/api/notAPath").expect(404);
    });
  });
  describe("2. GET: /api/reviews/:review_id", () => {
    test("responds with 400 for invalid review_id", () => {
      return request(app)
        .get("/api/reviews/banana")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid input, use a number");
        });
    });
    test("responds with a 404 if review_id is not in the db", () => {
      return request(app)
        .get("/api/reviews/99999")
        .expect(404)
        .then((response) => {
          const {
            body: { msg },
          } = response;
          expect(msg).toBe("Review ID not found, try another number.");
        });
    });
  });
  describe("3. GET /api/users", () => {
    test("responds with a 404 for invalid path error", () => {
      return request(app).get("/api/notAUser").expect(404);
    });
  });
});
