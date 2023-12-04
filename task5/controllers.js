// controllers.js
const {
    getUsersData,
    addUserData,
    updateUserData,
    deleteUserData,
    getUserByIdData,
    addHobbyData,
    deleteHobbyData,
    getUserHobbiesData,
} = require("./data");

// User controllers
function getUsers(req, res) {
    // Implement logic to retrieve a list of users (excluding hobbies)
    // ...
}

function createUser(req, res) {
    // Implement logic to create a new user
    // ...
}

// Other user-related controllers (e.g., updateUser, deleteUser)

// Hobby controllers
// Implement functions for handling hobby-related operations
// ...
