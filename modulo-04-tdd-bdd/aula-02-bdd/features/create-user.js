import { BeforeStep, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";

let _serverAddress = "";
let _context = {};

BeforeStep(function () {
  _serverAddress = this.testServerAddress;
});

function createUser(data) {
  return fetch(`${_serverAddress}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function findUserById(id) {
  const user = await fetch(`${_serverAddress}/users/${id}`);
  return user.json();
}

When(
  "I create a new user with the following details:",
  async function (params) {
    const [data] = params.hashes();
    const response = await createUser(data);

    assert.strictEqual(response.status, 201);

    _context.userData = await response.json();
    assert.ok(_context.userData.id);
  }
);

Then("I request the API with the user's ID", async function () {
  const user = await findUserById(_context.userData.id);
  _context.createdUser = user;
});

Then(
  "I should receive a JSON response with the user's details",
  async function () {
    const expectedKeys = ["name", "birthday", "id", "category"];
    assert.deepStrictEqual(
      Object.keys(_context.createdUser).sort(),
      expectedKeys.sort()
    );
  }
);

Then("The user's category should be {string}", async function (category) {
  assert.ok(_context.createdUser.category === category);
});
