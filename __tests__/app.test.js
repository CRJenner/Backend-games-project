const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/data/development-data/index");
const { response } = require("express");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("app", () => {
  describe("/api", () => {
    describe("/categories", () => {
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
      });
    });
  });
});
