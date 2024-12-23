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

      public async getOneAddress(addressId: string): Promise<IAddress> {
        const address = await Address.findByPk(addressId); 
        if (!address) {
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

    public async updateAddress(data: IAddress){
        if (!data || !data.maDiaChi) {
            throw new HttpException(404, 'Dữ liệu địa chỉ hoặc ID địa chỉ không hợp lệ.');
        }
        try {
            const address = await Address.findByPk(data.maDiaChi); 
            if (!address) {
                throw new HttpException(404, 'Không tìm thấy địa chỉ.');
            }
            
            address.soNha = data.soNha;
            address.phuongXa = data.phuongXa;
            address.quanHuyen = data.quanHuyen;
            address.tinhThanh = data.tinhThanh;
            address.kinhDo = data.kinhDo;
            address.viDo = data.viDo;
            
            await address.save(); 
            } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi cập nhật địa chỉ.');
        }
    }

    public async deleteAddress(maDiaChi: string){ 
        if (!maDiaChi ) {
            throw new HttpException(404, 'Không có ID địa chỉ.');
        }
        try {
            const address = await Address.findOne({ where: { maDiaChi } });
    
            if (!address) {
                throw new HttpException(404, 'Địa chỉ không tồn tại.');
            }
    
            await address.destroy();
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi xóa địa chỉ.');
        }
    
    }
}

export default AddressService;