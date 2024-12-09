import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve());
  });
}

describe("E2E Test Suite", () => {
  describe("E2E Tests for Server in a non-test env", () => {
    it("should start server with port 4000", async () => {
      const PORT_NUMBER = 4000;
      process.env.NODE_ENV = "production";
      process.env.PORT = PORT_NUMBER;

      jest.spyOn(console, console.log.name);

      const { default: server } = await import("../src/index.js");
      await waitForServerStatus(server);

      const serverInfo = server.address();
      expect(serverInfo.port).toBe(PORT_NUMBER);
      expect(console.log).toHaveBeenCalledWith(
        `server is running at ${serverInfo.address}:${serverInfo.port}`
      );

      return new Promise((resolve) => server.close(resolve));
    });
  });

  describe("E2E Tests for Server", () => {
    let _testServer;
    let _testServerAddress;

    beforeAll(async () => {
      process.env.NODE_ENV = "test";
      const { default: server } = await import("../src/index.js");
      _testServer = server.listen();
      await waitForServerStatus(_testServer);

      const serverInfo = _testServer.address();
      _testServerAddress = `http://localhost:${serverInfo.port}`;
    });

    afterAll(async () => {
      await new Promise((resolve, reject) => {
        _testServer.close((err) => (err ? reject(err) : resolve()));
      });
    });

    it("should return 404 for unsuported routes", async () => {
      const response = await fetch(`${_testServerAddress}/unsuported`, {
        method: "POST",
      });

      expect(response.status).toBe(404);
    });
    it("should return 400 and missing field message when body is missing cpf", async () => {
      const invalidPerson = {
        name: "John Doe",
        cpf: "",
      };
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.validationError).toEqual("cpf is required");
    });
    it("should return 400 and missing field message when body is missing name", async () => {
      const invalidPerson = {
        name: "",
        cpf: "123.123.123-12",
      };
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.validationError).toEqual("name is required");
    });
    it("should return 500 when body has an object with invalid data", async () => {
      const invalidPerson = {
        name: "johndoe",
        cpf: "123.123.123-12",
      };
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(500);
    });
    it("should run with valid payload", async () => {
      const validPerson = {
        name: "John Doe",
        cpf: "123.123.123-12",
      };
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(validPerson),
      });

      expect(response.status).toBe(200);
    });
  });
});
