const { teacherauthenticateToken } = require("../config/middleware.js");


module.exports = app => {
    const lessons = require("../controllers/lesson.controller.js");
    const router = require("express").Router();

    // Create a new Course
    router.post("/create", teacherauthenticateToken,lessons.create);
    router.get("/courseId/:courseId", teacherauthenticateToken,lessons.findWithCourseId);

    app.use("/lessons", router);
};
