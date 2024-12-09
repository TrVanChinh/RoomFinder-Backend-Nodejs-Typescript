import { IsEmail, IsNotEmpty, MinLength, MaxLength  } from 'class-validator';

export default class RegisterRoomOwnerDto {
  constructor(
    tenNguoiDung: string,
    email: string,
    matKhau: string,
    sdt: string,
    soCCCD: string,
    matTruocCCCD: string,
    matSauCCCD: string,
  ) {
    this.tenNguoiDung = tenNguoiDung;
    this.email = email;
    this.matKhau = matKhau;
    this.sdt = sdt;
    this.soCCCD = soCCCD;
    this.matTruocCCCD = matTruocCCCD;
    this.matSauCCCD = matSauCCCD;
  }
  @IsNotEmpty()
  public tenNguoiDung: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(6)
  public matKhau: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  public sdt: string;

  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(12)
  public soCCCD: string;

  @IsNotEmpty()
  public matTruocCCCD: string;

  @IsNotEmpty()
  public matSauCCCD: string;
}
