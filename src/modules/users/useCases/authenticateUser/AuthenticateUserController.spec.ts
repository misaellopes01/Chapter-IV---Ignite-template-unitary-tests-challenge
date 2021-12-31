import { app } from "../../../../app";
import request from "supertest";
import createConnection from "../../../../database"
import { Connection } from "typeorm";


let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Misael Lopes",
      email: "admin@rentx.com",
      password: "admin",
    });

    const authResponse = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    })

    expect(authResponse.body.user.name).toEqual("Misael Lopes")
    expect(authResponse.body).toHaveProperty("token")
  });

  it("should not be able to authenticate a non-existing user", async () => {
    const authResponse = await request(app).post("/api/v1/sessions").send({
        email: "user@rentx.com",
        password: "admin",
      })
  
      expect(authResponse.status).toBe(401)
  });
});
