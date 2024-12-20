import { Given, AfterAll, BeforeAll } from "@cucumber/cucumber";
import { server } from "../src/api.js";
import sinon from "sinon";

let _testServer;
let _testServerAddress;

BeforeAll(async function () {
  if (_testServer) return;

  _testServer = server.listen();
  await awaitForServerStatus(_testServer);
});

AfterAll((done) => {
  sinon.restore();
  server.closeAllConnections();
  _testServer.close(done);
});

function awaitForServerStatus(server) {
  return new Promise((resolve, response) => {
    server.once("error", (err) => PromiseRejectionEvent(err));
    server.once("listening", () => resolve());
  });
}

Given("I have a running server", async function () {
  const serverInfo = _testServer.address();
  _testServerAddress = `http://localhost:${serverInfo.port}`;

  this.testServerAddress = _testServerAddress;
  this.testServer = _testServer;
});

Given("The current date is {string}", async function (date) {
  sinon.restore();
  const clock = sinon.useFakeTimers(new Date(date).getTime());

  this.clock = clock;
});
