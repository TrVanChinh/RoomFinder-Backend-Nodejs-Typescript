import IRoom from './room.interface';
// import RegisterDto from './dtos/register.dtos';
import Room from './room.model';
import bcrypt from 'bcrypt';
import { isEmptyObject } from '../../core/utils';
import jwt from 'jsonwebtoken';
import { HttpException } from '../../core/exceptions';
import { Sequelize,  Op } from 'sequelize'; 
import { IPagination } from '../../core/interfaces';
import { IsEmail, IsNotEmpty, validate } from 'class-validator';
import { IRoomType } from '../room_type';
import RoomType from '../room_type/room_type.model';

const nodemailer = require('nodemailer')


class RoomService { 

    public async getRoomType(): Promise<IRoomType[]> {
        const roomtype = await RoomType.findAll(); 
        if (!roomtype || roomtype.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu loại phòng.');
        }
          return roomtype;
      }
    
}

export default RoomService;