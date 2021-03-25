# CountDown

JavaScript High Precision Countdown

## Docs

[English](./README.md) | [中文](./README_CN.md)

## Foreword

In the spike activity, we need a high-precision spike countdown to meet the demand. The use of local client time timing will face the problem of inaccurate client time, and the use of server-side time timing will face the problem that the request interface is difficult to manage when multi-instance countdown is used. So I developed this high-precision spike countdown timer, which effectively solved the problem.

## Features

> - High precision
> - Unified management of multiple instances
> - Flexible configuration of single instance

## Config

### CountDown Configuration Item

| Item     | Type                                                    | Optional | Default | Meaning                      |
| -------- | ------------------------------------------------------- | -------- | ------- | ---------------------------- |
| endTime  | number                                                  | -[x]     | None    | end time of countdown        |
| interval | number                                                  | -[]      | 1000ms  | countdown interval           |
| onStep   | ({ d: number, h: number, m: number, s: number}) => void | -[]      | None    | countdown callback peer step |
| onEnd    | () => void                                              | -[]      | None    | countdown callback when stop |
| manager  | CountDownManager                                        | -[]      | None    | countdown manager            |

when you pass manager into `CountDown`, it will use server-side time fix countdown timer.

### CountDownManager 倒计时实例接口请求管理器

| Item          | Type                    | Optional | Default          | Meaning                    |
| ------------- | ----------------------- | -------- | ---------------- | -------------------------- |
| debounce      | number                  | -[]      | 3000ms           | request interface debounce |
| getRemoteDate | () => Promise\<number\> | -[]      | () => Date.now() | request interface instance |

## DEMO

[multi](example/multi.tsx) The code demonstrates the unified management of multiple CountDown instances with a CountDownManager. In this mode, after the manager requests an interface, it will update the latest time of all instances uniformly.

[single](example/single.tsx) The code demonstrates that multiple `CountDownManager` managers manage multiple `CountDown` instances. This mode is suitable for scenarios with different precision requirements for countdowns. But it is worth noting that there are several managers that will open several `setInterval` to periodically request the interface to update the instance time.

```tsx
import React, { useEffect, useState } from 'react';
import { CountDown, CountDownManager } from 'countDown';

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
        console.log('finish');
      },
      manager: new CountDownManager({
        debounce: 1000 * 3,
        getRemoteDate,
      }),
    });

    return () => {
      countDown.clear();
    };
  }, []);

  return <div>{JSON.stringify(timer)}</div>;
}
```

## Reference

[可以详细的讲一下平时网页上做活动时的倒计时是怎么实现的吗？](https://www.zhihu.com/question/28896402)
