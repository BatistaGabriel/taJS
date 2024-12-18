import { describe, beforeAll, afterAll, expect, it, jest } from "@jest/globals";
import { server } from "../src/api.js";

/**
 *  - Should create an user and define a category, where:
 *    - Young Adults:
 *      - Users from 18 - 25
 *    - Adults:
 *      - Users from 26 - 50
 *    - Senior:
 *      - Users 51+
 *    - Under-Age:
 *      - Throw an error
 */
describe("API Users E2E Suite", () => {
  let _testServer;
  let _testServerAddress;

  function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
      server.once("error", (err) => reject(err));
      server.once("listening", () => resolve());
    });
  }

  function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function findUserById(id) {
    const user = await fetch(`${_testServerAddress}/users/${id}`);
    return user.json();
  }

  beforeAll(async () => {
    _testServer = server.listen();
    await waitForServerStatus(_testServer);

    const serverInfo = _testServer.address();
    _testServerAddress = `http://localhost:${serverInfo.port}`;
  });

  afterAll((done) => {
    server.closeAllConnections();
    _testServer.close(done);
  });

  describe("Valid Age Range", () => {
    it("should create a new user assigned to the `young-adult` category", async () => {
      const expectedCategory = "young-adult";
      jest.useFakeTimers({ now: new Date("2024-12-18T00:00") });

      const response = await createUser({
        name: "Gabriel Batista",
        birthday: "2000-01-01",
      });

      expect(response.status).toBe(201);

      const result = await response.json();
      expect(result.id).not.toBeUndefined();

      const user = await findUserById(result.id);
      expect(user.category).toBe(expectedCategory);
    });
    it("should create a new user assigned to the `adult` category", async () => {
      const expectedCategory = "adult";
      jest.useFakeTimers({ now: new Date("2024-12-18T00:00") });

      const response = await createUser({
        name: "Gabriel Batista",
        birthday: "1980-01-01",
      });

      expect(response.status).toBe(201);

      const result = await response.json();
      expect(result.id).not.toBeUndefined();

      const user = await findUserById(result.id);
      expect(user.category).toBe(expectedCategory);
    });
    it("should create a new user assigned to the `senior` category", async () => {
      const expectedCategory = "senior";
      jest.useFakeTimers({ now: new Date("2024-12-18T00:00") });

      const response = await createUser({
        name: "Gabriel Batista",
        birthday: "1970-01-01",
      });

      expect(response.status).toBe(201);

      const result = await response.json();
      expect(result.id).not.toBeUndefined();

      const user = await findUserById(result.id);
      expect(user.category).toBe(expectedCategory);
    });
  });

  describe("Invalid Age Range", () => {
    it("should throw `Error` for `under-age` users", async () => {
      jest.useFakeTimers({ now: new Date("2024-12-18T00:00") });

      const response = await createUser({
        name: "Gabriel Batista",
        birthday: "2010-01-01",
      });
      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.message).toBe("User must be 18 years old, or older.");
    });
  });
});
