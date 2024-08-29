const express = require('express');
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
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

require("./app/routes/course.route")(app);
require("./app/routes/lesson.route")(app);

const port = 3003;

app.listen(port, () => {
    console.log(`User service running on port ${port}`);
});
