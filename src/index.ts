
import App from "./app";
import { IndexRoute } from "./modules/index";
import connection from "./config/connectDB";
import { UsersRoute } from "./modules/users";
import  AuthRoute  from "./modules/auth/auth.route"
import RoleRoute from "./modules/role/role.route";
import RoomRoute from "./modules/room/room.router";
import AddressRoute from "./modules/address/address.router";
import InteriorRoute from "./modules/interior/interior.router";
const routes = [
    new IndexRoute(), 
    new UsersRoute(),
    new AuthRoute(),
    new RoleRoute(),
    new RoomRoute(),
    new AddressRoute(),
    new InteriorRoute(),
]
const app = new App(routes)
connection()
app.listen()

