# CountDown

JavaScript 高精度秒杀倒计时。

## 前言

秒杀活动中，我们需要高精度的秒杀倒计时来满足需求。使用本地客户端时间计时会面临客户端时间不准确的问题，使用服务端时间计时会面临多实例倒计时时，请求接口难以管理的问题。因而我开发了这款高精度的秒杀倒计时，有效解决了问题。

## 特点

> - 计时时间精确。
> - 多实例统一管理。
> - 单实例灵活配置。
> - 单一 setInterval 实例

## 安装

```bash
npm i @xdoer/countdown
```

## 使用

### 使用本地时间倒计时

本地倒计时利用递归 `setTimeout` ，不断修正计时时间来进行倒计时，简单易用，性能可靠。

```tsx
import { CountDown } from '@xdoer/countdown';

const date = new Date();
date.setHours(date.getHours() + 1);

new CountDown({
  endTime: date.getTime(),
  onStep({ d, h, m, s }) {
    console.log(`${d}天${h}时${m}分${s}秒`);
  },
  onEnd() {
    console.log('finished');
  },
});
```

### 使用服务端修正倒计时

支持间歇拉取远程服务器时间，来不断修正倒计时。

```tsx
import { CountDown, CountDownManager } from '@xdoer/countdown';

const manager = new CountDownManager({
  debounce: 1000 * 3,
  getRemoteDate,
});

new CountDown({
  endTime: Date.now() + 1000 * 100,
  onStep({ d, h, m, s }) {
    console.log(`${d}天${h}时${m}分${s}秒`);
  },
  onEnd() {
    console.log('finished');
  },
  manager,
});

// 该方法中需要开发者自己请求接口，返回服务器时间
async function getRemoteDate() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Date.now());
    }, 3000);
  });
}
```

### 本地时间矫正

使用本地时间进行倒计时，会面临客户端时间与服务端时间不同步的问题，对于一些接口加密、秒杀场景来说，会有一些意想不到的 bug, 常规做法是将服务器时间与本地时间偏移量存到本地，再进行一些关于时间的操作。

```tsx
import { CountDown } from '@xdoer/countdown';

new CountDown(
  {
    endTime: Date.now() + 1000 * 100,
    onStep({ d, h, m, s }) {
      console.log(`${d}天${h}时${m}分${s}秒`);
    },
    onEnd() {
      console.log('finished');
    },
  },
  () => {
    return Date.now() + offsetTime;
  }
);
```

## 配置

### CountDown 倒计时配置项

| 配置项   | 类型                                                    | 可选 | 默认值 | 含义             |
| -------- | ------------------------------------------------------- | ---- | ------ | ---------------- |
| endTime  | number                                                  | 必选 | 无     | 倒计时的终止时间 |
| interval | number                                                  | 可选 | 1000ms | 计时间隔         |
| onStep   | ({ d: number, h: number, m: number, s: number}) => void | 可选 | 无     | 计时回调         |
| onEnd    | () => void                                              | 可选 | 无     | 计时终止回调     |
| manager  | CountDownManager                                        | 可选 | 无     | 倒计时实例管理器 |

传入 manager 时，会使用服务端时间不断修正计时器。不传 manager 时，使用本地时间，利用 `setTimeout` 递归进行倒计时。

### CountDownManager 倒计时实例接口请求管理器

| 配置项        | 类型                    | 可选 | 默认值           | 含义                 |
| ------------- | ----------------------- | ---- | ---------------- | -------------------- |
| debounce      | number                  | 可选 | 3000ms           | 每隔几秒进行时间矫正 |
| getRemoteDate | () => Promise\<number\> | 可选 | () => Date.now() | 请求远程时间接口     |

## 参考

[可以详细的讲一下平时网页上做活动时的倒计时是怎么实现的吗？](https://www.zhihu.com/question/28896402)
