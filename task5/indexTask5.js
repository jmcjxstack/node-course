//TASK 5
const http = require("http");
const { handleRequest } = require("./router");

const server = http.createServer(handleRequest);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/*
The optional tasks were implemented

To add a hobby for a specific user, make a POST request
at /hobbies/${userId} with the following body
{
    "hobby": "HOBBY"
}

for example to add swimming as a hobby to user with id 2
make a POST request to /hobbies/2

{
    "hobby": "swimming"
}

To delete a hobby from a specific user, make a DELETE request
at /hobbies/${userId}/${hobby_name} 

for example to delete swimming as a hobby from user with id 2
make a DELETE request to /hobbies/2/swimming
*/