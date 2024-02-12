let users = [
    {
        id: 1,
        name: "Ann",
        email: "ann@google.com",
        hobbies: ["books", "sport", "dancing"],
    },
    {
        id: 2,
        name: "Ben",
        email: "ben@google.com",
        hobbies: ["series", "sport"],
    },
];

// User data functions
function getUsersData() {
    return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        hobbies: user.hobbies,
    }));
}

function addUserData(user) {
    const newUser = {
        id: users.length + 1,
        name: user.name,
        email: user.email,
        hobbies: user.hobbies || [],
    };

    users.push(newUser);
    return newUser;
}

function updateUserData(userId, updatedUserData) {
    const index = users.findIndex((user) => user.id === userId);

    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUserData };
        return users[index];
    }

    return null;
}

function deleteUserData(userId) {
    const index = users.findIndex((user) => user.id === userId);

    if (index !== -1) {
        const deletedUser = users.splice(index, 1)[0];
        return deletedUser;
    }

    return null;
}

function getUserByIdData(userId) {
    return users.find((user) => user.id === userId) || null;
}

// Hobby data functions
function addHobbyData(userId, hobby) {
    const user = users.find((user) => user.id === userId);

    if (user) {
        user.hobbies.push(hobby);
        return user.hobbies;
    }

    return null;
}

function deleteHobbyData(userId, hobby) {
    const user = users.find((user) => user.id === userId);

    if (user && user.hobbies.includes(hobby)) {
        user.hobbies = user.hobbies.filter((h) => h !== hobby);
        return user.hobbies;
    }

    return null;
}

function getUserHobbiesData(userId) {
    const user = users.find((user) => user.id === userId);

    if (user) {
        return user.hobbies;
    }

    return null;
}

module.exports = {
    getUsersData,
    addUserData,
    updateUserData,
    deleteUserData,
    getUserByIdData,
    addHobbyData,
    deleteHobbyData,
    getUserHobbiesData,
};
