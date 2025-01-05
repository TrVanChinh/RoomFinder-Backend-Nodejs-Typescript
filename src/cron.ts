// // src/cron.ts
// import { CronJob } from "cron";
// import RoomService from '../src/modules/room/room.service'

// // Tạo cron job để chạy mỗi ngày lúc 0 giờ
// const roomService = new RoomService();
// const job = new CronJob(
//   "10 18 * * *", // Lịch chạy: 0 giờ mỗi ngày
//   async () => {
//     console.log("Đang kiểm tra hóa đơn hết hạn...");
//     try {
//       await roomService.checkAndNotifyExpiredBills();
//       console.log("Hoàn thành kiểm tra hóa đơn hết hạn.");
//     } catch (error) {
//       console.error("Lỗi khi thực thi cron job:", error);
//     }
//   },
//   null, // Hàm chạy khi kết thúc cron job (optional)
//   true, // Auto-start: bật cron job ngay lập tức
//   "Asia/Ho_Chi_Minh" // Múi giờ (có thể thay đổi nếu cần)
// );

// // Bắt đầu cron job
// job.start();

// console.log("Cron job đã được thiết lập.");

import { CronJob } from "cron";
import RoomService from "../src/modules/room/room.service";
import { Server } from "socket.io";

export default (io: Server) => {
    const roomService = new RoomService(io);

    const job = new CronJob(
        "30 14 * * *", // Thời gian chạy
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
};
