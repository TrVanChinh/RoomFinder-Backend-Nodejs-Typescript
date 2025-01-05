import User from './modules/users/users.model';
import Address from './modules/address/address.model';
import RoomType from './modules/room_type/room_type.model';
import Interior from './modules/interior/interior.model';
import Room from './modules/room/room.model';
import MediaCategory from './modules/media_category/media_category.model';
import Media from './modules/media/media.model';
import Deposit from './modules/deposit/deposit.model';
import BiilType from './modules/bill_type/bill_type.model';
import Bill from './modules/bill/bill.model';
import Notification from './modules/notification/notification.model';
import NotificationType from './modules/notification_type/notification_type.model';
import SaveRoom from './modules/save_room/save_room.model';
// Định nghĩa quan hệ giữa các model
Room.belongsTo(User, { as: 'NguoiDung', foreignKey: 'maNguoiDung' });
Room.belongsTo(Address, { as: 'DiaChi', foreignKey: 'maDiaChi' });
Room.belongsTo(RoomType, { as: 'LoaiPhong', foreignKey: 'maLoaiPhong' });
Room.belongsTo(Interior, { as: 'NoiThat', foreignKey: 'maNoiThat' });

Media.belongsTo(MediaCategory, { as: 'DanhMucHinhAnh', foreignKey: 'maDanhMucHinhAnh' });
Media.belongsTo(Room, { as: 'Phong', foreignKey: 'maPhong' });

Deposit.belongsTo(Room, { as: 'Phong', foreignKey: 'maPhong' });

Bill.belongsTo(Room, { as: 'Phong', foreignKey: 'maPhong' });
Bill.belongsTo(BiilType, { as: 'LoaiHoaDon', foreignKey: 'maLoaiHoaDon' });
Bill.belongsTo(User, { as: 'NguoiDung', foreignKey: 'maNguoiDung' });

Notification.belongsTo(User, { as: 'NguoiDung', foreignKey:'maNguoiDung' });
Notification.belongsTo(NotificationType, { as: 'LoaiThongBao', foreignKey:'maLoaiThongBao' });
Notification.belongsTo(Room, { as: 'Phong', foreignKey:'maPhong' });
Notification.belongsTo(Bill, { as: 'HoaDon', foreignKey:'maHoaDon' });

SaveRoom.belongsTo(Room, { as: 'Phong', foreignKey: 'maPhong' });
SaveRoom.belongsTo(User, { as: 'NguoiDung', foreignKey: 'maNguoiDung' });

// (Tùy chọn) Quan hệ ngược lại nếu cần
User.hasMany(Room, { as: 'Phong', foreignKey: 'maNguoiDung' });
User.hasMany(Bill, { as: 'HoaDon', foreignKey: 'maNguoiDung' });
User.hasMany(Notification, { as: 'ThongBao', foreignKey: 'maNguoiDung' });
User.hasMany(SaveRoom, { as: 'LuuPhong', foreignKey: 'maNguoiDung' });

Room.hasMany(SaveRoom, { as: 'LuuPhong', foreignKey: 'maPhong' });
Address.hasMany(Room, { as: 'Phong', foreignKey: 'maDiaChi' });
RoomType.hasMany(Room, { as: 'Phong', foreignKey: 'maLoaiPhong' });
Interior.hasMany(Room, { as: 'Phong', foreignKey: 'maNoiThat' });

MediaCategory.hasMany(Media, { as: 'HinhAnh', foreignKey:'maDanhMucHinhAnh' });

Room.hasMany(Media, { as: 'HinhAnh', foreignKey: 'maPhong' });
Room.hasMany(Deposit, { as: 'ChiPhiDatCoc', foreignKey: 'maPhong' });
Room.hasMany(Bill, { as: 'HoaDon', foreignKey: 'maPhong' });
Room.hasMany(Notification, { as: 'ThongBao', foreignKey: 'maPhong' });

BiilType.hasMany(Bill, { as: 'HoaDon', foreignKey: 'maLoaiHoaDon' });

Bill.hasMany(Notification, { as: 'ThongBao', foreignKey: 'maHoaDon' });

NotificationType.hasMany(Notification, { as: 'ThongBao', foreignKey: 'maLoaiThongBao' });

export default function defineAssociations() {
    console.log('Associations have been defined.');
}