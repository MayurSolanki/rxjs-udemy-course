import { from, Observable, of } from 'rxjs';

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

// 