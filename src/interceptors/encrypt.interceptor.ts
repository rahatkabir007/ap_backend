import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
let CryptoJS = require("crypto-js");

export interface Response<T> {
    data: T;
}

@Injectable()
export class EncryptInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(map(data => {
            // // Encrypt
            let ciphertext: string = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();

            const obj = {
                ciphertext: ciphertext
            }
            data = obj
            return data
        }));
    }
}