const axios = require('axios');

const teacherauthenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: "Access Denied. No token provided." });
    }
    try {
        const response = await axios.post('http://localhost:8000/users/teachers/validate-token', { token });
        req.user = response.data.user;
        next();
    } catch (err) {
        return res.status(403).send({ message: "Invalid Teacher Token" });
    }
};

const studentauthenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: "Access Denied. No token provided." });
    }
    try {
        const response = await axios.post('http://localhost:8000/users/students/validate-token', { token });
        req.user = response.data.user;
        next();
    } catch (err) {
        return res.status(403).send({ message: "Invalid Student Token" });
    }
};

module.exports = {
    teacherauthenticateToken,
    studentauthenticateToken,
};
