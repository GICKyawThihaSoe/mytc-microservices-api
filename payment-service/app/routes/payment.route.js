module.exports = app => {
    const courses = require("../controllers/payment.controller.js");
    const router = require("express").Router();

    // Create a new Course
    router.post("/create", courses.create);

    // Retrieve all Courses
    router.get("/", courses.findAll);

    // Retrieve a single Course with id
    router.get("/:id", courses.findOne);

    // Enroll a student in a course
    router.post("/enroll", courses.enroll);

    app.use("/", router);
};
