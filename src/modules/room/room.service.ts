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
import Bill from '../bill/bill.model';
import Notification from '../notification/notification.model';
import { Server } from "socket.io";
import { SaveRoomSchema } from '../save_room';

class RoomService {
    static getRoomInfo: any; 
    private io: Server;

    constructor(io: Server) {
      this.io = io; // Lưu io vào thuộc tính
    }
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


    public async getInformationActiveRooms(): Promise<RoomInfo[]> {
      try {
        // Lấy danh sách tất cả các phòng với trạng thái khác "Chờ duyệt"
        const roomsData = await Room.findAll({
          where: {
            trangThaiPhong: { [Op.ne]: 'Chờ duyệt' }, // Loại bỏ các phòng có trạng thái "Chờ duyệt"
          },
          include: [
            { model: User, as: 'NguoiDung' },
            { model: Address, as: 'DiaChi' },
            { model: RoomType, as: 'LoaiPhong' },
            { model: Interior, as: 'NoiThat' },
            { model: Deposit, as: 'ChiPhiDatCoc' },
            { model: Media, as: 'HinhAnh' },
          ],
        });
    
        if (!roomsData || roomsData.length === 0) {
          throw new HttpException(404, 'Không tìm thấy phòng nào đã được duyệt.');
        }
    
        const mediaCategory = await MediaCategory.findAll();
    
        // Xử lý thông tin từng phòng để trả về danh sách RoomInfo
        const roomInfos: RoomInfo[] = roomsData.map((roomData) => {
          const media: Media[] = roomData.get('HinhAnh') as Media[];
          const mediaFormat: MediaFormat[] = [];
    
          media.forEach((item) => {
            mediaCategory.forEach((mediaItem) => {
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
    
          return {
            maPhong: roomData.maPhong,
            nguoiDung: roomData.get('NguoiDung') as IUser,
            loaiPhong: roomData.get('LoaiPhong') as IRoomType,
            diaChi: roomData.get('DiaChi') as IAddress,
            noiThat: roomData.get('NoiThat') as IInterior,
            tieuDe: roomData.tieuDe,
            chiPhiDatCoc: roomData.get('ChiPhiDatCoc') as IDeposit[],
            hinhAnh: mediaFormat,
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
        });
    
        return roomInfos;
      } catch (error) {
        console.log(error);
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
    
    public async getAllRoomsPaging(keyword: string, page: number): Promise<IPagination<RoomInfo>> {
      const pageSize: number = Number(process.env.PAGE_SIZE || 10);
      try {
        // Lấy danh sách tất cả các phòng đã duyệt
        const allRooms = await this.getInformationActiveRooms();
    
        // Lọc danh sách theo từ khóa nếu có
        const filteredRooms = keyword
          ? allRooms.filter(
              (room) =>
                room.tieuDe.toLowerCase().includes(keyword.toLowerCase()) ||
                room.moTa.toLowerCase().includes(keyword.toLowerCase()) ||
                room.loaiPhong.loaiPhong.toLowerCase().includes(keyword.toLowerCase())
            )
          : allRooms;
    
        // Tính toán số lượng trang
        const total = filteredRooms.length;
        const offset = (page - 1) * pageSize;
    
        // Phân trang danh sách
        const paginatedRooms = filteredRooms.slice(offset, offset + pageSize);
    
        // Trả về kết quả dạng phân trang
        return {
          total,
          page,
          pageSize,
          items: paginatedRooms,
        } as IPagination<RoomInfo>;
      } catch (error) {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException(500, 'Lỗi lấy danh sách phòng.');
      }
    }
    
  
    // Lấy danh sách Room theo RoomType với phân trang
    public async getAllRoomsByType(maLoaiPhong: number, page: number): Promise<IPagination<RoomInfo>> {
      const pageSize: number = Number(process.env.PAGE_SIZE || 10);
      try {
        // Lấy danh sách tất cả các phòng đã duyệt
        const allRooms = await this.getInformationActiveRooms();
    
        // Lọc danh sách theo loại phòng
        const filteredRooms = allRooms.filter(
          (room) => room.loaiPhong.maLoaiPhong === maLoaiPhong
        );
    
        // Tính toán số lượng trang
        const total = filteredRooms.length;
        const offset = (page - 1) * pageSize;
    
        // Phân trang danh sách
        const paginatedRooms = filteredRooms.slice(offset, offset + pageSize);
    
        // Trả về kết quả dạng phân trang
        return {
          total,
          page,
          pageSize,
          items: paginatedRooms,
        } as IPagination<RoomInfo>;
      } catch (error) {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException(500, 'Lỗi lấy danh sách phòng theo loại.');
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

    public async saveRoom(maPhong: number, maNguoiDung: number) { 
      try {
        const existingSaveRoom = await SaveRoomSchema.findOne({
          where: {
            maPhong: maPhong,
            maNguoiDung: maNguoiDung,
          },
        });
    
        if (existingSaveRoom) {
          throw new HttpException(400, 'Phòng này đã được lưu trước đó.');
        }
        const saveRoom = await SaveRoomSchema.create({
          maPhong:maPhong,
          maNguoiDung: maNguoiDung,
      }); 
          return saveRoom;
      } catch (error) {
        console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
                throw new HttpException(500, 'Lỗi lưu phòng.');
      }
    }

    // public async searchRooms(criteria: RoomSearchCriteria) {
    //     try {
    //         const whereClause: any = {};
    
    //         // Điều kiện cho phòng
    //         if (criteria.room) {
    //             const { giaPhong, dienTich, ...otherRoomConditions } = criteria.room;
    
    //             if (giaPhong && Object.values(giaPhong).some((v) => v != null)) {
    //                 whereClause.giaPhong = {
    //                     ...(giaPhong.min != null && { [Op.gte]: giaPhong.min }),
    //                     ...(giaPhong.max != null && { [Op.lte]: giaPhong.max }),
    //                     ...(giaPhong.equal != null && { [Op.eq]: giaPhong.equal }),
    //                 };
    //             }
    
    //             if (dienTich && Object.values(dienTich).some((v) => v != null)) {
    //                 whereClause.dienTich = {
    //                     ...(dienTich.min != null && { [Op.gte]: dienTich.min }),
    //                     ...(dienTich.max != null && { [Op.lte]: dienTich.max }),
    //                     ...(dienTich.equal != null && { [Op.eq]: dienTich.equal }),
    //                 };
    //             }
    
    //             Object.entries(otherRoomConditions).forEach(([key, value]) => {
    //                 if (value != null) {
    //                     whereClause[key] = value;
    //                 }
    //             });
    //         }
    
    //         // Điều kiện địa chỉ
    //         const addressWhere: any = {};
    //         if (criteria.address) {
    //             Object.entries(criteria.address).forEach(([key, value]) => {
    //                 if (value != null) {
    //                     addressWhere[key] = value;
    //                 }
    //             });
    //         }
    
    //         // Điều kiện nội thất
    //         const interiorWhere: any = {};
    //         if (criteria.interior) {
    //             Object.entries(criteria.interior).forEach(([key, value]) => {
    //                 if (value != null) {
    //                     interiorWhere[key] = value;
    //                 }
    //             });
    //         }
    
    //         // Điều kiện loại phòng
    //         const roomTypeWhere: any = {};
    //         if (criteria.roomType) {
    //             const { phiDichVu, ...otherRoomTypeConditions } = criteria.roomType;
    
    //             if (phiDichVu && Object.values(phiDichVu).some((v) => v != null)) {
    //                 roomTypeWhere.phiDichVu = {
    //                     ...(phiDichVu.min != null && { [Op.gte]: phiDichVu.min }),
    //                     ...(phiDichVu.max != null && { [Op.lte]: phiDichVu.max }),
    //                     ...(phiDichVu.equal != null && { [Op.eq]: phiDichVu.equal }),
    //                 };
    //             }
    
    //             Object.entries(otherRoomTypeConditions).forEach(([key, value]) => {
    //                 if (value != null) {
    //                     roomTypeWhere[key] = value;
    //                 }
    //             });
    //         }
    
    //         // Query cơ sở dữ liệu
    //         const rooms = await Room.findAll({
    //             where: Object.keys(whereClause).length ? whereClause : undefined,
    //             include: [
    //                 { model: User, as: 'NguoiDung' },
    //                 { model: Address, as: 'DiaChi', where: Object.keys(addressWhere).length ? addressWhere : undefined },
    //                 { model: RoomType, as: 'LoaiPhong', where: Object.keys(roomTypeWhere).length ? roomTypeWhere : undefined },
    //                 { model: Interior, as: 'NoiThat', where: Object.keys(interiorWhere).length ? interiorWhere : undefined },
    //                 { model: Deposit, as: 'ChiPhiDatCoc' },
    //                 { model: Media, as: 'HinhAnh' },
    //             ],
    //         });
    
    //         return rooms;
    //     } catch (error) {
    //         console.error(error);
    //         throw new HttpException(500, 'Lỗi tìm kiếm phòng.');
    //     }
    // }
    
    public async searchRooms (filters: any) {
        try {
            const whereConditions: any = {};
            const interiorConditions: any = {};
            const addressConditions: any = {};
            const roomTypeConditions: any = {};
        
            // Room filters
            if (filters.room) {
              if (filters.room.giaPhong?.equal) {
                whereConditions.giaPhong = filters.room.giaPhong.equal;
              } else if (filters.room.giaPhong?.min && !filters.room.giaPhong?.max) {
                whereConditions.giaPhong = { [Op.gte]: filters.room.giaPhong.min };
              } else if (filters.room.giaPhong?.max && !filters.room.giaPhong?.min) {
                whereConditions.giaPhong = { [Op.lte]: filters.room.giaPhong.max };
              } else if (filters.room.giaPhong?.min && filters.room.giaPhong?.max) {
                whereConditions.giaPhong = {
                  [Op.gte]: filters.room.giaPhong.min,
                  [Op.lte]: filters.room.giaPhong.max,
                };
              }

              if (filters.room.dienTich?.equal) {
                whereConditions.dienTich = filters.room.dienTich.equal;
              } else if (filters.room.dienTich?.min || filters.room.dienTich?.max) {
                whereConditions.dienTich = {
                  ...(filters.room.dienTich.min && { [Op.gte]: filters.room.dienTich.min }),
                  ...(filters.room.dienTich.max && { [Op.lte]: filters.room.dienTich.max }),
                };
              }

              if (filters.room.phongChungChu !== null) {
                whereConditions.phongChungChu = filters.room.phongChungChu;
              }
              
                whereConditions.trangThaiPhong = "Cho thuê";
            }
        
            // Interior filters
            if (filters.interior) {
              Object.keys(filters.interior).forEach((key) => {
                if (filters.interior[key] !== null) {
                  interiorConditions[key] = filters.interior[key];
                }
              });
            }
        
            // Address filters
            if (filters.address) {
              Object.keys(filters.address).forEach((key) => {
                if (filters.address[key] !== null) {
                  addressConditions[key] = filters.address[key];
                }
              });
            }
        
            // RoomType filters
            if (filters.roomType) {
              if (filters.roomType.loaiPhong) {
                roomTypeConditions.loaiPhong = filters.roomType.loaiPhong;
              }
              if (filters.roomType.phiDichVu?.equal) {
                roomTypeConditions.phiDichVu = filters.roomType.phiDichVu.equal;
              } else if (filters.roomType.phiDichVu?.min || filters.roomType.phiDichVu?.max) {
                roomTypeConditions.phiDichVu = {
                  ...(filters.roomType.phiDichVu.min && { [Op.gte]: filters.roomType.phiDichVu.min }),
                  ...(filters.roomType.phiDichVu.max && { [Op.lte]: filters.roomType.phiDichVu.max }),
                };
              }
            }
        
            // Query
            const rooms = await Room.findAll({
              where: whereConditions,
              include: [
                {
                  model: Interior,
                  as: "NoiThat",
                  where: interiorConditions,
                  required: Object.keys(interiorConditions).length > 0,
                },
                {
                  model: Address,
                  as: "DiaChi",
                  where: addressConditions,
                  required: Object.keys(addressConditions).length > 0,
                },
                {
                  model: RoomType,
                  as: "LoaiPhong",
                  where: roomTypeConditions,
                  required: Object.keys(roomTypeConditions).length > 0,
                },
                {
                  model: User,
                  as: "NguoiDung",
                },
                {
                  model: Deposit,
                  as: "ChiPhiDatCoc",
                },
                {
                  model: Media,
                  as: "HinhAnh",
                  include: [
                    {
                      model: MediaCategory,
                      as: "DanhMucHinhAnh",
                    },
                  ],
                },
              ],
            });
        
            // Format response
            if (!rooms || rooms.length === 0) {
              return []; // Trả về mảng rỗng nếu không có phòng
            }
            
            // Format response
            const result: RoomInfo[] = rooms.map((room: any) => ({
              maPhong: room.maPhong,
              nguoiDung: room.NguoiDung || null,
              loaiPhong: room.LoaiPhong,
              diaChi: room.DiaChi,
              noiThat: room.NoiThat,
              tieuDe: room.tieuDe,
              chiPhiDatCoc: room.ChiPhiDatCoc,
              hinhAnh: Array.isArray(room.HinhAnh) ? room.HinhAnh.map((media: any) => ({
                maHinhAnh: media.maHinhAnh,
                loaiTep: media.loaiTep,
                duongDan: media.duongDan,
                danhMucHinhAnh: media.DanhMucHinhAnh.tenDanhMuc,
              })) : [],
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
            }));
            

        
            return result;
          } catch (error) {
            console.error("Error searching rooms:", error);
            throw new Error("Error searching rooms");
          }
      };

    public async checkAndNotifyExpiredBills() {
        try {
          const today = new Date();
        //   today.setHours(0, 0, 0, 0); // Đặt giờ về 0:00 để so sánh chính xác
      
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1); // Lấy ngày hôm qua
      
          // Lấy danh sách hóa đơn có ngày kết thúc là hôm qua
          const expiredBills = await Bill.findAll({
            where: {
              ngayKetThuc: {
                [Op.eq]: yesterday,
              },
            },
            include: [
              {
                model: Room,
                as: "Phong",
                include: [{ model: User, as: "NguoiDung" }],
              },
            ],
          });
      
          if (expiredBills.length === 0) {
            console.log("Không có hóa đơn nào hết hạn vào ngày hôm qua.");
            return;
          }
      
          // Gửi thông báo đến chủ phòng
          for (const bill of expiredBills) {
            const room = bill.get("Phong") as Room;
      
            if (room) {
                const notificationForOwner = await Notification.create({
                maNguoiDung: room.maNguoiDung,
                maHoaDon: bill.maHoaDon,
                maPhong: bill.maPhong,
                maLoaiThongBao: 2,
                noiDungThongBao: `Phòng ${bill.maPhong} đã hết hạn vào ngày.`,
                trangThai: "Chưa xem",
                thoiGian: new Date(),
              });
              const roomInfo = await this.getRoomInfo(bill.maPhong.toString());

            this.io.to(room.maNguoiDung.toString()).emit("new-notification", {notification: notificationForOwner,room: roomInfo});

              const notificationForTenant = await Notification.create({
                maNguoiDung: bill.maNguoiDung,
                maHoaDon: bill.maHoaDon,
                maPhong: bill.maPhong,
                maLoaiThongBao: 3,
                noiDungThongBao: `Hóa đơn số ${bill.maHoaDon} của phòng ${bill.maPhong} đã hết hạn.`,
                trangThai: "Chưa xem",
                thoiGian: new Date(),
              });

            this.io.to(bill.maNguoiDung.toString()).emit("new-notification", {notification: notificationForTenant,room: roomInfo});
      
              console.log(
                `Đã gửi thông báo cho chủ phòng ${room.maNguoiDung} về hóa đơn ${bill.maHoaDon} đã hết hạn vào ngày ${yesterday.toLocaleDateString()}.`
              );
            }
          }
        } catch (error) {
          console.error("Lỗi kiểm tra hóa đơn hết hạn và gửi thông báo:", error);
          throw new HttpException(500, "Lỗi kiểm tra hóa đơn hết hạn.");
        }
      };
    
    public async checkDate(){
        try {
            const thoiGian = new Date()
            const currentDate = new Date(); 
            // const startTime = currentDate.toLocaleDateString('en-CA');
            // const thoiGianUTC7 = new Date(thoiGian.getTime() + 13 * 60 * 60 * 1000);
            const startDate = currentDate.toLocaleDateString('en-CA');
            const startTime = currentDate.toLocaleTimeString('en-CA');

            // console.log('thoi gian UTC+7:', thoiGianUTC7);
        
            // console.log('Ngày tháng năm (kiểu Date):', startDate , startTime);

            const today = new Date();
            // today.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1); 
            console.log('Ngày tháng năm (kiểu Date):', today, yesterday);
            // Lấy danh sách hóa đơn có ngày kết thúc là hôm qua
            const expiredBills = await Bill.findAll({
                where: {
                ngayKetThuc: {
                    [Op.eq]: yesterday,
                },
                },
                include: [
                {
                    model: Room,
                    as: "Phong",
                    include: [{ model: User, as: "NguoiDung" }],
                },
                ],
            });
            
            if (expiredBills.length === 0) {
                console.log("Không có hóa đơn nào hết hạn vào ngày hôm qua.");
                return;
            }

            return expiredBills
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, 'Lỗi tạo thông báo.');
        
        }
    
    }
      
}

export default RoomService;