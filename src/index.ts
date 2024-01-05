import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

import authRoutes from './routes/auth';

const app = express();
const port: number = 3000;

app.use(express.json());

//Endpoint for authentication
app.use('/api/auth', authRoutes);

//Endpoint for swagger documentation
const swaggerDocument = yaml.load(path.join(__dirname, "swagger.yaml"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Test endpoint
app.get("/", (req: Request, res: Response) => {
    res.send("Hello, Express with TypeScript!");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
