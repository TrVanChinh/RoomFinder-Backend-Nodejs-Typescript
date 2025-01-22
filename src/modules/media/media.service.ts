import IMedia from './media.interface';
import { NextFunction, Request, Response } from 'express';

import Media from './media.model';
import bcrypt from 'bcrypt';
import { isEmptyObject } from '../../core/utils';
import jwt from 'jsonwebtoken';
import { HttpException } from '../../core/exceptions';
import { Sequelize,  Op } from 'sequelize'; 
import { IPagination } from '../../core/interfaces';
import { IsEmail, IsNotEmpty, validate } from 'class-validator';
import User from '../users/users.model';
import { uploadToCloudinary } from '../../config/cloudinary';
import Room from '../room/room.model';

const nodemailer = require('nodemailer')

class MediaService { 

    
    public async getMediaOfRoom(): Promise<IMedia[]> {
        const mediadata = await Media.findAll(); 
        if (!mediadata || mediadata.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu hình ảnh của phòng.');
        }
          return mediadata;
      }
      public async addMediaOfRoom ( maPhong:number, maDanhMucHinhAnh: number, loaiTep:string, data: string[]): Promise<IMedia[]> {
        if (!data || data.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu được gửi đến.');
        }
    
        try {
            const media = await Promise.all(
                data.map(async (item) => {
                    return await Media.create({
                        maPhong: maPhong,
                        maDanhMucHinhAnh: maDanhMucHinhAnh,
                        loaiTep: loaiTep,
                        duongDan:item,
                    });
                })
            );
              return media;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo dữ liệu hình ảnh phòng.');
        
        }
        
      }

      public async addMedia ( data: IMedia): Promise<IMedia> {
        if (!data) {
            throw new HttpException(404, 'Không có dữ liệu hình ảnh được gửi đến.');
        }
        try {
            const media =  await Media.create({
                        maPhong: data.maPhong,
                        maDanhMucHinhAnh: data.maDanhMucHinhAnh,
                        loaiTep: data.loaiTep,
                        duongDan: data.duongDan,
                    });
              return media;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo dữ liệu hình ảnh phòng.');
        
        }
        
      }

      public async deleteMediaOfRoom(maHinhAnh: string){
        const media = await Media.findByPk(maHinhAnh);
        if (!media) {
            throw new HttpException(404, 'Không tìm thấy hình ảnh.');
        }
        await media.destroy();
      }

      public async updateMediaofRoom(mediaDelete: IMedia[], mediaCreate:IMedia[]) {
        
       try {
        if (mediaDelete && mediaDelete.length > 0) { 
            mediaDelete.forEach((media: IMedia) => { 
                if (media.maHinhAnh !== null) {
                    this.deleteMediaOfRoom(media.maHinhAnh.toString());
                } else {
                    console.log(`maHinhAnh is null for media:`, media);
                }
            });
        }

        // Kiểm tra mediaCreate có tồn tại và có phần tử
        if (mediaCreate && mediaCreate.length > 0) {
            mediaCreate.forEach((media: IMedia) => {
                this.addMedia(media);
            });
        }
       
       } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
                throw new HttpException(500, 'Lỗi cập nhật hình ảnh phòng.');
        }
      }

      public async updateAvatar(userId: string, avatarUri: string) {
        if (!userId || !avatarUri) {
            throw new HttpException(400, 'ID người dùng hoặc URL ảnh đại diện không hợp lệ.');
        }
    
        try {
            const user = await User.findByPk(userId);
    
            if (!user) {
                throw new HttpException(404, 'Không tìm thấy người dùng.');
            }
    
            user.hinhDaiDien = avatarUri;
    
            await user.save();
    
            return { message: 'Cập nhật ảnh đại diện thành công.' };
    
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi khi cập nhật ảnh đại diện.');
        }
    }
    
}

export default MediaService;