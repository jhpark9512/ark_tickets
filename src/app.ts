import * as express from 'express';
import router from './database/routes'
import * as cors from 'cors';


const app = express();
const port = 5000;
app.use(cors());
app.use(express.json()); //JSON처리 미들웨어
app.use('/', router); //라우터 등록

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`)
})