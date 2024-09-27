import { Pool } from 'pg';

// PostgreSQL 연결 정보 설정
const pool = new Pool({
  user: 'postgres',          // PostgreSQL 사용자 이름
  host: '127.0.0.1',        // PostgreSQL 서버 호스트
  database: 'meal_tickets', // 데이터베이스 이름
  password: 'wjdgh9512!',    // 비밀번호
  port: 5432,                // PostgreSQL 기본 포트
});
console.log(pool);
export default pool;
