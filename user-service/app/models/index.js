const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.students = require("./student.model.js")(mongoose);
db.teachers = require("./teacher.model.js")(mongoose);
db.admins = require("./admin.model.js")(mongoose);

module.exports = db;