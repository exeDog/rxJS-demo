import React, { PureComponent } from 'react'
import { Subject } from "rxjs"
import { switchMap, tap, debounceTime, distinctUntilChanged } from "rxjs/operators";

export default class HttpObs extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            text: ''
        };

        this.getImage =  this.getImage.bind(this);



        this._sub$ = new Subject();

        this._sub$.pipe(debounceTime(3000),
            switchMap(searchString => HttpObs.queryApi(searchString)),
            distinctUntilChanged(),
            tap(x => console.log(x))
        ).subscribe(x => this.setState({images: x}));
    }

     static queryApi(searchString){
        return fetch(`https://wwww.reddit.com/search.json?q=${searchString}`,{mode:'no-cors'});
    }

    getImage(e){
        e.preventDefault();
        this._sub$.next(e.target.value);
        this.setState({text: e.target.value});

    }

    render() {

        const images = this.state.images.map(img => {
            return(
                <div>
                    <img src={img} />
                </div>
            )
        });
        return(
            <div>
                <input type='text' value={this.state.text} placeholder='Search' onChange={this.getImage} />
                {images}
            </div>
        )
    }


}