import { isEmptyObject } from '../../core/utils';
import jwt from 'jsonwebtoken';
import { HttpException } from '../../core/exceptions';
import { Sequelize,  Op } from 'sequelize'; 
import { IPagination } from '../../core/interfaces';
import { IsEmail, IsNotEmpty, validate } from 'class-validator';
import IDeposit from './deposit.interface';
import Deposit from './deposit.model';
import Room from '../room/room.model';
class DepositService { 

    public async getDeposit(): Promise<IDeposit[]> {
        const address = await Deposit.findAll(); 
        if (!address || address.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu bảng phí đặt cọc.');
        }
          return address;
      }
      public async getDepositByRoom(maPhong : string): Promise<IDeposit[]> {
        const address = await Deposit.findAll({
            where: {
                maPhong : maPhong
            },
        }); 
        if (!address || address.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu bảng phí đặt cọc.');
        }
          return address;
      }

      public async addOneDeposit( maPhong:number, data: IDeposit): Promise<IDeposit> {
        if (!data) {
            throw new HttpException(404, 'Không có dữ liệu được gửi đến.');
        }
    
        try {
            const deposits = await Deposit.create({
                        maPhong: maPhong,
                        phiDatCoc: data.phiDatCoc,
                        thoiHanDatCoc: data.thoiHanDatCoc,
                        donViThoiGian:data.donViThoiGian,
                    });
              return deposits;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo dữ liệu phí đặt cọc.');
        
        }
        
      }
      public async addDeposit( maPhong:number, data: IDeposit[]): Promise<IDeposit[]> {
        if (!data || data.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu được gửi đến.');
        }
    
        try {
            const room = await Room.findOne({
                where: {
                    maPhong: maPhong
                }
            })
            // Cập nhật dữ liệu phí đặt cọc
                        
            if(room?.trangThaiPhong ==="Không duyệt")
            {
                room.trangThaiPhong = "Chờ duyệt";
                await room.save();
            }
            
            const deposits = await Promise.all(
                data.map(async (item) => {
                    return await Deposit.create({
                        maPhong: maPhong,
                        phiDatCoc: item.phiDatCoc,
                        thoiHanDatCoc: item.thoiHanDatCoc,
                        donViThoiGian:item.donViThoiGian,
                    });
                })
            );
            
            
              return deposits;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo dữ liệu phí đặt cọc.');
        
        }
        
      }

      public async updateDeposit(maPhiDatCoc: string, data: IDeposit) {
        if (!maPhiDatCoc || !data) {
            throw new HttpException(404, 'Không có dữ liệu được gửi đến.');
        }
            
        try {
            const deposit = await Deposit.findByPk(maPhiDatCoc);

            if (!deposit) {
                throw new HttpException(404, 'Không tìm thấy phí đặt cọc.');
            } 
            const room = await Room.findByPk(deposit.maPhong)
            // Cập nhật dữ liệu phí đặt cọc
            
            if(room?.trangThaiPhong ==="Không duyệt")
            {
                room.trangThaiPhong = "Chờ duyệt";
                await room.save();
            }
            await deposit.update(data);

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi cập nhật dữ liệu phí đặt cọc.');
        
        }
      }
      
      public async deleteDeposit(maPhiDatCoc: string): Promise<void> {
        if (!maPhiDatCoc) {
            throw new HttpException(404, 'Không có mã phí đặt cọc được gửi đến.');
        }
    
        try {
            // Tìm phí đặt cọc theo maPhiDatCoc
            const deposit = await Deposit.findByPk(maPhiDatCoc);
    
            if (!deposit) {
                throw new HttpException(404, 'Không tìm thấy phí đặt cọc.');
            }
            const room = await Room.findByPk(deposit.maPhong)
            // Cập nhật dữ liệu phí đặt cọc
            
            if(room?.trangThaiPhong ==="Không duyệt")
            {
                room.trangThaiPhong = "Chờ duyệt";
                await room.save();
            }
    
            // Xóa phí đặt cọc
            await deposit.destroy();
    
            console.log(`Phí đặt cọc với mã ${maPhiDatCoc} đã được xóa thành công.`);
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi xóa dữ liệu phí đặt cọc.');
        }
    }
    
    
    
}

export default DepositService;