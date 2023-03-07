const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const endpointsJson = require("../endpoints.json")


beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("app", () => {
  describe("GET /api", () => {
    test('200: GET - all available endpoints of the api ', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            const { endpoint } = body
            expect(endpoint).toEqual(endpointsJson)
        })
    });
    test('404: Error issued for invalid endpoint ', () => {
        return request(app)
        .get("/Wrong_Endpoint")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid pathway")
        })
    });

})
  describe("1. GET: /api/categories", () => {
    test("200: responds with an array of categories which should have the following properties, slug and description", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({body}) => {
          const {category} = body;
          category.forEach((categore) => {
            expect(categore).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              })
          })
          expect(category).toHaveLength(4)
        });
    });
      test("404: responds with a 404 for invalid path error", () => {
        return request(app)
        .get("/api/notAPath")
        .expect(404)
        .then(({body})=> {
          expect(body.msg).toBe("Invalid pathway")
        })
      });
    
  });
  describe("2. GET: /api/reviews/:review_id", () => {
    test("200: responds with a review object containing properties", () => {
      return request(app)
        .get(`/api/reviews/2`)
        .expect(200)
        .then(({body}) => {
          const {review} = body
          expect(review).toMatchObject({
              review_id: 2,
              title: 'Jenga',
              review_body: 'Fiddly fun for all the family',
              designer: 'Leslie Scott',
              owner: 'philippaclaire9',
              review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png', 
              category: 'dexterity',
              created_at: "2021-01-18T10:01:41.251Z",
              votes: 5,
            })
          
        });
    })
    test('200: Adds comment count in the review', () => { 
      return request(app)
      .get(`/api/reviews/2`)
      .expect(200)
      .then(({body})=>{
        const {review} = body
        expect(review.comment_count).toBe(3)

      })
     })
    test("400: responds with 400 for invalid review_id", () => {
      return request(app)
        .get("/api/reviews/invalid_Review_id")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid input, use a number");
        });
    });
    test("404: responds with a 404 if review_id is not in the db", () => {
      return request(app)
        .get("/api/reviews/99999")
        .expect(404)
        .then(({body}) => {
          const {msg} = body
          expect(msg).toBe("Review ID not found, try another number.");
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
  describe("6. GET: /api/reviews/:review_id/comments", () => {
    test("200: an array of comments for the given review_id of which each comment should have the following properties, comment_id, votes, created_at, author, body and review_id", () => {
      const review_id = 2;
      return request(app)
        .get(`/api/reviews/${review_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          let comments = body.comments;
          expect(comments.length).toEqual(3);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                review_id: expect.any(Number),
              })
            );
          });
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("7. POST /api/reviews/:review_id/comments", () => {
    test("201: publish a new comment using username and body", () => {
      const newComment = {
        username: "mallionaire",
        body: "Best comment ever.",
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          let comment = body.comments;
          expect(comment).toEqual({
            body: "Best comment ever.",
            votes: expect.any(Number),
            author: "mallionaire",
            review_id: 3,
            created_at: expect.any(String),
            comment_id: expect.any(Number),
          });
        });
    });
  });
  describe("8. Get /api/reviews (queries)", () => {
    test("sort_by, which sorts the reviews by any valid column (defaults to date)", () => {
      "valid columns: title, designer, owner, review_body , category, votes, created_at";
      return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeSortedBy("votes", {
            descending: true,
          });
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              designer: expect.any(String),
              title: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              review_body: expect.any(String),
              comment_count: expect.any(Number),
              owner: expect.any(String),
            });
          });
        });
    });
    test("collect a 200 status which accepts order query ?order=desc", () => {
      "valid columns: title, designer, owner, review_body , category, votes, created_at";
      return request(app)
        .get("/api/reviews?order=desc")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
          });
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              designer: expect.any(String),
              title: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              review_body: expect.any(String),
              comment_count: expect.any(Number),
              owner: expect.any(String),
            });
          });
        });
    });
    test("collect a 200 status which accepts order query ?order=asc", () => {
      "valid columns: title, designer, owner, review_body , category, votes, created_at";
      return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeSortedBy("created_at", {
            ascending: true,
          });
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              designer: expect.any(String),
              title: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              review_body: expect.any(String),
              comment_count: expect.any(Number),
              owner: expect.any(String),
            });
          });
        });
    });
    test("Collect a 200 status, accepts category query", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(1);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              designer: expect.any(String),
              title: expect.any(String),
              category: "dexterity",
              created_at: expect.any(String),
              votes: expect.any(Number),
              review_body: expect.any(String),
              comment_count: expect.any(Number),
              owner: expect.any(String),
            });
          });
        });
    });
    describe("9. DELETE /api/comments/:comment_id", () => {
      test("should delete a comment with the comment_id and respond with 204 status", () => {
        return request(app).delete("/api/comments/2").expect(204);
      });
    });
  });
});

describe("Error handling", () => {
  

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
  describe("6. GET: /api/reviews/:review_id/comments", () => {
    test("Responds with a 400 when the id is invalid", () => {
      return request(app)
        .get(`/api/reviews/invalidId/comments`)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Invalid input, use a number" });
        });
    });
    test("responds with a 404 if review_id is valid but no reviews", () => {
      return request(app)
        .get("/api/reviews/99999/comments")
        .expect(404)
        .then((response) => {
          const {
            body: { msg },
          } = response;
          expect(msg).toBe("Review ID not found, try another number.");
        });
    });
  });
  describe("7. POST: /api/reviews/:review_id/comments", () => {
    test("responds with a 400 when there is missing information provided", () => {
      const newComment = {
        username: "mallionaire",
        body: "",
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          const {
            body: { msg },
          } = response;
          expect(msg).toBe("Please enter a comment and username");
        });
    });
    test("Responds with a 404 with a non-existent username on db", () => {
      const newComment = {
        username: "RyderRoo",
        body: "I am not a username",
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          const {
            body: { msg },
          } = response;
          expect(msg).toBe("error: User not found");
        });
    });
  });
  describe("8 GET /api/reviews (queries)", () => {
    test("Responds with a 400 for invalid sort_query", () => {
      return request(app)
        .get("/api/reviews?sort_by=invalidSort")
        .expect(400)
        .then((response) => {
          const {
            body: { msg },
          } = response;
          expect(msg).toBe("Invalid sort query, try again.");
        });
    });
    test("should return status: 400 for invalid order query", () => {
      return request(app)
        .get("/api/reviews?order=invalidOrder")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid order query, try again");
        });
    });
    test("should return a 404 for non-existent category query", () => {
      return request(app)
        .get("/api/reviews?category=invalidCategory")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid category query, try again");
        });
    });
  });
  describe("12. DELETE /api/comments/:comment_id", () => {
    test("should respond with status:400 comment_id is not a number", () => {
      return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid input, use a number");
        });
    });
    test("should respond with status:400 comment_id is not found in database", () => {
      return request(app)
        .delete("/api/comments/4325353")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Unable to delete as comment id not found.");
        });
    });
  });
});
