require('dotenv').config();
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api';
import Koa from 'koa';
import jwtMiddleware from './lib/jwtMiddleware';
// import createFakeData from './createFakeData';

const app = new Koa();
const router = new Router();
const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to %d', port);
});
