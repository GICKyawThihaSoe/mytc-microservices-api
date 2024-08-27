const { teacherauthenticateToken, studentauthenticateToken } = require("../config/middleware.js");


module.exports = app => {
    const courses = require("../controllers/course.controller.js");
    const router = require("express").Router();

    // Create a new Course
    router.post("/create", teacherauthenticateToken,courses.create);

    // Retrieve all Courses
    router.get("/",courses.findAll);

    // Retrieve a single Course with id
    router.get("/:id",courses.findOne);

    // Enroll a student in a course
    router.post("/enroll", studentauthenticateToken,courses.enroll);

    app.use("/", router);
};
