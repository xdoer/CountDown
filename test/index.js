const { CountDown, CountDownManager } = require('../dist');
const http = require('http');

new CountDown({
  endTime: Date.now() + 1000 * 100,
  onStep(value) {
    console.log(value);
  },
  manager: new CountDownManager({
    fixNow: true,
    fixNowDebounce: 1000 * 3,
    getNow: goReq,
  }),
});

function goReq() {
  return new Promise((resolve, reject) => {
    http
      .get(`http://nodejs.org/dist/index.json?random=${Math.random()}`, res => {
        const date = res.headers['date'];
        console.log('查看修正时间', new Date(date).getTime());
        resolve(new Date(date).getTime());
      })
      .on('error', e => {
        console.log('报错', e);
        resolve(Date.now());
      });
  });
}
