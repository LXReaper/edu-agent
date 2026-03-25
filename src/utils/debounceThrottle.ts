/* eslint-disable */
interface FunctionType {
  (...args: any[]): void;
}
/**
 * 函数防抖代码
 * @param func
 * @param duration
 * @return {(function(...[*]): void)|*}
 */
export function debounce(func: FunctionType, duration = 500): FunctionType {
  let timeId: number;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      //将func函数传递的形参作为数组args
      func.apply(this, args);
    }, duration) as any;
  };
}

/**
 * 函数节流代码
 * @param func
 * @param interval
 * @return {(function(): void)|*}
 */
export function throttle_(func: FunctionType, interval = 300): FunctionType {
  let flag = false;

  return function (this: any) {
    if (flag) return;
    flag = true;
    setTimeout(() => {
      func.apply(this);
      flag = false;
    }, interval);
  };
}

/**
 * 函数防抖代码
 * @param func
 * @param duration
 * @return {(function(...[*]): void)|*}
 */
export const debounceX = (func: FunctionType, duration = 500) => {
  let timeId: number;
  return [() => clearTimeout(timeId), function (this: any, ...args: any[]) {
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      //将func函数传递的形参作为数组args
      func.apply(this, args);
    }, duration) as any;
  }];
}
