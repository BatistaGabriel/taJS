class Person {
  static validate(person) {
    if (!person.name) throw new Error("name is required");
    if (!person.cpf) throw new Error("cpf is required");
  }

  static format(person) {
    const [firstName, ...lastName] = person.name.split(" ");
    return {
      cpf: person.cpf.replace(/\D/g, ""),
      name: firstName,
      lastName: lastName.join(" "),
    };
  }

  static savePerson(person) {
    if (!["cpf", "name", "lastName"].every((prop) => person[prop])) {
      throw new Error(`cannot save! Invalid person: ${JSON.stringify(person)}`);
    }

    console.log("successfully saved!", person);
  }

  static process(person) {
    this.validate(person);

    const formatedPerson = this.format(person);
    this.savePerson(formatedPerson);

    return "ok";
  }
}

export default Person;
