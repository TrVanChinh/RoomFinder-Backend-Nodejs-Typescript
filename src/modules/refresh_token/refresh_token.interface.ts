export interface IRefreshToken {
    id: number;
    maNguoiDung: number;
    token: string;
    ngayHetHan: Date;
    ngayTao: Date;
    ngayThuHoi: Date | null; 
    tokenThayThe: string | null; 
    trangThaiHoatDong: boolean;
    hetHan: boolean;
  }