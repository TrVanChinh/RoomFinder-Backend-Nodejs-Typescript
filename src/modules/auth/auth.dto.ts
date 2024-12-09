import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export default class LoginDto {
  constructor(email: string, matKhau: string, maLTK: number) {
    this.email = email;
    this.matKhau = matKhau;
  }
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(6)
  public matKhau: string;
}
