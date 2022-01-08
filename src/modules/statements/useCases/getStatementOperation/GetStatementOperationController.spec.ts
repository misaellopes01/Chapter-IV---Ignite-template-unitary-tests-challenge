import { app } from "../../../../app";
import request from "supertest";
import createConnection from "../../../../database";
import { Connection } from "typeorm";

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get the statement operation", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Misael Lopes",
      email: "test@rentx.com",
      password: "admin",
    });

    const authResponse = await request(app).post("/api/v1/sessions").send({
      email: "test@rentx.com",
      password: "admin",
    });

    const createdStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Deposit Amount SuperTest",
      })
      .set({
        authorization: `Baerer ${authResponse.body.token}`,
      });

    const statement_id = createdStatement.body.id

    const response = await request(app)
        .get(`/api/v1/statements/${statement_id}`)
        .send()
        .set({
            authorization: `Baerer ${authResponse.body.token}`,
        });

    expect(response.status).toEqual(200);
    expect(response.body.statement_id).toEqual(createdStatement.body.statement);
    expect(response.body.user_id).toEqual(authResponse.body.user.id);
  });

});
