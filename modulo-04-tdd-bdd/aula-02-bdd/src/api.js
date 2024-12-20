import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { createServer } from "node:http";
const usersDb = [];

function getUserCategory(birthday) {
  const age = new Date().getFullYear() - new Date(birthday).getFullYear();
  if (age < 18) {
    throw new Error("User must be 18 years old, or older.");
  }

  if (age >= 18 && age <= 25) {
    return "young-adult";
  }

  if (age >= 26 && age <= 50) {
    return "adult";
  }

  if (age >= 51) {
    return "senior";
  }

  return "";
}

const server = createServer(async (request, response) => {
  try {
    if (request.url === "/users" && request.method === "POST") {
      const requestUser = JSON.parse(await once(request, "data"));
      const newUser = {
        ...requestUser,
        id: randomUUID(),
        category: getUserCategory(requestUser.birthday),
      };

      usersDb.push(newUser);

      response.writeHead(201, {
        "Content-Type": "application/json",
      });
      response.end(
        JSON.stringify({
          id: newUser.id,
        })
      );
      return;
    }

    if (request.url.startsWith("/users") && request.method === "GET") {
      const [, , id] = request.url.split("/");
      if (id === undefined || id === null || id.trim() === "") {
        response.writeHead(400);
        response.end();
        return;
      }

      const user = usersDb.find((user) => user.id === id);
      if (!user) {
        response.writeHead(404);
        response.end();
        return;
      }

      response.writeHead(200, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify(user));
      return;
    }
  } catch (error) {
    if (error.message.includes("18 years old")) {
      response.writeHead(400, {
        "Content-Type": "application/json",
      });
      response.end(
        JSON.stringify({
          message: error.message,
        })
      );
      return;
    }

    response.end("Something bad happen");
  }

  response.writeHead(405);
  response.end();
});

export { server };
