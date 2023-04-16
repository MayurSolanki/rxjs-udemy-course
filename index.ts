import { forkJoin, from, fromEvent, Observable, of } from 'rxjs';
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
