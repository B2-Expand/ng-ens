export interface Record {
    addr: string;
    content: string;
    pubkey: string;
    text: {
        [any: string]: string;
    };
    abis: {
        [index: number]: string;
    }
}