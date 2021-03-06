require('dotenv').config();
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import Koa from 'koa';
import cors from '@koa/cors';
// import createFakeData from './createFakeData';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

const { PORT, MONGO_URI } = process.env;

const options = {
  auth: {
    authSource: 'admin',
  },
  user: 'root',
  pass: 'rootpw',
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose
  .connect(MONGO_URI, options)
  .then(() => {
    console.log('Connected to MongoDB');
    // createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
const router = new Router();

router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

app.proxy = true;

app.use(
  cors({
    origin: 'https://www.stovice.com',
    // origin: 'http://13.125.216.198',
    // origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// app.use(async (ctx, next) => {
// ctx.set('Access-Control-Allow-Origin', '*');
// ctx.set('Access-Control-Allow-Credentials', 'true');
// ctx.set(
//   'Access-Control-Allow-Headers',
//   'Origin, X-Requested-With, Content-Type, Accept',
// );
// ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
// await next();
// });
app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve(__dirname, '../../stovice_react/build');
app.use(serve(buildDirectory));
app.use(async (ctx) => {
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to %d', port);
});
