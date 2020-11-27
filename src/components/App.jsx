import React, {Component} from 'react';
import './app.less'
import {Input} from "arui-feather/input";
import Select from 'arui-feather/select';
import Button from 'arui-feather/button';


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
        const targetUrl = 'http://test.clevertec.ru/tt/meta';
        fetch(targetUrl, {
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
        if (item.type === 'TEXT') {
            return (
                <div key={item.type} className="inputBox">
                    <p>{item.title}</p>
                    <Input
                        label='Текст'
                        placeholder='Введите текст'
                        view='filled'
                        type='text'
                        pattern='^[a-zA-Z\s]+$'
                        size='m'
                        onChange={(value) => {
                            this.setState({textInput: value})
                        }}
                    />
                </div>
            )
        }

        if (item.type === 'NUMERIC') {
            return (
                <div key={item.type} className="inputBox">
                    <p>{item.title}</p>
                    <Input
                        label='Число'
                        placeholder='Введите число'
                        view='filled'
                        type='number'
                        size='m'
                        onChange={(value) => {
                            this.setState({numericInput: value})
                        }}
                    />
                </div>
            )
        }

        if (item.type === 'LIST') {
            const options = [];
            for (const property in item.values) {
                options.push({value: property, text: item.values[property]})
            }

            return (
                <div key={item.type} className="inputBox">
                    <p>{item.title}</p>
                    <Select
                        mode='radio'
                        options={ options }
                        onChange={(value) => {
                            this.setState({selectInput: value})
                        }
                        }
                        />
                </div>
            )
        }
    }
    sendData () {
        const {textInput, numericInput, selectInput} = this.state;
        const data = {
            "form":{
                "TEXT":textInput,
                "NUMERIC": numericInput,
                "LIST":selectInput
            }

        };
        try {
            const response = fetch('http://test.clevertec.ru/tt/data', {
                method: 'POST',
                body: JSON.stringify(data),

            });
            console.log('Успех:', JSON.stringify(response));
        } catch (error) {
            console.error('Ошибка:', error);
        }

    }
    render() {
        const {error, isLoaded,title,image,fields,textInput, numericInput, selectInput}= this.state;
        console.log(numericInput, textInput, selectInput)
        if(error) {
            return <p>Error {error.message}</p>
        }

        if (!isLoaded){
              return <p>Loading...</p>
            }

              return (
                  <div className="mainBox">
                      <div className="title">{title}</div>
                      {fields.map(field =>
                          this.renderInput(field))}
                      <Button
                          onClick={this.sendData}
                          view='rounded'
                          text='Отправить'
                      />
                      <img src={image}
                      />

                  </div>
              )
            }
        }






