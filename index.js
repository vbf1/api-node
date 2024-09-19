const http = require("http");
const { randomUUID } = require("crypto");

const users = [];

const server = http.createServer((request, response) => {
  if (request.url === "/users") {
    if (request.method === "GET") {
      return response.end(JSON.stringify(users));
    }
    if (request.method === "POST") {
      request
        .on("data", (data) => {
          const dataConverter = JSON.parse(data);

          const user = {
            id: randomUUID(),
            ...dataConverter,
          };

          users.push(user);
        })
        .on("end", () => {
          return response.end(JSON.stringify(users));
        });
    }
  }
  if (request.url.startsWith("/users")) {
    if (request.method === "PUT") {
      const url = request.url;

      const splitUrl = url.split("/");

      const idUser = splitUrl[2];

      const userIndex = users.findIndex((user) => user.id === idUser);

      request
        .on("data", (data) => {
          const dataConverter = JSON.parse(data);

          users[userIndex] = {
            id: idUser,
            ...dataConverter,
          };
        })
        .on("end", () => {
          return response.end(JSON.stringify(users));
        });
    }
  }
});

server.listen(8080, () => console.log("Server is running in port 8080"));
