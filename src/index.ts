import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";
import cors from "cors";

import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import cartRouter from "./routes/cart";
import { AppDataSource } from "./data-source";

// Establish database connection
AppDataSource.initialize()
	.then(() => {
		console.log("Data Source has been initialized!");
	})
	.catch((err) => {
		console.error("Error during Data Source initialization:", err);
	});

// Create server
const app: Express = express();
const port: number = 3000;

// Middleware to use cors
app.use(cors());

// Middleware to parse requests
app.use(express.json());

// Router for authentication (both register and login)
app.use("/api/auth", authRouter);

// Router for products (list of products and specific product)
app.use("/api/products", productsRouter);

// Router for cart (get cart, update cart, empty cart and create order)
app.use("/api/profile/cart", cartRouter);

// Load swagger.yaml to use in docs endpoint
const swaggerDocument = yaml.load(path.join(__dirname, "swagger.yaml"));

// Endpoint for swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Listen for connections
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
