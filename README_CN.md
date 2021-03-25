# CountDownTimer

JavaScript 高精度秒杀倒计时。

## 前言

秒杀活动中，我们需要高精度的秒杀倒计时来满足需求。使用本地客户端时间计时会面临客户端时间不准确的问题，使用服务端时间计时会面临多实例倒计时时，请求接口难以管理的问题。因而我开发了这款高精度的秒杀倒计时，有效解决了问题。

## 特点

> - 计时时间精确。
> - 多实例统一管理。
> - 单实例灵活配置。

## 安装

```bash
npm i count-it-down-timer -S
```

## 使用

```tsx
import React, { useEffect, useState } from 'react';
import { CountDown, CountDownManager } from 'count-it-down-timer';

// 该方法中需要开发者自己请求接口
async function getRemoteDate() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Date.now());
    }, 3000);
  });
}

export function Test() {
  const [timer, setTimer] = useState({});

  useEffect(() => {
    const countDown = new CountDown({
      endTime: Date.now() + 1000 * 100,
      onStep: setTimer,
      onStop() {
        console.log('finished');
      },
      manager: new CountDownManager({
        debounce: 1000 * 3,
        getRemoteDate,
      }),
    });

    // 注意清除倒计时计时器
    return () => {
      countDown.clear();
    };
  }, []);

  return <div>{JSON.stringify(timer)}</div>;
}
```

[multi](example/multi.tsx) 代码演示了用一个 `CountDownManager` 管理器统一管理多个 `CountDown` 实例，在这种模式下，管理器请求完一个接口后，会统一更新所有实例的最新时间。

[single](example/single.tsx) 代码演示了多个`CountDownManager` 管理器管理多个 `CountDown` 实例，这种模式适用于对倒计时有不同精度需求的场景。但值得注意的是，有几个管理器，会开启几个 `setInterval` 去定时请求接口更新实例时间。

## 配置

### CountDown 倒计时配置项

| 配置项   | 类型                                                    | 可选 | 默认值 | 含义             |
| -------- | ------------------------------------------------------- | ---- | ------ | ---------------- |
| endTime  | number                                                  | 必选 | 无     | 倒计时的终止时间 |
| interval | number                                                  | 可选 | 1000ms | 倒计时的终止时间 |
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
