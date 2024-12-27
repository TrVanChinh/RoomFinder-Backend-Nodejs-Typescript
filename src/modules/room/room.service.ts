import  IRoom, { RoomInfo, MediaFormat, RoomSearchCriteria }  from './room.interface';
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
import Address from '../address/address.model';
import User from '../users/users.model';
import Interior from '../interior/interior.model';
import IUser from '../users/users.interface';
import { IAddress } from '../address';
import { IInterior } from '../interior';
import Deposit from '../deposit/deposit.model';
import Media from '../media/media.model';
import IDeposit from '../deposit/deposit.interface';
import IMedia from '../media/media.interface';
import MediaCategory from '../media_category/media_category.model';


class RoomService {
    static getRoomInfo: any; 

    public async getRoomType(): Promise<IRoomType[]> {
        const roomtype = await RoomType.findAll(); 
        if (!roomtype || roomtype.length === 0) {
            throw new HttpException(404, 'Không có dữ liệu loại phòng.');
        }
          return roomtype;
      }
    
    public async addRoom( data: IRoom): Promise<IRoom> {
    if (!data) {
        throw new HttpException(404, 'Không có dữ liệu được gửi đến.');
    }
    try {
        const deposit = await Room.create({
            maNguoiDung: data.maNguoiDung,
            maLoaiPhong:data.maLoaiPhong,
            maDiaChi: data.maDiaChi,
            maNoiThat: data.maNoiThat,
            tieuDe: data.tieuDe,
            moTa: data.moTa,
            giaPhong: data.giaPhong,
            giaDien: data.giaDien,
            giaNuoc: data.giaNuoc,
            dienTich: data.dienTich,
            phongChungChu: data.phongChungChu,
            gacXep: data.gacXep,
            nhaBep: data.nhaBep,
            soLuongPhongNgu: data.soLuongPhongNgu,
            soTang:data.soTang,
            soNguoiToiDa: data.soNguoiToiDa,
            trangThaiPhong: data.trangThaiPhong,
        }); 
            return deposit;
    } catch (error) {
        console.log(error)
        if (error instanceof HttpException) {
            throw error;
        }
        throw new HttpException(500, 'Lỗi tạo dữ phòng.');
    
    }
    
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

    public async getRoomOfUser(userId: string): Promise<RoomInfo[]> { 
        if (!userId) {
            throw new HttpException(404, 'Không có dữ liệu mã người dùng được gửi đến.');
        }
       try {
            const roomData = await Room.findAll({
                where: {
                    maNguoiDung: userId, 
                },          
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
                throw new HttpException(404, 'Người dùng không tồn tại.');
            }

            const mediaCategory = await MediaCategory.findAll()

            const roomDataFotmat: RoomInfo[] = []

            roomData.forEach(room => {
                const media: Media[] = room.get('HinhAnh') as Media[]; 
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

                roomDataFotmat.push({
                    maPhong: room.maPhong,
                    nguoiDung: room.get('NguoiDung') as IUser, 
                    loaiPhong: room.get('LoaiPhong') as IRoomType,
                    diaChi: room.get('DiaChi') as IAddress,
                    noiThat:  room.get('NoiThat') as IInterior,
                    tieuDe: room.tieuDe,
                    chiPhiDatCoc: room.get('ChiPhiDatCoc') as IDeposit[], 
                    hinhAnh: mediaFormat , 
                    moTa: room.moTa,
                    giaPhong: room.giaPhong,
                    giaDien: room.giaDien,
                    giaNuoc: room.giaNuoc,
                    dienTich: room.dienTich,
                    phongChungChu: room.phongChungChu,
                    gacXep: room.gacXep,
                    nhaBep: room.nhaBep,
                    soLuongPhongNgu: room.soLuongPhongNgu,
                    soTang: room.soTang,
                    soNguoiToiDa: room.soNguoiToiDa,
                    trangThaiPhong: room.trangThaiPhong,
                });
            })

            return roomDataFotmat
       } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
                throw new HttpException(500, 'Lỗi lấy dữ liệu phòng.');
       }
    }

    // public async getRoomOfDistrict(district: string): Promise<RoomInfo[]> { 
    //     if (!district) {
    //         throw new HttpException(404, 'Không có dữ liệu quận gửi đến.');
    //     }
    //    try {
    //     const roomsWithDistrict = await Room.findAll({
    //         include: [
    //             {
    //                 model: Address,
    //                 as: 'DiaChi', 
    //                 where: {
    //                     quanHuyen: {
    //                         [Op.iLike]: `%${district}%`,
    //                     },
    //                 },
    //             },
    //             { model: User, as: 'NguoiDung' },         
    //             { model: RoomType, as: 'LoaiPhong' },     
    //             { model: Interior, as: 'NoiThat' },
    //             { model: Deposit, as: 'ChiPhiDatCoc' },   
    //             { model: Media, as: 'HinhAnh' },
    //         ],
    //     });
    //         const roomDataFotmat: RoomInfo[] = []

    //         if (!roomsWithDistrict || roomsWithDistrict.length === 0) {
    //             return roomDataFotmat
    //         }

    //         const mediaCategory = await MediaCategory.findAll()


    //         roomsWithDistrict.forEach(room => {
    //             const media: Media[] = room.get('HinhAnh') as Media[]; 
    //             const mediaFormat: MediaFormat[] = []
    //             media.forEach(item => {
    //                 mediaCategory.forEach( mediaItem => {
    //                     if (item.maDanhMucHinhAnh === mediaItem.maDanhMucHinhAnh) {
    //                         mediaFormat.push({
    //                             maHinhAnh: item.maHinhAnh,
    //                             danhMucHinhAnh: mediaItem.tenDanhMuc,
    //                             loaiTep: item.loaiTep,
    //                             duongDan: item.duongDan,
    //                         })
    //                     }
    //                 })
    //             })

    //             roomDataFotmat.push({
    //                 maPhong: room.maPhong,
    //                 nguoiDung: room.get('NguoiDung') as IUser, 
    //                 loaiPhong: room.get('LoaiPhong') as IRoomType,
    //                 diaChi: room.get('DiaChi') as IAddress,
    //                 noiThat:  room.get('NoiThat') as IInterior,
    //                 tieuDe: room.tieuDe,
    //                 chiPhiDatCoc: room.get('ChiPhiDatCoc') as IDeposit[], 
    //                 hinhAnh: mediaFormat , 
    //                 moTa: room.moTa,
    //                 giaPhong: room.giaPhong,
    //                 giaDien: room.giaDien,
    //                 giaNuoc: room.giaNuoc,
    //                 dienTich: room.dienTich,
    //                 phongChungChu: room.phongChungChu,
    //                 gacXep: room.gacXep,
    //                 nhaBep: room.nhaBep,
    //                 soLuongPhongNgu: room.soLuongPhongNgu,
    //                 soTang: room.soTang,
    //                 soNguoiToiDa: room.soNguoiToiDa,
    //                 trangThaiPhong: room.trangThaiPhong,
    //             });
    //         })

    //         return roomDataFotmat
    //    } catch (error) {
    //         console.log(error)
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
    //             throw new HttpException(500, 'Lỗi lấy dữ liệu phòng theo quân huyện.');
    //    }
    // }
    public async getRoomOfDistrict(district: string): Promise<RoomInfo[]> { 
        if (!district) {
            throw new HttpException(404, 'Không có dữ liệu quận gửi đến.');
        }
        try {
            const roomsWithDistrict = await Room.findAll({
                where: {
                    trangThaiPhong: 'Cho thuê', // Điều kiện kiểm tra trạng thái phòng
                },
                include: [
                    {
                        model: Address,
                        as: 'DiaChi', 
                        where: {
                            quanHuyen: {
                                [Op.iLike]: `%${district}%`,
                            },
                        },
                    },
                    { model: User, as: 'NguoiDung' },         
                    { model: RoomType, as: 'LoaiPhong' },     
                    { model: Interior, as: 'NoiThat' },
                    { model: Deposit, as: 'ChiPhiDatCoc' },   
                    { model: Media, as: 'HinhAnh' },
                ],
            });
    
            const roomDataFotmat: RoomInfo[] = [];
    
            if (!roomsWithDistrict || roomsWithDistrict.length === 0) {
                return roomDataFotmat;
            }
    
            const mediaCategory = await MediaCategory.findAll();
    
            roomsWithDistrict.forEach(room => {
                const media: Media[] = room.get('HinhAnh') as Media[]; 
                const mediaFormat: MediaFormat[] = [];
                media.forEach(item => {
                    mediaCategory.forEach(mediaItem => {
                        if (item.maDanhMucHinhAnh === mediaItem.maDanhMucHinhAnh) {
                            mediaFormat.push({
                                maHinhAnh: item.maHinhAnh,
                                danhMucHinhAnh: mediaItem.tenDanhMuc,
                                loaiTep: item.loaiTep,
                                duongDan: item.duongDan,
                            });
                        }
                    });
                });
    
                roomDataFotmat.push({
                    maPhong: room.maPhong,
                    nguoiDung: room.get('NguoiDung') as IUser, 
                    loaiPhong: room.get('LoaiPhong') as IRoomType,
                    diaChi: room.get('DiaChi') as IAddress,
                    noiThat: room.get('NoiThat') as IInterior,
                    tieuDe: room.tieuDe,
                    chiPhiDatCoc: room.get('ChiPhiDatCoc') as IDeposit[], 
                    hinhAnh: mediaFormat, 
                    moTa: room.moTa,
                    giaPhong: room.giaPhong,
                    giaDien: room.giaDien,
                    giaNuoc: room.giaNuoc,
                    dienTich: room.dienTich,
                    phongChungChu: room.phongChungChu,
                    gacXep: room.gacXep,
                    nhaBep: room.nhaBep,
                    soLuongPhongNgu: room.soLuongPhongNgu,
                    soTang: room.soTang,
                    soNguoiToiDa: room.soNguoiToiDa,
                    trangThaiPhong: room.trangThaiPhong,
                });
            });
    
            return roomDataFotmat;
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi lấy dữ liệu phòng theo quận huyện.');
        }
    }
    

    public async updateRoom(roomId: string, roomData: RoomInfo) {
        
    } 

    public async deleteRoom(maPhong: string): Promise<void> {
        if (!maPhong) {
            throw new HttpException(400, 'Mã phòng không hợp lệ.');
        }
        try {
            const room = await Room.findByPk(maPhong);
            if (!room) {
                throw new HttpException(404, 'Phòng không tồn tại.');
            }

            await Media.destroy({ where: { maPhong } });
            await Deposit.destroy({ where: { maPhong } });
            await room.destroy();

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
                throw new HttpException(500, 'Lỗi xóa phòng.');
        }
        
    }
    
    public async updateRoomStatus(maPhong: string, trangThaiPhong: string ) {
        if (!maPhong) {
            throw new HttpException(400, 'Mã phòng không hợp lệ.');
        }
        try {
            const room = await Room.findByPk(maPhong);
            if (!room) {
                throw new HttpException(404, 'Phòng không tồn tại.');
            }
            room.trangThaiPhong = trangThaiPhong;
            const result = await room.save();
            return result
        } catch (error) { 
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
                throw new HttpException(500, 'Lỗi cập nhật trang thái phòng.');
        }
    }

    public async updateBasicRoomInfo(roomData: IRoom) {
        if (!roomData) {
            throw new HttpException(400, 'Không có dữ liệu cập nhật.');
        }
        try {
            const room = await Room.findByPk(roomData.maPhong);
            if (!room) {
                throw new HttpException(404, 'Phòng không tồn tại.');
            }

            room.maLoaiPhong = roomData.maLoaiPhong;
            room.tieuDe = roomData.tieuDe;
            room.moTa = roomData.moTa;
            room.giaPhong = roomData.giaPhong;
            room.giaDien = roomData.giaDien;
            room.giaNuoc = roomData.giaNuoc;
            room.dienTich = roomData.dienTich;
            room.phongChungChu = roomData.phongChungChu;
            room.gacXep = roomData.gacXep;
            room.nhaBep = roomData.nhaBep;
            room.soLuongPhongNgu = roomData.soLuongPhongNgu;
            room.soTang = roomData.soTang;
            room.soNguoiToiDa = roomData.soNguoiToiDa;

            await room.save();
        } catch (error) { 
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
                throw new HttpException(500, 'Lỗi cập nhật thông tin cơ bản của phòng.');
        }
    }


    public async searchRooms(criteria: RoomSearchCriteria) {
        try {
            const whereClause: any = {};
    
            // Điều kiện cho phòng
            if (criteria.room) {
                const { giaPhong, dienTich, ...otherRoomConditions } = criteria.room;
    
                if (giaPhong && Object.values(giaPhong).some((v) => v != null)) {
                    whereClause.giaPhong = {
                        ...(giaPhong.min != null && { [Op.gte]: giaPhong.min }),
                        ...(giaPhong.max != null && { [Op.lte]: giaPhong.max }),
                        ...(giaPhong.equal != null && { [Op.eq]: giaPhong.equal }),
                    };
                }
    
                if (dienTich && Object.values(dienTich).some((v) => v != null)) {
                    whereClause.dienTich = {
                        ...(dienTich.min != null && { [Op.gte]: dienTich.min }),
                        ...(dienTich.max != null && { [Op.lte]: dienTich.max }),
                        ...(dienTich.equal != null && { [Op.eq]: dienTich.equal }),
                    };
                }
    
                Object.entries(otherRoomConditions).forEach(([key, value]) => {
                    if (value != null) {
                        whereClause[key] = value;
                    }
                });
            }
    
            // Điều kiện địa chỉ
            const addressWhere: any = {};
            if (criteria.address) {
                Object.entries(criteria.address).forEach(([key, value]) => {
                    if (value != null) {
                        addressWhere[key] = value;
                    }
                });
            }
    
            // Điều kiện nội thất
            const interiorWhere: any = {};
            if (criteria.interior) {
                Object.entries(criteria.interior).forEach(([key, value]) => {
                    if (value != null) {
                        interiorWhere[key] = value;
                    }
                });
            }
    
            // Điều kiện loại phòng
            const roomTypeWhere: any = {};
            if (criteria.roomType) {
                const { phiDichVu, ...otherRoomTypeConditions } = criteria.roomType;
    
                if (phiDichVu && Object.values(phiDichVu).some((v) => v != null)) {
                    roomTypeWhere.phiDichVu = {
                        ...(phiDichVu.min != null && { [Op.gte]: phiDichVu.min }),
                        ...(phiDichVu.max != null && { [Op.lte]: phiDichVu.max }),
                        ...(phiDichVu.equal != null && { [Op.eq]: phiDichVu.equal }),
                    };
                }
    
                Object.entries(otherRoomTypeConditions).forEach(([key, value]) => {
                    if (value != null) {
                        roomTypeWhere[key] = value;
                    }
                });
            }
    
            // Query cơ sở dữ liệu
            const rooms = await Room.findAll({
                where: Object.keys(whereClause).length ? whereClause : undefined,
                include: [
                    { model: User, as: 'NguoiDung' },
                    { model: Address, as: 'DiaChi', where: Object.keys(addressWhere).length ? addressWhere : undefined },
                    { model: RoomType, as: 'LoaiPhong', where: Object.keys(roomTypeWhere).length ? roomTypeWhere : undefined },
                    { model: Interior, as: 'NoiThat', where: Object.keys(interiorWhere).length ? interiorWhere : undefined },
                    { model: Deposit, as: 'ChiPhiDatCoc' },
                    { model: Media, as: 'HinhAnh' },
                ],
            });
    
            return rooms;
        } catch (error) {
            console.error(error);
            throw new HttpException(500, 'Lỗi tìm kiếm phòng.');
        }
    }
    
    
      
}

export default RoomService;