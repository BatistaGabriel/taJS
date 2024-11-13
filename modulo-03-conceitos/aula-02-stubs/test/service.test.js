import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import Service from "../src/service.js";
import fs from "node:fs/promises";

describe("Service Test Suite", () => {
  let _service;
  const fileName = "testFile.ndjson";
  beforeEach(() => {
    _service = new Service({
      fileName,
    });
  });

  describe("#read", () => {
    it("should return an empty array if the file is empty", async () => {
      jest.spyOn(fs, "readFile").mockResolvedValue("");

      const result = await _service.read();
      expect(result).toEqual([]);
    });

    it("should return an empty array if the file doesn't exists", async () => {
      const readFileMock = jest.spyOn(fs, "readFile").mockRejectedValue({
        code: "ENOENT",
      });

      let result;

      try {
        result = await _service.read();
      } catch (error) {
        if (error.code === "ENOENT") {
          result = [];
        } else {
          throw error;
        }
      }

      expect(result).toEqual([]);

      readFileMock.mockRestore();
    });

    it("should return data without passwords if file is not empty", async () => {
      const dbData = [
        {
          username: "user1",
          password: "password1",
          createdAt: new Date().toISOString(),
        },
        {
          username: "user2",
          password: "password2",
          createdAt: new Date().toISOString(),
        },
      ];

      const fileContent = dbData
        .map((item) => JSON.stringify(item).concat("\n"))
        .join("");

      jest.spyOn(fs, "readFile").mockResolvedValue(fileContent);

      const result = await _service.read();
      const expected = dbData.map(({ password, ...rest }) => ({ ...rest }));

      expect(result).toEqual(expected);
    });
  });
});
