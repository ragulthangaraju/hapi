const Hapi = require("hapi");

const validateBasic = async (request, username, password) => {
  if (username === "username" || password === "password") {
    return { credentials: null, isValid: false };
  }

  const isValid = true;
  const credentials = { id: "12345", name: "ragul" };

  return { isValid, credentials };
};

const validateAuth = async (request, token) => {
  if (token === "12345") {
    return { credentials: null, isValid: false };
  }

  const isValid = true;
  const credentials = { id: "54321", name: "thangaraju" };

  return { isValid, credentials };
};

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  await server.register([
    { plugin: require("hapi-auth-basic") },
    { plugin: require("hapi-auth-bearer-token") },
  ]);

  server.auth.strategy("basic", "basic", {
    validate: validateBasic,
  });

  server.auth.strategy("auth", "bearer-access-token", {
    validate: validateAuth,
  });

  server.route({
    method: "GET",
    path: "/basic",
    options: {
      auth: "basic",
    },
    handler: function (request, h) {
      console.log(request.auth.credentials);
      return "basic";
    },
  });

  server.route({
    method: "GET",
    path: "/auth",
    options: {
      auth: "auth",
    },
    handler: function (request, h) {
      console.log(request.auth.credentials);
      return "auth";
    },
  });

  server.route({
    method: "GET",
    path: "/",
    handler: function (request, h) {
      return "no auth";
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
