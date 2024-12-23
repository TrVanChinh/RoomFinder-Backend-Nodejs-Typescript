import User from './modules/users/users.model';
import Address from './modules/address/address.model';
import RoomType from './modules/room_type/room_type.model';
import Interior from './modules/interior/interior.model';
import Room from './modules/room/room.model';
import MediaCategory from './modules/media_category/media_category.model';
import Media from './modules/media/media.model';
import Deposit from './modules/deposit/deposit.model';

// Định nghĩa quan hệ giữa các model
Room.belongsTo(User, { as: 'NguoiDung', foreignKey: 'maNguoiDung' });
Room.belongsTo(Address, { as: 'DiaChi', foreignKey: 'maDiaChi' });
Room.belongsTo(RoomType, { as: 'LoaiPhong', foreignKey: 'maLoaiPhong' });
Room.belongsTo(Interior, { as: 'NoiThat', foreignKey: 'maNoiThat' });

Media.belongsTo(MediaCategory, { as: 'DanhMucHinhAnh', foreignKey: 'maDanhMucHinhAnh' });
Media.belongsTo(Room, { as: 'Phong', foreignKey: 'maPhong' });

Deposit.belongsTo(Room, { as: 'Phong', foreignKey: 'maPhong' });

// (Tùy chọn) Quan hệ ngược lại nếu cần
User.hasMany(Room, { as: 'Phong', foreignKey: 'maNguoiDung' });
Address.hasMany(Room, { as: 'Phong', foreignKey: 'maDiaChi' });
RoomType.hasMany(Room, { as: 'Phong', foreignKey: 'maLoaiPhong' });
Interior.hasMany(Room, { as: 'Phong', foreignKey: 'maNoiThat' });

MediaCategory.hasMany(Media, { as: 'HinhAnh', foreignKey:'maDanhMucHinhAnh' });

Room.hasMany(Media, { as: 'HinhAnh', foreignKey: 'maPhong' });
Room.hasMany(Deposit, { as: 'ChiPhiDatCoc', foreignKey: 'maPhong' });


export default function defineAssociations() {
    console.log('Associations have been defined.');
}