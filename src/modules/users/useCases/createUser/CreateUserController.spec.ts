import { app } from "../../../../app";
import request from "supertest";
import createConnection from "../../../../database"
import { Connection } from "typeorm";


let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Misael Lopes",
      email: "admin@rentx.com",
      password: "admin",
    });

    expect(response.status).toBe(201)
  });
  
});
