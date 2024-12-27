import { isEmptyObject } from '../../core/utils';
import jwt from 'jsonwebtoken';
import { HttpException } from '../../core/exceptions';
import { Sequelize,  Op } from 'sequelize'; 
import { IPagination } from '../../core/interfaces';
import { IsEmail, IsNotEmpty, validate } from 'class-validator';
import INotification from './notification.interface';
import Notification from './notification.model';
import moment from 'moment-timezone';
import { MediaFormat, RoomInfo } from '../room/room.interface';
import RoomService from '../room/room.service';
import Room from '../room/room.model';
import Media from '../media/media.model';
import User from '../users/users.model';
import Address from '../address/address.model';
import RoomType from '../room_type/room_type.model';
import { IInterior, Interior } from '../interior';
import Deposit from '../deposit/deposit.model';
import MediaCategory from '../media_category/media_category.model';
import { IRoomType } from '../room_type';
import { IAddress } from '../address';
import IDeposit from '../deposit/deposit.interface';
import { IUser } from '../users';
class NotificationService { 

    public async getNotification(): Promise<INotification[]> {
        const address = await Notification.findAll(); 
        if (!address || address.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu hóa đơn nào.');
        }
          return address;
      }

      public async getRoomInfo(roomId: string): Promise<RoomInfo> { 
        if (!roomId) {
            throw new HttpException(404, 'Không có dữ liệu mã phòng được gửi đến.');
        }
        try {
            const roomData = await Room.findByPk(roomId, {
                include: [
                    { model: User, as: 'NguoiDung' },
                    { model: Address, as: 'DiaChi' },
                    { model: RoomType, as: 'LoaiPhong'},
                    { model: Interior, as: 'NoiThat'},
                    { model: Deposit, as: 'ChiPhiDatCoc' }, 
                    { model: Media, as: 'HinhAnh' }
                  ],
            });

            if (!roomData) {
                throw new HttpException(404, 'Mã phòng sai.');
            }

            const media: Media[] = roomData.get('HinhAnh') as Media[]; 
            const mediaCategory = await MediaCategory.findAll()
            const mediaFormat: MediaFormat[] = []
            media.forEach(item => {
                mediaCategory.forEach( mediaItem => {
                    if (item.maDanhMucHinhAnh === mediaItem.maDanhMucHinhAnh) {
                        mediaFormat.push({
                            maHinhAnh: item.maHinhAnh,
                            danhMucHinhAnh: mediaItem.tenDanhMuc,
                            loaiTep: item.loaiTep,
                            duongDan: item.duongDan,
                        })
                    }
                })
            })

            const roomInfo: RoomInfo = {
                maPhong: roomData.maPhong,
                nguoiDung: roomData.get('NguoiDung') as IUser, 
                loaiPhong: roomData.get('LoaiPhong') as IRoomType,
                diaChi: roomData.get('DiaChi') as IAddress,
                noiThat:  roomData.get('NoiThat') as IInterior,
                tieuDe: roomData.tieuDe,
                chiPhiDatCoc: roomData.get('ChiPhiDatCoc') as IDeposit[], 
                hinhAnh: mediaFormat , 
                moTa: roomData.moTa,
                giaPhong: roomData.giaPhong,
                giaDien: roomData.giaDien,
                giaNuoc: roomData.giaNuoc,
                dienTich: roomData.dienTich,
                phongChungChu: roomData.phongChungChu,
                gacXep: roomData.gacXep,
                nhaBep: roomData.nhaBep,
                soLuongPhongNgu: roomData.soLuongPhongNgu,
                soTang: roomData.soTang,
                soNguoiToiDa: roomData.soNguoiToiDa,
                trangThaiPhong: roomData.trangThaiPhong,
              };
            return roomInfo;

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
                throw new HttpException(500, 'Lỗi lấy dữ liệu phòng.');
        }
    }
    
    public async getNotificationbyUser(userId: string): Promise<{ notification: INotification; room: RoomInfo | null }[]> {
        try {
            const notifications = await Notification.findAll({
                where: {
                    maNguoiDung: userId,
                },
            });
    
            if (!notifications || notifications.length === 0) {
                return [];
            }
    
            const results = await Promise.all(
                notifications.map(async (notification) => {
                    let roomInfo: RoomInfo | null = null;
                        if (notification.maPhong) {
                        try {
                            roomInfo = await this.getRoomInfo(notification.maPhong.toString());
                        } catch (error) {
                            console.warn(`Không tìm thấy thông tin phòng cho mã phòng: ${notification.maPhong}`);
                            roomInfo = null; 
                        }
                    }
    
                    return {
                        notification: notification.toJSON() as INotification,
                        room: roomInfo,
                    };
                })
            );
            return results; 
        } catch (error) {
            console.error('Error fetching notifications with room and media data:', error);
            throw new HttpException(500, 'Lỗi lấy dữ liệu thông báo.');
        }
    }

      public async getNotificationforRoom(roomId: string): Promise<INotification[]> {
        const address = await Notification.findAll({
            where: {
                maPhong: roomId
            }
        }); 
        if (!address || address.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu hóa đơn nào.');
        }
          return address;
      }
    
    public async addNotification( data: INotification){
        if (!data) {
            throw new HttpException(404, 'Không có dữ liệu hóa đơn được gửi đến.');
        }
        try {

            const thoiGian = new Date()
            const thoiGianUTC7 = new Date(thoiGian.getTime() + 7 * 60 * 60 * 1000);
            console.log('thoi gian UTC+7:', thoiGianUTC7);
            
            const notification  = await Notification.create({
                maLoaiThongBao: data.maLoaiThongBao,
                maNguoiDung: data.maNguoiDung,
                maPhong: data.maPhong,
                maHoaDon: data.maHoaDon,
                noiDungThongBao: data.noiDungThongBao,
                trangThai: data.trangThai,
                thoiGian: thoiGianUTC7,
            }); 
                return notification ;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo thông báo.');
        
        }
    
    }

    public async updateNotificationStatus( notificationId: number){
        try { 
            const notification = await Notification.findByPk(notificationId) 
            if (!notification) {
                throw new HttpException(404, 'Không tìm thấy thông báo.');
            }
            notification.trangThai = 'Đã xem';
            await notification.save()
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo thông báo.');
        
        }
    
    }
}

export default NotificationService;