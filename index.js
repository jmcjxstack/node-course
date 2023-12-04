//TASK 5
const http = require("http");
const { handleRequest } = require("./router");

const server = http.createServer(handleRequest);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
