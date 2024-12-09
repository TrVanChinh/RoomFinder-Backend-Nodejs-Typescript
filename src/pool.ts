import {Pool} from 'pg'
import * as dotenv from 'dotenv';

dotenv.config();

interface PoolConfig {
    user: string;
    host: string;
    database: string;
    password: string;
    port?: number;
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
} as PoolConfig);


export default pool 

