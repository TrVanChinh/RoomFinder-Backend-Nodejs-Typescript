import { isEmptyObject } from '../../core/utils';
import jwt from 'jsonwebtoken';
import { HttpException } from '../../core/exceptions';
import { Sequelize,  Op } from 'sequelize'; 
import { IPagination } from '../../core/interfaces';
import { IsEmail, IsNotEmpty, validate } from 'class-validator';
import IBill from './bill.interface';
import Bill from './bill.model';

class BillService { 

    public async getBill(): Promise<IBill[]> {
        const address = await Bill.findAll(); 
        if (!address || address.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu hóa đơn nào.');
        }
          return address;
      }
    public async getBillbyId(billId: string): Promise<IBill> {
        const bill = await Bill.findByPk(billId); 
        if (!bill) {
            throw new HttpException(404, 'Không có dữ liệu hóa đơn nào.');
        }
        return bill;
    }
    public async getBillbyUser(userId: string): Promise<IBill[]> {
    const bill = await Bill.findAll({
        where: {
            maNguoiDung: userId
        }
    }); 
    if (!bill || bill.length === 0) {
        throw new HttpException(404, 'Không có dữ liệu hóa đơn nào.');
    }
        return bill;
    }

    public async getBillforRoom(roomId: string): Promise<IBill[]> {
    const bill = await Bill.findAll({
        where: {
            maPhong: roomId
        }
    }); 
    if (!bill || bill.length === 0) {
        throw new HttpException(404, 'Không có dữ liệu hóa đơn nào.');
    }
        return bill;
    }
    
    public async addBill( data: IBill): Promise<IBill> {
        if (!data) {
            throw new HttpException(404, 'Không có dữ liệu hóa đơn được gửi đến.');
        }
        try {
            const bill = await Bill.create({
                maLoaiHoaDon: data.maLoaiHoaDon,
                maNguoiDung: data.maNguoiDung,
                maPhong: data.maPhong,
                tongSoTien: data.tongSoTien,
                ngayBatDau: data.ngayBatDau,
                ngayKetThuc: data.ngayKetThuc,
                thoiGianTao: new Date(),
            }); 
                return bill;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo hóa đơn');
        
        }
    
    }
}

export default BillService;