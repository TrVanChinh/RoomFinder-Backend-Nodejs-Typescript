import { Router } from "express";
import { Route } from "../core/interfaces";
import IndexController from "./index.controller";

export default class IndexRoute implements Route {
    public path = '/';
    public router = Router(); 

    public indexController = new IndexController();
    constructor() {
        this.initializeRouter()
    }

    private initializeRouter() { 
        this.router.get(this.path, this.indexController.index);
    }
}