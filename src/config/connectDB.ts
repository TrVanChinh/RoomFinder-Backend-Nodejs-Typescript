import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import defineAssociations from '../associations';
dotenv.config();

// Khởi tạo kết nối Sequelize
const sequelize = new Sequelize({
    username: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
}); 

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export { sequelize };
export default connection;
