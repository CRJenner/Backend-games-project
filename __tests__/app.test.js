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
              comment_count: expect.any(Number),
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
  describe("4. PATCH /api/reviews/:review_id", () => {
    test("200: Patch returns an object", () => {
      const review_id = 2;
      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe("object");
        });
    });
    test(`should update review by id in this form { inc_votes : newVote } and should respond with updated object.`, () => {
      const review_id = 2;
      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toEqual({
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_id: 2,
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 7,
          });
        });
    });
  });
  describe("5. GET /api/reviews", () => {
    test("200 response with an array of reviews in descending date created_at", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          let reviews = body.reviews;
          expect(reviews.length).toEqual(13);
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
          });
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: expect.any(Number),
                title: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(String),
                review_img_url: expect.any(String),
                designer: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
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
    describe("4. PATCH: /api/reviews/:review_id", () => {
      test("responds with a 400 and returns error message when no valid number is entered", () => {
        const review_id = 2;
        return request(app)
          .patch(`/api/reviews/${review_id}`)
          .send({ inc_votes: "one" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Invalid input, use a number");
          });
      });
      test("Responds with a 400 and returns and error message when no inc amount entered", () => {
        const review_id = 2;
        return request(app)
          .patch(`/api/reviews/${review_id}`)
          .send({ inc_votes: "" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Invalid input, use a number");
          });
      });
    });
  });
});
