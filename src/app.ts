// import express from "express";
// import { Route } from "./core/interfaces";
// import cors from "cors";
// import pool from "./pool";
// import bodyParser from 'body-parser';
// import connection from "./config/connectDB";
// import errorMiddleware from "./core/middlewave/error.middlewave";
// import { Server } from "socket.io";
// import http from "http";

// class App {
//     public app: express.Application;
//     public port: string | number;
//     public server: http.Server;
//     public io: Server;

//     constructor(routes: Route[], io?: Server) {
//         this.app = express();
//         this.port = process.env.PORT || 5000;

//         // Tạo server HTTP và kết nối với Socket.IO
//         this.server = http.createServer(this.app);
//         this.io = io || new Server(this.server);
//         this.initializeMiddlewares();
//         this.initializeRoutes(routes);
//         this.initializeSocketIo();
//         this.initializeErrorMiddleware();
//     }

//     private initializeMiddlewares() {
//         // Sử dụng CORS middleware
//         this.app.use(cors());
//         this.app.use(express.json());
//     }

//     private initializeSocketIo() {
//         // Lắng nghe sự kiện kết nối WebSocket
//         this.io.on("connection", (socket) => {
//             console.log(`User connected: ${socket.id}`);

//             socket.on("join-room", (userId: string) => {
//                 socket.join(userId);
//                 console.log(`User ${userId} đã tham gia phòng.`);
//             });
//             // Phát sự kiện cho client khi có kết nối
//             socket.emit("new-notification", {
//                 message: "Bạn có thông báo mới!"
//             });

//             // Xử lý ngắt kết nối
//             socket.on("disconnect", () => {
//                 console.log("A user disconnected");
//             });
//         });
//     }

//     private initializeErrorMiddleware() {
//         this.app.use(errorMiddleware);
//       }

//     public listen() {
//         this.app.listen(this.port, async () => {
//             console.log(`Server is running on port ${this.port}`);

//             connection()
//         });
//     }

//     private initializeRoutes(routes: Route[]) {
//         routes.forEach((route) => {
//             this.app.use('/', route.router);
//         });
//     }
// }

// export default App;

import express from "express";
import { Route } from "./core/interfaces";
import cors from "cors";
import pool from "./pool";
import bodyParser from 'body-parser';
import connection from "./config/connectDB";
import errorMiddleware from "./core/middlewave/error.middlewave";
import socketIo from 'socket.io';
import http from "http";
import { RoomService } from "./modules/room";
import { CronJob } from "cron";

class App {
    public app: express.Application;
    public port: string | number;
    public server: http.Server;
    public io: socketIo.Server;

    constructor(routes: Route[], io?: socketIo.Server) {
        this.app = express();
        this.port = process.env.PORT || 5000;

        // Tạo server HTTP và kết nối với Socket.IO
        this.server = http.createServer(this.app);
        this.io = new socketIo.Server(this.server);
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initSocketIo();
        this.initializeErrorMiddleware();
        this.initializeCronJob();
    }

    private initializeMiddlewares() {
        // Sử dụng CORS middleware
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initSocketIo() {
        this.server = http.createServer(this.app);
        this.io = new socketIo.Server(this.server, {
          cors: {
            origin: '*',
          },
        });
        this.app.set('socketio', this.io);
    
        const users: any = {};
        this.io.on('connection', (socket: socketIo.Socket) => {
          socket.emit('message', 'Hello ' + socket.id);
    
          socket.on('login', (data) => {
            const userId = data.userId;
            users[socket.id] = userId; 

            // User tham gia room có id là userId
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        });

        //   socket.emit("new-notification", {
        //     message: "Bạn có thông báo mới!"
        // });
    
          socket.on('disconnect', function () {
            delete users[socket.id];
          });
        });
      }
    
    private initializeCronJob() {
        const roomService = new RoomService(this.io);

        const job = new CronJob(
            "13 15 * * *", // Thời gian chạy cron job
            async () => {
                console.log("Đang kiểm tra hóa đơn hết hạn...");
                try {
                    await roomService.checkAndNotifyExpiredBills();
                    console.log("Hoàn thành kiểm tra hóa đơn hết hạn.");
                } catch (error) {
                    console.error("Lỗi khi thực thi cron job:", error);
                }
            },
            null, // Hàm callback sau khi job kết thúc
            true, // Auto-start
            "Asia/Ho_Chi_Minh" // Múi giờ
        );

        job.start();
        console.log("Cron job đã được thiết lập.");
    }

    private initializeErrorMiddleware() {
        this.app.use(errorMiddleware);
      }

    public listen() {
        this.server.listen(this.port, async () => {
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
