import Router from 'koa-router';
import posts from './posts';
import auth from './auth';

const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());

api.get('/', (ctx) => {
  ctx.body = 'api 주소 실행중';
});

// 라우터를 내보냅니다.
export default api;
