module.exports = app => {
    const transitions = require("../controllers/transition.controller.js");
    const router = require("express").Router();

    // Create a new Transition
    router.post("/create", transitions.create);

    // Retrieve all Courses
    router.get("/", transitions.findAll);

    // Retrieve a single transitions with id
    router.get("/:teacherId", transitions.findOne);

    app.use("/", router);
};
