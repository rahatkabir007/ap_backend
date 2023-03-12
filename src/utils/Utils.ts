/* eslint-disable @typescript-eslint/no-var-requires */
// import shortid from 'shortid-fix';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const shortid = require('shortid-fix');

// shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_');

export class Utils {
    static getUniqueId(name: string) {
        const slug = `${name.toLowerCase().split(" ").join("_")}${shortid.generate()}`
        return slug
    }
}