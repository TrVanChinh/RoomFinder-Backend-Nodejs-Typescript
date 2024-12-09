import express from "express";
import { Route } from "./core/interfaces";
import cors from "cors";
import pool from "./pool";
import bodyParser from 'body-parser';
import connection from "./config/connectDB";
import errorMiddleware from "./core/middlewave/error.middlewave";
class App {
    public app: express.Application;
    public port: string | number;

    constructor(routes: Route[]) {
        this.app = express();
        this.port = process.env.PORT || 5000;
            
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorMiddleware();
    }

    private initializeMiddlewares() {
        // Sử dụng CORS middleware
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initializeErrorMiddleware() {
        this.app.use(errorMiddleware);
      }

    public listen() {
        this.app.listen(this.port, async () => {
            console.log(`Server is running on port ${this.port}`);

            connection()
        });
    }

    private initializeRoutes(routes: Route[]) {
        routes.forEach((route) => {
            this.app.use('/', route.router);
        });
    }
}

export default App;
