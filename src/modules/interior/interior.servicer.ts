import { IInterior } from './interior.interface';
import { isEmptyObject } from '../../core/utils';
import jwt from 'jsonwebtoken';
import { HttpException } from '../../core/exceptions';
import { Sequelize,  Op } from 'sequelize'; 
import { IPagination } from '../../core/interfaces';
import { IsEmail, IsNotEmpty, validate } from 'class-validator';
import Interior from './interior.model';

class InteriorService { 

    public async getInterior(): Promise<IInterior[]> {
        const address = await Interior.findAll(); 
        if (!address || address.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu nội thất.');
        }
          return address;
      }
    
      public async addInterior( data: IInterior): Promise<IInterior> {
        if (!data) {
            throw new HttpException(404, 'Không có dữ liệu được gửi đến.');
        }
        try {
            const address = await Interior.create({
                dieuHoa: data.dieuHoa,
                nongLanh: data.nongLanh,
                giuong: data.giuong,
                banGhe: data.banGhe,
                sofa: data.sofa,
                chanGaGoi: data.chanGaGoi,
                tuLanh: data.tuLanh,
                doDungBep: data.doDungBep,
                tuQuanAo: data.tuQuanAo,
            }); 
              return address;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo dữ liệu bảng nội thất.');
        
        }
        
      }
    
}

export default InteriorService;