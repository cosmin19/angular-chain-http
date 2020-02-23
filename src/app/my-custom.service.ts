import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay, map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class MyCustomService {

    getMessageAfterSeconds(afterSeconds: number, throwError: boolean = false) {
        const message: string = `Hello, after ${afterSeconds} seconds`;

        return of(message).pipe(
            delay(afterSeconds * 1000),
            map((message) => {
                if (throwError) {
                    throw new Error('Not this time!');
                }
                else {
                    return message;
                }
            }));
    }
}
