import { isEmptyObject } from '../../core/utils';
import jwt from 'jsonwebtoken';
import { HttpException } from '../../core/exceptions';
import { Sequelize,  Op } from 'sequelize'; 
import { IPagination } from '../../core/interfaces';
import { IsEmail, IsNotEmpty, validate } from 'class-validator';
import IAddress from './address.interface';
import Address from './address.model';
class AddressService { 

    public async getAddress(): Promise<IAddress[]> {
        const address = await Address.findAll(); 
        if (!address || address.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu địa chỉ.');
        }
          return address;
      }
    
      public async addAddress( data: IAddress): Promise<IAddress> {
        if (!data) {
            throw new HttpException(404, 'Không có dữ liệu được gửi đến.');
        }
        try {
            const address = await Address.create({
                soNha: data.soNha,
                phuongXa: data.phuongXa,
                quanHuyen: data.quanHuyen,
                tinhThanh: data.tinhThanh,
                kinhDo: data.kinhDo,
                viDo: data.viDo
            }); 
              return address;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo địa chỉ.');
        
        }
        
      }
    
}

export default AddressService;