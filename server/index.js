const path = require("path");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cron = require("node-cron");

const socketio = require("socket.io");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const { createUser } = require("./authHandlers/createUser");
const { createProject } = require("./projectHandlers/createProject");
const { getProjects } = require("./projectHandlers/getProjects");
const { editProject } = require("./projectHandlers/editProject");
const { getAllUsers } = require("./userHandlers/getAllUsers");
const { assignTenant } = require("./projectHandlers/assignTenant");

const { addAuthUser } = require("./authHandlers/addAuthUser");
const { AuthRegister } = require("./authHandlers/AuthRegister");
const { loginAuthUser } = require("./authHandlers/loginAuthUser");
const { addMonthlyRent } = require("./projectHandlers/addMonthlyRent");
const { resetRentOwed } = require("./projectHandlers/resetRentOwed");
const { processRentPayment } = require("./projectHandlers/processRentPayment");
const { getTenantUnit } = require("./userHandlers/getTenantUnit");
const { editTenant } = require("./userHandlers/editTenant");
const { getUser } = require("./userHandlers/getUser");
const { logoutAuthUser } = require("./authHandlers/logoutAuthUser");
const { passwordReset } = require("./authHandlers/passwordReset");
const { signalIssue } = require("./projectHandlers/signalIssue");
const { getVisitorProjects } = require("./projectHandlers/getVisitorProjects");
// issues
const { createIssue } = require("./projectHandlers/issuesHandlers/createIssue");
const { updateIssue } = require("./projectHandlers/issuesHandlers/updateIssue");
const {
  adjustRentAndResolve,
} = require("./projectHandlers/issuesHandlers/adjustRentAndResolve");
const { paymentHandler } = require("./paymentHandlers/paymentHandler");
const {
  debitPaymentHandler,
} = require("./paymentHandlers/debitPaymentHandler");
const { webhookListener } = require("./paymentHandlers/paymentWebhook");
const { paymentUpdate } = require("./paymentHandlers/paymentUpdate");
const { ActionCodeOperation } = require("firebase/auth");

const PORT = 4000 || process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "build")));
// app.use(bodyParser.json());
// app.use(express.json());

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(morgan("tiny"));

io.on("connection", (socket) => {});

/////////////////////////////////
////////////////CRON/////////////
// cron.schedule("*/5 * * * * *", addMonthlyRent); // <-- FOR TESTING
// cron.schedule("4 0 1 * *", addMonthlyRent); <--- FOR PRODUCTION --- TRIGGERS AT 12:04 EVERY 1ST OF THE MONTH
// util
app.post("/api/projects/resetRentOwed", resetRentOwed);
////////////////CRON/////////////
/////////////////////////////////

////////////////////////////////
/////////PROJECTS///////////////
app.get("/api/projects/getProjects", getProjects);
app.get("/api/projects/getVisitorProjects", getVisitorProjects);
app.post("/api/projects/createProject", createProject);
app.post("/api/projects/editProject", editProject);
app.post("/api/projects/assignTenant", assignTenant);
//// payments and issues
app.post("/api/projects/processRentPayment", processRentPayment);
app.post("/api/projects/createIssue/:id", createIssue);
app.post("/api/projects/updateIssue", updateIssue);
app.post("/api/projects/adjustAndResolve", adjustRentAndResolve);
/////////PROJECTS///////////////
////////////////////////////////

////////////////////////////////
////////////UNITS///////////////
app.post("/api/units/signal-issue", signalIssue);
////////////UNITS///////////////
////////////////////////////////

///////////PAYMENTS/////////////
app.post("/api/payments/payment", paymentHandler);
app.post("/api/payments/debit-payment", debitPaymentHandler);
app.post("/api/payments/webhook", webhookListener);

app.patch("/api/payments/get-balance", paymentUpdate);
///////////PAYMENTS/////////////

////////////////////////////////
////////////USERS///////////////
app.get("/api/users/getAllUsers", getAllUsers);
app.get("/api/users/getTenantUnit/:id", getTenantUnit);
app.get("/api/users/getUser/:email", getUser);
app.post("/api/auth/createUser/:id", createUser);
app.post("/api/users/editTenant", editTenant);
app.post("/api/users/addAuthUser", addAuthUser);
app.post("/api/users/registerUser", AuthRegister);
////////////USERS///////////////
////////////////////////////////

////////////////////////////////////
/////////AUTHENTICATION/////////////
app.post("/api/users/loginAuth", loginAuthUser);
app.get("/api/users/logout", logoutAuthUser);
app.get("/api/users/password-reset/:email", passwordReset);
///////////AUTHENTICATION///////////
////////////////////////////////////

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "This is not what you were looking for.",
  });
});

server.listen(PORT, () => console.info(`Listening on port ${PORT}.`));
