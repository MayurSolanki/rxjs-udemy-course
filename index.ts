import { EMPTY, forkJoin, from, fromEvent, Observable, of, catchError, concatMap, map, filter, tap, mergeAll, mergeMap, delay} from 'rxjs';
import { ajax } from "rxjs/ajax";


/*const interval$ = new Observable<number>(subscriber => {
  let counter = 1;

  const intervalId = setInterval(() => {
    console.log('Emitted', counter);
    subscriber.next(counter++);
  }, 2000);

  return () => {
    clearInterval(intervalId);
  };
});

const subscription = interval$.subscribe(value => console.log(value));

setTimeout(() => {
  console.log('Unsubscribe');
  subscription.unsubscribe();
}, 7000);
*/

// ======== of observable. ======
of('Alice', 'Bob', 'Charlie').subscribe({
  next: (value) => console.log('of values',value),
  complete: () => console.log('complete'),
});

// ==== from observable ======

from(['Alice', 'Bob', 'Charlie']).subscribe({
  next: (value) => console.log('from values',value),
  complete: () => console.log('complete'),
});

// convert promise to observable using the from 
const somePromise = new Promise((resolve, reject) => {
  // resolve('Resolved!');
  reject('Rejected!');
});

const observableFromPromise$ = from(somePromise);

observableFromPromise$.subscribe({
  next: value => console.log(value),
  error: err => console.log('Error:', err),
  complete: () => console.log('Completed')
});

// fromEvent (Dom Event, node js eventEmitter, click event, form Resize event)

const triggerButton = document.querySelector('button#trigger');
fromEvent<MouseEvent>(triggerButton,'click').subscribe(
  event => console.log(event.type,event.x,event.y)
)

    // created observable
const triggerClick$ = new Observable<MouseEvent>(subscriber => {
  const clickHandlerFn = event => {
    console.log('Event callback executed');
    subscriber.next(event);
  };

  // add listner
  triggerButton.addEventListener('click to add event', clickHandlerFn);

  // remove listner
  return () => {
    triggerButton.removeEventListener('click remove event', clickHandlerFn);
  };
});

const subscription = triggerClick$.subscribe(
  event => console.log(event.type, event.x, event.y)
);

setTimeout(() => {
  console.log('Unsubscribe');
  subscription.unsubscribe();
}, 5000);

// forkJoin (Handle multiple http call)


const randomName$ = ajax('https://random-data-api.com/api/name/random_name');

const randomNation$ = ajax('https://random-data-api.com/api/nation/random_nation');

const randomFood$ = ajax('https://random-data-api.com/api/food/random_food');

// randomName$.subscribe(ajaxResponse => console.log(ajaxResponse.response.first_name));
// randomNation$.subscribe(ajaxResponse => console.log(ajaxResponse.response.capital));
// randomFood$.subscribe(ajaxResponse => console.log(ajaxResponse.response.dish));

forkJoin([randomName$, randomNation$, randomFood$]).subscribe(
  ([nameAjax, nationAjax, foodAjax]) => console.log(`${nameAjax.response.first_name} is from ${nationAjax.response.capital} and likes to eat ${foodAjax.response.dish}.`)
);


// concatMap flattening operator example

of('food')
  .pipe(
    map((value) => value),
    concatMap(value =>
      ajax(`https://random-data-api.com/api/${value}/random_${value}`)
    )
  )
  .subscribe((value) => console.log(value));

// Flatenning operator - error handling - 2st Approach
// in 1 st approach, without using a catchError, will receive error //// in error  block, EMPTY will complete the outer observable
  of('food') // something-incorrect
  .pipe(  
  map((value) => value),
    concatMap(value =>
      ajax(`https://random-data-api.com/api/${value}/random_${value}`)
    ),
    catchError(() => EMPTY)
  ).subscribe({
    next: value => console.log(value),
    error: err => console.log('Error:', err),
    complete: () => console.log('Completed')
  });

// Flatenning operator - error handling - 3rd Approach
// without breaking a outer subscription handle error

  of('food') // something-incorrect
  .pipe(  
  map((value) => value),
    concatMap(value =>
      ajax(`https://random-data-api.com/api/${value}/random_${value}`).pipe(
        catchError(error => of(`Could not fetch data: ${error}`))
      )
    )
  ).subscribe({
    next: value => console.log(value),
    error: err => console.log('Error:', err),
    complete: () => console.log('Completed')
  });
  
// Filter opearator - 

  interface NewsItem {
    category: 'Business' | 'Sports';
    content: string;
  }
  
  const newsFeed$ = new Observable<NewsItem>(subscriber => {
    setTimeout(() => 
      subscriber.next({ category: 'Business', content: 'A' }), 1000);
    setTimeout(() => 
      subscriber.next({ category: 'Sports', content: 'B' }), 3000);
    setTimeout(() => 
      subscriber.next({ category: 'Business', content: 'C' }), 4000);
    setTimeout(() => 
      subscriber.next({ category: 'Sports', content: 'D' }), 6000);
    setTimeout(() => 
      subscriber.next({ category: 'Business', content: 'E' }), 7000);
  });
  
  const sportsNewsFeed$ = newsFeed$.pipe(
    filter(item => item.category === 'Sports')
  );
  
  newsFeed$.subscribe(
   // item => console.log(item)
  );

// Map operator
  const randomFirstName$ = ajax<any>('https://random-data-api.com/api/name/random_name').pipe(
  map(ajaxResponse => ajaxResponse.response.first_name)
);

const randomCapital$ = ajax<any>('https://random-data-api.com/api/nation/random_nation').pipe(
  map(ajaxResponse => ajaxResponse.response.capital)
);

const randomDish$ = ajax<any>('https://random-data-api.com/api/food/random_food').pipe(
  map(ajaxResponse => ajaxResponse.response.dish)
);

forkJoin([randomFirstName$, randomCapital$, randomDish$]).subscribe(
  ([firstName, capital, dish]) =>
    console.log(`${firstName} is from ${capital} and likes to eat ${dish}.`)
);

// ExhaustMap waits for the inner observable to finish
// Add outer observable value in queue until inner observable Finished



// practice

const users = ajax({
     url: 'https://devapis.delcaper.com/fulfillment/cod-center/nearby',
     method: 'POST',
    headers: {
       'Content-Type': 'application/json',
      //'rxjs-custom-header': 'Rxjs'
     },
    body: {
      "city": "Ahmedabad",
      "latitude": 23.0022242,
      "longitude": 72.5020437
    }
  })
//   .pipe(
//    map(response => console.log('response: ', response)),
//      catchError(error => {
//       console.log('error: ', error);
//        return of(error);
//    })
//  );

users.pipe(
   mergeMap(info =>  {
    const resultArr =  info.response.data
    console.log('resultArr',resultArr);
    return from(resultArr)
   }
  ),
  // mergeAll(),
  delay(1000),
  tap(tapData => console.log('tap',tapData))
).subscribe({
  next: (data) => console.log('response....',data),
  error: (error) => console.log('error',error),
  complete: () => console.log('completed....')
})
