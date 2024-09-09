const express = require('express');
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require("./app/models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to mytc." });
});

require("./app/routes/student.route")(app);
require("./app/routes/teacher.route")(app);
require("./app/routes/admin.route")(app);

const port = 3001;

app.listen(port, () => {
    console.log(`User service running on port ${port}`);
});
