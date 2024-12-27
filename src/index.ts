
import App from "./app";
import { IndexRoute } from "./modules/index";
import connection from "./config/connectDB";
import { UsersRoute } from "./modules/users";
import  AuthRoute  from "./modules/auth/auth.route"
import RoleRoute from "./modules/role/role.route";
import RoomRoute from "./modules/room/room.router";
import AddressRoute from "./modules/address/address.router";
import InteriorRoute from "./modules/interior/interior.router";
import DepositsRoute from "./modules/deposit/deposit.router";
import MediaRouter from "./modules/media/media.router";
import defineAssociations from "./associations";
import BillRoute from "./modules/bill/bill.route";
import NotificationRoute from "./modules/notification/notification.router";
const routes = [
    new IndexRoute(), 
    new UsersRoute(),
    new AuthRoute(),
    new RoleRoute(),
    new RoomRoute(),
    new AddressRoute(),
    new InteriorRoute(),
    new DepositsRoute(),
    new MediaRouter(),
    new BillRoute(),
    new NotificationRoute(),
]
const app = new App(routes)
connection()
defineAssociations()
app.listen()

