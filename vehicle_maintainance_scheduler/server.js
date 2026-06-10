const express = require("express");

const schedulerRoutes = require("./src/routes/scheduler.routes");

const app = express();

app.use(express.json());

app.use("/api", schedulerRoutes);

app.listen(5000, () => {
    console.log("Server Running");
});