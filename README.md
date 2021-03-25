# CountDown 高精度秒杀倒计时

## 前言

秒杀活动中，我们需要高精度的秒杀倒计时来满足需求。使用本地客户端时间计时会面临客户端时间不准确的问题，使用服务端时间计时会面临多实例倒计时时，请求接口难以管理的问题。因而我开发了这款高精度的秒杀倒计时，有效解决了问题。

## 特点

> - 计时时间精确（需开启服务端修正时间）。
> - 多实例统一管理[multi](example/multi.tsx)。
> - 单实例灵活配置[single](example/single.tsx)。

## 配置

### CountDown 倒计时配置项

| 配置项   | 类型                                                    | 可选 | 默认值 | 含义             |
| -------- | ------------------------------------------------------- | ---- | ------ | ---------------- |
| endTime  | number                                                  | 必选 | 无     | 倒计时的终止时间 |
| interval | number                                                  | 可选 | 1000ms | 倒计时的终止时间 |
| onStep   | ({ d: number, h: number, m: number, s: number}) => void | 可选 | 无     | 计时回调         |
| onEnd    | () => void                                              | 可选 | 无     | 计时终止回调     |
| manager  | CountDownManager                                        | 可选 | 无     | 倒计时实例管理器 |

### CountDownManager 倒计时实例接口请求管理器

| 配置项         | 类型                    | 可选 | 默认值           | 含义                 |
| -------------- | ----------------------- | ---- | ---------------- | -------------------- |
| fixNow         | boolean                 | 可选 | 无               | 开启远程时间矫正     |
| fixNowDebounce | number                  | 可选 | 3000ms           | 每隔几秒进行时间矫正 |
| getNow         | () => Promise\<number\> | 可选 | () => Date.now() | 请求远程时间接口     |

## 使用

```tsx
import React, { useEffect, useState } from 'react';
import { CountDown, CountDownManager } from 'countDown';

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
      manager: new CountDownManager({
        fixNow: true,
        fixNowDebounce: 1000 * 3,
        getNow: getRemoteDate,
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
