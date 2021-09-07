English | [中文](https://github.com/xdoer/CountDown/blob/main/README_ZH.md)

# CountDown

JS High Precision Countdown

## Introduction

In some spike activity, we need a high-precision countdown to meet the demand. The use of local client time timing will face the problem of inaccurate client time, and the use of server-side time timing will face the problem that the request interface is difficult to manage when multi-instance countdown is used. So I developed this high-precision countdown timer, which effectively solved the problem.

## Features

> - Accurate Timing。
> - Unified management of multiple instances。
> - Flexible configuration of a single instance。
> - Combined timer which based on [TimeoutInterval](https://github.com/xdoer/TimeoutInterval)

## Install

```bash
npm i @xdoer/countdown
```

## Usage

### Local Countdown

Local countdown uses recursive `setTimeout` to continuously correct the timing time for countdown, which is easy to use and reliable.

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

### Server Countdown

Support intermittently pull the remote server time to continuously correct the countdown.

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

// In this method, the developer needs to request the interface and return the server time
async function getRemoteDate() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Date.now());
    }, 3000);
  });
}
```

### Fix Local Countdown

Using local countdown, you will face the problem that the client time is not synchronized with the server time. For some interface encryption and spike scenarios, there will be some unexpected bugs. The normal practice is to offset the server time from the local time. Save it locally, and then perform some time-related operations.

```tsx
import { CountDown } from '@xdoer/countdown';

const offset = Number.parseInt(localStorage.getItem('offset'));

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

### Stop Countdown

```tsx
import { CountDown } from '@xdoer/countdown';

const offset = Number.parseInt(localStorage.getItem('offset'));

const countdown = new CountDown({ endTime: Date.now() + 1000 * 100 });

countdown.clear();
```

## Config

### CountDown Options

| Options  | Type                                                    | Required | Default | Meaning                   |
| -------- | ------------------------------------------------------- | -------- | ------- | ------------------------- |
| endTime  | number                                                  | true     | none    | end of countdown time     |
| interval | number                                                  | false    | 1000ms  | interval of countdown     |
| onStep   | ({ d: number, h: number, m: number, s: number}) => void | false    | none    | step callback             |
| onEnd    | () => void                                              | false    | none    | end of countdown callback |
| manager  | CountDownManager                                        | false    | none    | manager of countdown      |

When the manager is passed in, the server time will be used to continuously modify the timer. Or the local time is used, and the countdown is performed using `setTimeout` recursively.

### CountDownManager Options

| Options       | Type                    | Required | Default          | Meaning                           |
| ------------- | ----------------------- | -------- | ---------------- | --------------------------------- |
| debounce      | number                  | false    | 3000ms           | Time correction every few seconds |
| getRemoteDate | () => Promise\<number\> | false    | () => Date.now() | Request remote time interface     |
