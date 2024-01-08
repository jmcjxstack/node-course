import express, { Request, Response, Express } from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

import authRouter from "./routes/auth";

// Create server
const app: Express = express();
const port: number = 3000;

// Middleware to parse requests
app.use(express.json());

// Router for authentication (both register and login)
app.use("/api/auth", authRouter);

// Load swagger.yaml to use in docs endpoint
const swaggerDocument = yaml.load(path.join(__dirname, "swagger.yaml"));

// Endpoint for swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Test endpoint
app.get("/", (req: Request, res: Response) => {
	res.send(`Hello world!`);
});

// Listen for connections
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
