import React, {Component} from 'react';
import './app.less'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error:null,
            isLoaded: false,
            items:[],

        };
    }
    componentDidMount() {
        fetch("http://test.clevertec.ru/tt/meta")
            .then(res => res.json())
            .then(
                (result) =>{
                    this.setState({
                        isLoaded:true,
                        items:result.image
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded:true,
                        error
                    });
                }
            )
    }

    render() {
        const {error, isLoaded, items} = this.state();
        if(error) {
            return <p>Error {error.message}</p>
        }
        else if (!isLoaded){
              return <p>Loading {error.message}</p>
            } else{
              return (
                  <img src={items}/>

              )
            }
        }

    }


