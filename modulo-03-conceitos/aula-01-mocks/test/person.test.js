import { describe, it, expect, jest } from "@jest/globals";
import Person from "../src/person.js";

describe("#Person Suite", () => {
  describe("#validate", () => {
    it("should throw if name is not present", () => {
      const mockInvalidPerson = {
        name: "",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("name is required")
      );
    });
    it("should throw if cpf is not present", () => {
      const mockInvalidPerson = {
        name: "Jhon Doe",
        cpf: "",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("cpf is required")
      );
    });
    it("should not throw if person is valid", () => {
      const mockInvalidPerson = {
        name: "Jhon Doe",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockInvalidPerson)).not.toThrow();
    });
  });

  describe("#format", () => {
    it("should format the person's name and cpf", () => {
      //Arrange
      const mockPerson = {
        name: "Jhon Doe Smith",
        cpf: "123.456.789-00",
      };

      //Act
      const formatedPerson = Person.format(mockPerson);

      //Assert
      const expected = {
        name: "Jhon",
        cpf: "12345678900",
        lastName: "Doe Smith",
      };

      expect(formatedPerson).toStrictEqual(expected);
    });
  });

  describe("#savePerson", () => {
    it("should throw if person is invalid", () => {
      const mockPerson = {
        name: "JhonDoe",
        cpf: "123.456.789-00",
      };

      const formatedPerson = Person.format(mockPerson);

      expect(() => Person.savePerson(formatedPerson)).toThrow(
        new Error(
          `cannot save! Invalid person: ${JSON.stringify(formatedPerson)}`
        )
      );
    });

    it("should not throw if person is valid", () => {
      const mockPerson = {
        name: "Jhon Doe",
        cpf: "123.456.789-00",
      };

      const formatedPerson = Person.format(mockPerson);

      expect(() => Person.savePerson(formatedPerson)).not.toThrow();
    });
  });

  describe("#process", () => {
    it("should process a valid person", () => {
      const mockPerson = {
        name: "Jhon Doe",
        cpf: "123.456.789-00",
      };

      jest.spyOn(Person, Person.validate.name).mockReturnValue();

      jest.spyOn(Person, Person.format.name).mockReturnValue({
        name: "Jhon",
        cpf: "12345678900",
        lastName: "Doe",
      });

      const result = Person.process(mockPerson);
      const expected = "ok";

      expect(result).toStrictEqual(expected);
    });
  });
});
