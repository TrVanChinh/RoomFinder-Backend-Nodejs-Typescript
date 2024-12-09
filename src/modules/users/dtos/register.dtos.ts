import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class RegisterDto {
  constructor(
    tenNguoiDung: string,
    email: string,
    matKhau: string
  ) {
    this.tenNguoiDung = tenNguoiDung;
    this.email = email;
    this.matKhau = matKhau;
  }
  @IsNotEmpty()
  public tenNguoiDung: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(6)
  public matKhau: string;
}
