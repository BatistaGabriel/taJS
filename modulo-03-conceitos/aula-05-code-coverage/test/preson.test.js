import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { mapPerson } from "../src/person.js";

describe("Person Test Suite", () => {
  describe("happy path", () => {
    it("should map person given valid JSON string", () => {
      const personString = '{"name":"John Doe","age":30}';
      const personObject = mapPerson(personString);

      expect(personObject).toEqual({
        name: "John Doe",
        age: 30,
        createdAt: expect.any(Date),
      });
    });
  });

  describe("what coverage doesn't tell you", () => {
    it("should not map person given invalid JSON string", () => {
      const personString = '{"name":';

      expect(() => mapPerson(personString)).toThrow(
        "Unexpected end of JSON input"
      );
    });

    it("should not map person given invalid JSON data", () => {
      const personString = "{}";
      const personObject = mapPerson(personString);

      expect(personObject).toEqual({
        name: undefined,
        age: undefined,
        createdAt: expect.any(Date),
      });
    });
  });
});
