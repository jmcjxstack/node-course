const { createUser, deleteUser, updateUser, getUserById, getUsers, addHobby, deleteHobby, getUserHobbies } = require('./controllers');

function handleRequest(req, res) {
    const { method, url } = req;

    // Users endpoint
    if (url.startsWith('/users')) {
        const userIdRegex = /\/users\/(\d+)/;
        const userIdMatch = url.match(userIdRegex);

        if (method === 'GET' && userIdMatch) {
            const userId = parseInt(userIdMatch[1]);
            getUserById(req, res, userId);
        } else if (method === 'GET') {
            getUsers(req, res);
        } else if (method === 'POST') {
            createUser(req, res);
        } else if (method === 'DELETE') {
            deleteUser(req, res);
        } else if (method === 'PATCH') {
            updateUser(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Method Not Allowed' }));
        }
    }

    // Hobbies endpoint
    else if (url.startsWith('/hobbies')) {
        const userIdRegex = /\/hobbies\/(\d+)/;
        const userIdMatch = url.match(userIdRegex);

        if (method === 'GET' && userIdMatch) {
            const userId = parseInt(userIdMatch[1]);
            getUserHobbies(req, res, userId);
        } else if (method === 'POST') {
            addHobby(req, res);
        } else if (method === 'DELETE') {
            deleteHobby(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Method Not Allowed' }));
        }
    }

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
}

module.exports = { handleRequest };