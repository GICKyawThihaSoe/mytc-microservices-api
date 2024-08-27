module.exports = app => {
    const students = require("../controllers/student.controller.js");
  
    const router = require("express").Router();
  
    // Create a new Student
    router.post("/register", students.create);

    router.post("/login", students.login);

    router.post("/validate-token", students.studentvalidateToken);

    // Retrieve all Students
    router.get("/", students.findAll);
  
    // Retrieve a single Student with id
    router.get("/:id", students.findOne);
  
    // Update a Student with id
    router.put("/:id", students.update);
  
    // Delete a Student with id
    router.delete("/:id", students.delete);
  
    // Create a new Student
    router.delete("/", students.deleteAll);
  
    app.use("/students", router);
  };