let server;
const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

describe("auth middleware", () => {
    beforeEach(() => {
      server = require("../../index");
    });
    afterEach(async () => {
      await Genre.deleteMany({});
      await server.close();
    });

  let token;
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .send({ name: "genre1" })
      .set("x-auth-token", token);
    };
    
    beforeEach(() => {
      token = new User().generateAuthToken();
    })

  it("should return 401 if token is provided ", async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid ", async () => {
    token = null;
    const res = await exec();
    expect(res.status).toBe(400);

  });

  it("should return 200 if token is valid ", async () => {
    // token = ;
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
