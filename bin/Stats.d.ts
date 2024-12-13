declare class Stats {
    private stats;
    constructor();
    add(str: string): void;
    get(isCount?: boolean): string[] | {
        [key: string]: number;
    };
}
export { Stats, };
