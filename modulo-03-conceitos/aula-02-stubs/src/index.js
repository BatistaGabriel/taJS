import Service from "./service.js";

const data = {
  userName: `gibimba-${Date.now()}`,
  password: "superSecretPassword",
};

const service = new Service({
  fileName: "./users.ndjson",
});

await service.create(data);
const users = await service.read();

console.log("users", users);
