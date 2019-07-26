import React, { PureComponent } from 'react'
import { Observable, Subject, interval, of, fromEvent } from "rxjs";
import { map, take, filter, mergeMap, debounceTime } from "rxjs/operators";

export default class Rxjs extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };

        this.updateObs = this.updateObs.bind(this);

        this.sub$ = new Subject();

        this.sub$.pipe(debounceTime(2000)).subscribe(x => console.log('debounce',x));

        fromEvent(document,'click').subscribe(x => console.log(x));

        this.observable$ = Observable.create(observer => {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        });

        this.observable$.subscribe(
            value => console.log(value),
            err => {},
            () => console.log('end')
        );

        this.subject$ =  new Subject();
        this.subject$.subscribe(x => console.log('subs',x),()=>{},()=>console.log('done lololol'));
        this.subject$.next(1);
        this.subject$.next(2);
        this.subject$.next(3);
        this.subject$.subscribe(y => console.log('new subs',y));
        this.subject$.next(4);
        this.subject$.next(5);
        this.subject$.complete();

        const interval$ = interval(1000);
        const example$ = interval$.pipe(
            take(5),
            map(x => x^2),
            filter(x => x%2 === 0)
        );

        const numbers$ =  of(1,2,3,4,5,6,7);

        example$.subscribe(x => console.log(x));

        const arr = ['a','b','c','d'];
        this._of$ = of([...arr]);

        this._of$.pipe(mergeMap(x => numbers$.pipe(take(5),map(i => i+x))))
            .subscribe(x => {
            console.log(x);
        });
    }

    componentWillUnmount() {
        this.observable$.unsubscribe();
        this.subject$.unsubscribe();
    }

    updateObs(e){
        e.preventDefault();
        console.log(e.target.value);
        this.sub$.next(e.target.value);
        this.setState({text: e.target.value})

    }

    render() {
        return(<div>
            <button>Click me</button>
            <input type='text' value={this.state.text} placeholder="Type here" onChange={this.updateObs} />
        </div>)
    }
}

