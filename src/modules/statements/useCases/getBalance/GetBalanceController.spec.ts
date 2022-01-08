import { app } from "../../../../app";
import request from "supertest";
import createConnection from "../../../../database";
import { Connection } from "typeorm";

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get the balance", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Misael Lopes",
      email: "test@rentx.com",
      password: "admin",
    });

    const authResponse = await request(app).post("/api/v1/sessions").send({
      email: "test@rentx.com",
      password: "admin",
    });

    const response = await request(app)
        .get("/api/v1/statements/balance")
        .send()
        .set({
            authorization: `Baerer ${authResponse.body.token}`,
        });

    expect(response.status).toEqual(200);
    expect(response.body.balance).toEqual(0);
  });

});
