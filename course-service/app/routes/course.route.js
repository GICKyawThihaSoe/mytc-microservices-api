const { teacherauthenticateToken, studentauthenticateToken } = require("../config/middleware.js");


module.exports = app => {
    const courses = require("../controllers/course.controller.js");
    const router = require("express").Router();

    // Create a new Course
    router.post("/create", teacherauthenticateToken,courses.create);

    // Retrieve all Courses
    router.get("/",courses.findAll);

    router.get("/teacherId/:teacherId", courses.findWithTeacherId);

    // Retrieve a single Course with id
    router.get("/:id",courses.findOne);

    // Update a Course with id
    router.put("/:id", courses.update);

    // Enroll a student in a course
    router.post("/enroll", studentauthenticateToken,courses.enroll);

    app.use("/", router);
};
