import {fromEvent, Observable, of} from "rxjs";
import {debounceTime, distinctUntilChanged, map, startWith, switchMap, tap} from "rxjs/operators";

const elements = [
  'Africa',
  'Antarctica',
  'Asia',
  'Australia',
  'Europe',
  'North America',
  'South America'
];

const input = document.getElementById('input') as HTMLInputElement;
const hintsContainer = document.getElementById('hints-container') as HTMLDivElement;

const inputs$ = fromEvent(input, 'input');

function getHints(key: string): Observable<string[]> {
  console.log('Api call');
  if (key == '' || !(key != null)) {
    return of(elements);
  }
  return of(
    elements.filter(
      el => el.toLowerCase().includes(key.toLowerCase())
    )
  );
}

const hints$ = inputs$.pipe(
  map((event: InputEvent) => (event.currentTarget as HTMLInputElement).value),
  debounceTime(200),
  distinctUntilChanged(),
  startWith(''),
  switchMap(getHints)
);

hints$.subscribe(
  hints => {
    hintsContainer.innerHTML = '';
    hints.forEach(hint => {
      const el = document.createElement('span');
      el.innerText = hint;
      hintsContainer.appendChild(el);
    })
  }
);
