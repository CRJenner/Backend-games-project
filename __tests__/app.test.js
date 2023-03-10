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
          expect(msg).toBe("Invalid review id");
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
        .then(({body}) => {
          const {users}=body
          expect(users).toHaveLength(4)
          users.forEach((user) => {
            expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            
          });
        });
    });
    test('404: responds with a 404 error for invalid path for a user', () => { 
      return request(app)
    .get("/api/NotAUser")
    .expect(404)
    .then(({body}) => {
      const {msg} = body
      expect(msg).toBe("Invalid pathway")
    }) 
  })
  });
  describe("4. PATCH /api/reviews/:review_id", () => {
    test(`should update review by id in this form { inc_votes : newVote } and should respond with updated object.`, () => {
      return request(app)
        .patch(`/api/reviews/2`)
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body }) => {
          const patchedReview = body
          expect(patchedReview).toBeInstanceOf(Object);
          expect(patchedReview).toEqual({
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
    test("400: responds with a 400 and returns error message when no valid number is entered", () => {
      return request(app)
        .patch(`/api/reviews/2`)
        .send({ inc_votes: "one" })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid voting");
        });
    });
    test("400: Responds with a 400 and returns and error message when no inc amount entered", () => {
      return request(app)
        .patch(`/api/reviews/2`)
        .send({ inc_votes: "" })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid voting");
        });
    });
    test('404: Should return an error for valid but not existent review_id', () => { 
      return request(app)
      .patch("/api/reviews/99999")
      .send({ inc_votes: 1})
      .expect(404)
      .then(({body})=> {
        const {msg} = body
        expect(msg).toBe("Review id not found")
      })
     })
     test('400: Should return an error for invalid key', () => {
      return request(app)
      .patch("/api/reviews/1")
      .send({ notVotesKey: 5 })
      .expect(400)
      .then(({body}) => {
        const {msg} = body
          expect(msg).toBe("Invalid voting")
      })
  });
})
  describe("6. GET: /api/reviews/:review_id/comments", () => {
    test("200: an array of comments for the given review_id of which each comment should have the following properties, comment_id, votes, created_at, author, body and review_id", () => {
      return request(app)
        .get(`/api/reviews/2/comments`)
        .expect(200)
        .then(({ body }) => {
          let comments = body.comments;
          expect(comments.length).toEqual(3);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                review_id: expect.any(Number),
              })
          });
          
        });
    });
    test('200: Responds with comments sorted by most recent in descending order. ', () => {
      return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({body}) => {
          const comment = body.comments;
          expect(comment).toBeSorted({ key: 'created_at', descending: true})
      })
      
  });
    test("400: Responds with a 400 when the id is invalid", () => {
      return request(app)
        .get(`/api/reviews/invalidId/comments`)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Invalid review id" });
        });
    });
    test("404: responds with a 404 if review_id is valid but no reviews", () => {
      return request(app)
        .get("/api/reviews/99999/comments")
        .expect(404)
        .then((response) => {
          const {
            body: { msg },
          } = response;
          expect(msg).toBe("Review ID not found, try another number.");
        });
    })
    test("404: responds with a 404 for invalid pathway", () => {
      return request(app)
        .get("/api/reviews/2/commentssss")
        .expect(404)
        .then((response) => {
          const {
            body: { msg },
          } = response;
          expect(msg).toBe("Invalid pathway");
        });
    })
  });
  describe("7. POST /api/reviews/:review_id/comments", () => {
    test("201: publish a new comment using username and body", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send( { username: "mallionaire", body: "Best comment ever." })
        .expect(201)
        .then(({ body }) => {
          const {comments} = body;
          expect(comments).toMatchObject({
            body: "Best comment ever.",
            votes: 0,
            author: "mallionaire",
            review_id: 3,
            created_at: expect.any(String),
            comment_id: 7,
          });
        });
    });
    test('201: responds with new comment and ignores not needed properties', () => { 
      return request(app)
                .post("/api/reviews/3/comments")
                .send( { username: "mallionaire", body: "unnecessary info here.", day: "Monday"})
                .expect(201)
                .then(({body})=>{
                  const {comments} = body;
                expect(comments).toMatchObject({
                 body: "unnecessary info here.",
                 votes: 0,
                 author: "mallionaire",
                  review_id: 3,
                 created_at: expect.any(String),
                 comment_id: 7,
          });
                })
     })
     test('400: Should return an error for invalid review_id', () => {
      return request(app)
      .post("/api/reviews/invalidReviewId/comments")
      .send( { username: "mallionaire", body: "message body"})
      .expect(400)
      .then(({body}) => {
        const {msg} = body
          expect(msg).toBe("Invalid review id")
      })
  })
  test('404: Should return an error for valid but not existent review_id', () => {
    return request(app)
    .post("/api/reviews/123456/comments")
    .send( { username: "mallionaire", body: "message body"})
    .expect(404)
    .then(({body}) => {
      const {msg} = body
        expect(msg).toBe("Review Id not found")
    })
})
    test("400: responds with a 400 when there is missing information on body", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({username: "mallionaire"})
        .expect(400)
        .then(({body}) => {
          const {msg} = body
          expect(msg).toBe("Please enter a comment and username");
        });
    });
    test("400: responds with a 400 when there is missing information on username", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({body: "There is no username here"})
        .expect(400)
        .then(({body}) => {
          const {msg} = body
          expect(msg).toBe("Please enter a comment and username");
        });
    });
    test("404: Responds with a 404 with a non-existent username on db", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({ username: "RyderRoo", body: "I am not a username"})
        .expect(404)
        .then(({body}) => {
          const {msg} = body
          expect(msg).toBe("This is not a user");
        });
    });
  });
  describe("8. Get /api/reviews (queries)", () => {
    test("200: sort_by, which sorts the reviews by any valid column (defaults to date)", () => {
      "valid columns: title, designer, owner, review_body , category, votes, created_at";
      return request(app)
        .get("/api/reviews")
        .query({sort_by: "votes"})
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSorted({key: "votes", descending: true});
        });
    });
    test("200: collect a 200 status which accepts order query ?order=desc", () => {
      "valid columns: title, designer, owner, review_body , category, votes, created_at";
      return request(app)
        .get("/api/reviews")
        .query({sort_by: "created_at", order: "DESC"})
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSorted({ key: "created_at", descending: true });
        });
    });
    test("200: collect a 200 status which accepts order query ?order=asc", () => {
      "valid columns: title, designer, owner, review_body , category, votes, created_at";
      return request(app)
        .get("/api/reviews")
        .query({sort_by: "created_at", order: "ASC"})
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSorted( {key: "created_at", descending: false });
        });
    });
    test("200: Collect a 200 status, accepts category query", () => {
      return request(app)
        .get("/api/reviews")
        .query({sort_by: "created_at", order: "ASC", category: "dexterity" })
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
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
    test('200: category is valid yet there are no reviews ', () => { 
      return request(app)
      .get("/api/reviews")
      .query({sort_by: "created_at", order: "ASC", category: "animals" })
      .expect(200)
      .then(({body})=> {
        const {reviews} = body
        expect(reviews.length).toBe(0)
         expect(body).toEqual({reviews: []})
      })
     })
    test("400: Responds with a 400 for invalid sort_by query", () => {
      return request(app)
        .get("/api/reviews")
        .query({sort_by: "inValidSortBy", order: "ASC", category: "dexterity"})
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Invalid sort query, try again.");
        });
    });
    test("400: should return status: 400 for invalid order query", () => {
      return request(app)
        .get("/api/reviews")
        .expect(400)
        .query({sort_by: "review_id", order: "invalidOrderQuery", category: "dexterity"})
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order query, try again");
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
 
  
  describe("12. DELETE /api/comments/:comment_id", () => {
    test("should respond with status:400 comment_id is not a number", () => {
      return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid review id");
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
