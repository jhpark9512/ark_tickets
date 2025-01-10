import { Pool } from 'pg';
import {config} from 'dotenv';

config();

const pool = new Pool({
  user: process.env.DB_USER,           // PostgreSQL 사용자 이름
  host: process.env.DB_HOST,           // PostgreSQL 서버 호스트
  database: process.env.DB_NAME,       // 데이터베이스 이름
  password: process.env.DB_PASSWORD?.toString(),   // 비밀번호
  port: Number(process.env.DB_PORT),   // PostgreSQL 기본 포트
});
console.log(pool);
export default pool;
