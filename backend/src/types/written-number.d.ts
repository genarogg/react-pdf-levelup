declare module 'written-number' {
    interface WrittenNumberOptions {
        lang?: string;
        noAnd?: boolean;
    }

    function writtenNumber(num: number, options?: WrittenNumberOptions): string;

    export = writtenNumber;
}