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
        var proxyUrl, targetUrl;
        proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        targetUrl = 'http://test.clevertec.ru/tt/meta';
        fetch(proxyUrl + targetUrl,{
            method:'POST'
            },


        )
            .then(res => res.json())
            .then(
                (result) =>{
                    this.setState({
                        isLoaded:true,
                        items:result.title
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
        const {error, isLoaded, items} = this.state;
        if(error) {
            return <p>Error {error.message}</p>
        }
        else if (!isLoaded){
              return <p>Loading...</p>
            } else{
              return (
                  <ul>
                      {items.map(item =>)}
                  </ul>
              )
            }
        }

    }



