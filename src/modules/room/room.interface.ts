import { IAddress } from "../address";
import { IUser } from "../auth";
import IDeposit from "../deposit/deposit.interface";
import { IInterior } from "../interior";
import { IRoomType } from "../room_type";

export default interface IRoom {
    maPhong: number;
    maNguoiDung: number;
    maLoaiPhong: number;
    maDiaChi: number;
    maNoiThat: number;
    tieuDe: string ;
    moTa: string;
    giaPhong: number;
    giaDien: number;
    giaNuoc: number;
    dienTich: string;
    phongChungChu: boolean;
    gacXep: boolean;
    nhaBep: boolean;
    soLuongPhongNgu: number;
    soTang: number;
    soNguoiToiDa: number;
    trangThaiPhong: string;
  }

export interface MediaFormat {
  maHinhAnh: number;
  danhMucHinhAnh: string;
  loaiTep: string;
  duongDan: string;
}

export interface RoomInfo {
    maPhong: number;
    nguoiDung: IUser | null;
    loaiPhong: IRoomType;
    diaChi: IAddress;
    noiThat: IInterior;
    tieuDe: string ;
    chiPhiDatCoc: IDeposit[];
    hinhAnh: MediaFormat[];
    moTa: string;
    giaPhong: number;
    giaDien: number;
    giaNuoc: number;
    dienTich: string;
    phongChungChu: boolean;
    gacXep: boolean;
    nhaBep: boolean;
    soLuongPhongNgu: number;
    soTang: number;
    soNguoiToiDa: number;
    trangThaiPhong: string;
  }
