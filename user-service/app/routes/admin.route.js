module.exports = app => {
    const admins = require("../controllers/admin.controller");
  
    const router = require("express").Router();
  
    // Create a new Teacher
    router.post("/register", admins.create);

    router.post("/login", admins.login);
  
    app.use("/admins", router);
  };