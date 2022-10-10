const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/data/development-data/index");
const { response } = require("express");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("app", () => {
  describe("GET: /api/categories", () => {
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
    test("400: handles the error", () => {
      return request(app).get("/api/notAPath").expect(404);
      // .then((response) => {
      //   const {
      //     body: { msg },
      //   } = response;
      //   expect(msg).toBe("Not a valid path");
      // });
    });
  });
});

// describe("Error handling", () => {
// 	test("1.GET /api/notAPath should respond with status 404 and display a message", () => {
// 		return request(app).get("/api/topickssS").expect(404);
// 	});
// });
