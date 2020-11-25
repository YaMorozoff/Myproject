import React, {Component} from 'react';
import './app.less'
import {Input} from "arui-feather/input";
import {InputAutocomplete} from "arui-feather/input-autocomplete";


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error:null,
            isLoaded: false,
            items:[],
            textInput: '',
            numericInput: '',
            selectInput: null

        };
    }
    componentDidMount() {
        let  proxyUrl, targetUrl;
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
                        title:result.title,
                        fields:result.fields,
                        image:result.image

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

    renderInput (item) {
        console.log(item)
        if (item.type === 'TEXT') {
            return (
                <div>
                    <p>{item.title}</p>
                    <Input
                        label='Имя'
                        placeholder='Введите ваше имя'
                        view='filled'
                        size='m'
                        onChange={(value) => {
                            this.setState({textField: value})
                        }}
                    />
                </div>
            )
        }

        if (item.type === 'NUMERIC') {
            return (
                <div>
                    <p>{item.title}</p>
                    <Input
                        label='Имя'
                        placeholder='Введите ваше имя'
                        view='filled'
                        size='m'
                        onChange={(value) => {
                            this.setState({numericField: value})
                        }}
                    />
                </div>
            )
        }

        if (item.type === 'LIST') {
            return (
                <div>
                    <p>{item.title}</p>
                    <InputAutocomplete
                        options={ item.values }
                    />
                </div>
            )
        }
    }
    render() {
        const {error, isLoaded,title,image,fields} = this.state;
        if(error) {
            return <p>Error {error.message}</p>
        }

        if (!isLoaded){
              return <p>Loading...</p>
            }

              return (
                  <div>
                      {fields.map(field =>
                          this.renderInput(field))}
                  </div>
              )
            }
        }






