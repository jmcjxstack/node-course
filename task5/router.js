const {
    createUser,
    deleteUser,
    updateUser,
    getUserById,
    getUsers,
    addHobby,
    deleteHobby,
    getUserHobbies,
} = require("./controllers");

function handleRequest(req, res) {
    const { method, url } = req;

    // Users endpoint
    if (url.startsWith("/users")) {
        if (method === "GET") {
            getUsers(req, res);
        } else if (method === "POST") {
            createUser(req, res);
        } else {
            // Handle other user-related operations (e.g., update, delete)
            // ...
        }
    }

    // Hobbies endpoint
    else if (url.startsWith("/hobbies")) {
        // Handle hobby-related operations
        // ...
    }

    // Invalid endpoint
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Not Found" }));
    }
}

module.exports = { handleRequest };
