import EventEmitter from "./task3/EventEmitter.js";
import WithTime from "./task3/WithTime.js";
import csvToJson from "./csvToJson.js";

//TASK 3.1
const myEmitter = new EventEmitter();

function c1() {
    console.log("an event occurred!");
}

function c2() {
    console.log("yet another event occurred!");
}

myEmitter.on("eventOne", c1); // Register for eventOne
myEmitter.on("eventOne", c2); // Register for eventOne

// Register eventOnce for one time execution
myEmitter.once("eventOnce", () => console.log("eventOnce once fired"));
myEmitter.once("init", () => console.log("init once fired"));

// Register for 'status' event with parameters
myEmitter.on("status", (code, msg) => console.log(`Got ${code} and ${msg}`));

myEmitter.emit("eventOne");

// Emit 'eventOnce' -> After this the eventOnce will be
// removed/unregistered automatically
myEmitter.emit("eventOnce");

myEmitter.emit("eventOne");
myEmitter.emit("init");
myEmitter.emit("init"); // Will not be fired
myEmitter.emit("eventOne");
myEmitter.emit("status", 200, "ok");

// Get listener's count
console.log(myEmitter.listenerCount("eventOne"));

// Get array of rawListeners//
// Event registered with 'once()' will not be available here after the
// emit has been called
console.log(myEmitter.rawListeners("eventOne"));

// Get listener's count after remove one or all listeners of 'eventOne'
myEmitter.off("eventOne", c1);
console.log(myEmitter.listenerCount("eventOne"));
myEmitter.off("eventOne", c2);
console.log(myEmitter.listenerCount("eventOne"));
/*

*/
//TASK 3.2
const withTime = new WithTime();

withTime.on("begin", () => console.log("About to execute"));
withTime.on("end", () => console.log("Done with execute"));
withTime.on("data", (data) => console.log("Data received:", data));

withTime.execute(async () => {
    return withTime.fetchData("https://jsonplaceholder.typicode.com/posts/1");
});
/*

*/
//TASK 3.3
//IMPORTANT: To test this task please check the existent csv file and
//the txt that should be created in the folder task3 after running the following function
csvToJson();
