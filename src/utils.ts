import { MdCode } from "./parse";

export type SupportLanguage = ["javascript" | "java"]
export const supportLanguageList: SupportLanguage = ['javascript']

export const supportLanguage = (language: string) => {
    return supportLanguageList.includes(language as string as any)
}

/**
 * 查询是否在目标区间，若在返回具体区间下标；否则返回-1
 * @param x 坐标
 * @param intervals 目标区间
 * @returns {number}
 */
export function isInRangeBinarySearch(
    x: number,
    intervals: MdCode[]
) {
    let left = 0;
    let right = intervals.length - 1;

    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        const { start, end } = intervals[mid];
        if (x >= start && x <= end) {
            return mid; // x 在当前区间内
        }
        if (x < start) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return -1; // x 不在任何区间内
}