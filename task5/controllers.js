const { getUsersData, addUserData, updateUserData, deleteUserData, getUserByIdData, addHobbyData, deleteHobbyData, getUserHobbiesData } = require('./data');

// User controllers
function getUsers(req, res) {
    const users = getUsersData();
    const usersWithLinks = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        links: [
            { rel: 'self', href: `/users/${user.id}` },
            { rel: 'hobbies', href: `/hobbies/${user.id}` },
        ],
    }));

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
    });
    res.end(JSON.stringify(usersWithLinks));
}

function getUserById(req, res) {
    const userId = parseInt(req.url.split('/users/')[1]);
    const user = getUserByIdData(userId);
    if (user) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
        });
        res.end(JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
    }
}

function createUser(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const user = JSON.parse(body);
        const newUser = addUserData(user);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
    });
}

function updateUser(req, res) {
    const userId = parseInt(req.url.split('/users/')[1]);
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const updatedUser = updateUserData(userId, JSON.parse(body));
        if (updatedUser) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    });
}

function deleteUser(req, res) {
    const userId = parseInt(req.url.split('/users/')[1]);
    const deletedUser = deleteUserData(userId);
    if (deletedUser) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deletedUser));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
    }
}


// Hobby controllers
function addHobby(req, res) {
    const userId = parseInt(req.url.split('/hobbies/')[1]);
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const hobby = JSON.parse(body).hobby;
        const newHobbies = addHobbyData(userId, hobby);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newHobbies));
    });
}

function deleteHobby(req, res) {
    const userId = parseInt(req.url.split('/hobbies/')[1]);
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const hobby = req.url.split('/').pop();

        const updatedHobbies = deleteHobbyData(userId, hobby);
        if (updatedHobbies) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedHobbies));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Hobby not found for the user' }));
        }
    });
}


function getUserHobbies(req, res) {
    const userId = parseInt(req.url.split('/hobbies/')[1]);
    const hobbies = getUserHobbiesData(userId);
    if (hobbies) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(hobbies));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found or user has no hobbies' }));
    }
}

module.exports = { getUsers, createUser, updateUser, deleteUser, getUserById, addHobby, deleteHobby, getUserHobbies };