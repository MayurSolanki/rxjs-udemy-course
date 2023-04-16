import { Observable, of } from "rxjs";

interface FetchConfig {
  hasError?: boolean;
}

export const source$ = of('Alice', 'Ben', 'Charlie');

export function fetchSomeData(config?: FetchConfig): Observable<string> {
  return new Observable(subscriber => {
    // Random time 1-5 seconds;
    const randomTimeout = 1000 + Math.random() * 3000;

    setTimeout(() => {
      if (config?.hasError) {
        subscriber.error(new Error('Failure!'));
      } else {
        subscriber.next('OK!');
        subscriber.complete();
      }
    }, randomTimeout);
  });
}

export function fetchSomeDataError() {
  return fetchSomeData({hasError: true});
}
