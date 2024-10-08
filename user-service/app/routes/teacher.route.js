module.exports = app => {
    const teachers = require("../controllers/teacher.controller.js");
  
    const router = require("express").Router();
  
    // Create a new Teacher
    router.post("/register", teachers.create);

    router.post("/login", teachers.login);

    router.post("/validate-token", teachers.teachervalidateToken);
  
    // Retrieve all Teachers
    router.get("/", teachers.findAll);
  
    // Retrieve a single Teacher with id
    router.get("/:id", teachers.findOne);
  
    // Update a Teacher with id
    router.put("/:id", teachers.update);
  
    // Delete a Teacher with id
    router.delete("/:id", teachers.delete);
  
    // Create a new Teacher
    router.delete("/", teachers.deleteAll);
  
    app.use("/teachers", router);
  };