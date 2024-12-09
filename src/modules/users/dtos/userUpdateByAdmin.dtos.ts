import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class userUpdateByAdmin {
  constructor(
    tenNguoiDung: string,
    email: string,
    matKhau: string,
    maLTK: number,
    ngaySinh: Date,
    sdt: string,
    gioiTinh: string,
    soCCCD: string,
    trangThaiTaiKhoan: string,
    trangThaiDangKy: string,
  ) {
    this.tenNguoiDung = tenNguoiDung;
    this.email = email;
    this.matKhau = matKhau;
    this.maLTK = maLTK;
    this.ngaySinh = ngaySinh;
    this.sdt = sdt;
    this.gioiTinh = gioiTinh;
    this.soCCCD = soCCCD;
    this.trangThaiTaiKhoan = trangThaiTaiKhoan;
    this.trangThaiDangKy = trangThaiDangKy
  }
  @IsNotEmpty()
  public tenNguoiDung: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @MinLength(6)
  public matKhau: string;

  @IsNotEmpty()
  public maLTK: number;

  public ngaySinh: Date;

  public sdt: string;

  @IsNotEmpty()
  public gioiTinh: string;

  public soCCCD: string;

  @IsNotEmpty()
  public trangThaiTaiKhoan: string;
  
  @IsNotEmpty()
  public trangThaiDangKy: string;

  // Add more fields as needed
}
