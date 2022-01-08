import { app } from "../../../../app";
import request from "supertest";
import createConnection from "../../../../database";
import { Connection } from "typeorm";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new deposit", async () => {
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
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Deposit Amount SuperTest",
      })
      .set({
        authorization: `Baerer ${authResponse.body.token}`,
      });

    expect(response.status).toEqual(201);
    expect(response.body.type).toEqual("deposit");
  });

  it("should be able to create a withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Misael Lopes",
      email: "test@rentx.com",
      password: "admin",
    });

    const authResponse = await request(app).post("/api/v1/sessions").send({
      email: "test@rentx.com",
      password: "admin",
    });

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Deposit Amount SuperTest",
      })
      .set({
        authorization: `Baerer ${authResponse.body.token}`,
      });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Withdraw Amount SuperTest",
      })
      .set({
        authorization: `Baerer ${authResponse.body.token}`,
      });

    expect(response.status).toEqual(201);
    expect(response.body.type).toEqual("withdraw");
  });

});
