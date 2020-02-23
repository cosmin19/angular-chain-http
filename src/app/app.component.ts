import { Component } from '@angular/core';
import { MyServiceService } from './my-service.service';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private _myService: MyServiceService) { }

    ngOnInit(): void {
        let srv = this._myService;

        // CASE 1: ITERATIVE
        srv.getMessageAfterSeconds(3).subscribe((message) => console.log(message));
        srv.getMessageAfterSeconds(2).subscribe((message) => console.log(message));
        srv.getMessageAfterSeconds(1).subscribe((message) => console.log(message));

        // OUTPUT:
        // Hello, after 1 seconds
        // Hello, after 2 seconds
        // Hello, after 3 seconds



        // CASE 2: CHAIN
        srv.getMessageAfterSeconds(3)
            .pipe(
                // Handle first message
                map((message) => console.log(message))

                // Trigger second call and handle data
                , mergeMap(() => srv.getMessageAfterSeconds(2))
                , map((message) => console.log(message))

                // Trigger third calland handle data
                , mergeMap(() => srv.getMessageAfterSeconds(1)),
                map((message) => console.log(message))
            ).subscribe(() => console.log('Chain executed successfully. Good job :)'));

        // OUTPUT:
        // Hello, after 3 seconds
        // Hello, after 2 seconds
        // Hello, after 1 seconds
        // Chain executed successfully. Good job :)



        // CASE 3: CHAIN WITHOUT ERROR HANDLING
        srv.getMessageAfterSeconds(3)
            .pipe(
                // Handle first message
                map((message) => console.log(message))

                // Trigger second call and handle data
                , mergeMap(() => srv.getMessageAfterSeconds(2, true))
                , map((message) => console.log(message))

                // Trigger third calland handle data
                , mergeMap(() => srv.getMessageAfterSeconds(1)),
                map((message) => console.log(message))
            ).subscribe(() => console.log('Chain executed successfully. Good job :)'));

        // OUTPUT:
        // Hello, after 3 seconds
        // ERROR Error: Not this time!



        // CASE 3: CHAIN WITH ERROR HANDLING
        srv.getMessageAfterSeconds(3)
            .pipe(
                // Handle first message
                map((message) => console.log(message))

                // Trigger second call and handle data
                , mergeMap(() => srv.getMessageAfterSeconds(2, true).pipe(catchError(() => of('There was an error but I fixed it!'))))
                , map((message) => console.log(message))

                // Trigger third calland handle data
                , mergeMap(() => srv.getMessageAfterSeconds(1)),
                map((message) => console.log(message))
            ).subscribe(() => console.log('Chain executed successfully. Good job :)'));

        // OUTPUT:
        // Hello, after 3 seconds
        // There was an error but I fixed it!
        // Hello, after 1 seconds
        // Chain executed successfully. Good job :)
    }
}
