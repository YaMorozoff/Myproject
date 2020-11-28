import React, {Component} from 'react';
import './app.less'
import {Input} from "arui-feather/input";
import Select from 'arui-feather/select';
import Button from 'arui-feather/button';
import {Box, Dialog} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import Spin from "arui-feather/spin";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error:null,
            isLoaded: false,
            ifLoadTrue:false,
            ifLoadFalse:false,
            setOpen:false,
            items:[],
            textInput: '',
            numericInput: '',
            listInput: null

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
                            this.setState({listInput: value})
                        }
                        }
                        />
                </div>
            )
        }
    }
    sendData () {
        console.log(this.state.setOpen)
        this.setState({setOpen: true})
        setTimeout(() => {
            const data = {
                "form": {
                    'text': this.state.textInput,
                    "numeric": this.state.numericInput,
                    "list": this.state.listInput
                }

            };
            try {
                const response = fetch('http://test.clevertec.ru/tt/data', {
                    method: 'POST',
                    body: JSON.stringify(data),


                })
                    .then(res => res.json())
                    .then(
                        (result) =>{

                            this.setState({
                                isLoaded:true,
                                result:result.result



                            });
                        },
                    )
                console.log(result)

                this.setState({setOpen: false})
                this.setState({ifLoadTrue: true})
                console.log('Успех:', JSON.stringify(response));
            } catch (error) {
                console.error('Ошибка:', error);
            }
        },3000)
    }
    handleClose (){
        this.setState({setOpen: false})
        this.setState({ifLoadTrue: false})
        window.location.reload();
    }



    render() {
        const {error, isLoaded,title,image,fields,result}= this.state;
        console.log(result)
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
                          <Box>
                              <Button id="sendDataButton"
                              onClick={this.sendData.bind(this)}
                              view='rounded'
                              text='Отправить'
                          />
                          <Dialog open={this.state.setOpen} onClose={this.handleClose.bind(this)}>
                              <DialogContent id="dialogContent">
                                  <Spin
                                      size={"xl" }
                                      visible={ true }
                                  />
                                  <DialogContentText id="dialogText">
                                      Отправка...
                                  </DialogContentText>

                              </DialogContent>
                              <DialogActions>
                                  <Button id="cancelButton"
                                  onClick={this.handleClose.bind(this)}
                                      view='rounded'
                                      text='Отмена'
                                  />
                              </DialogActions>
                          </Dialog>

                              <Dialog open={this.state.ifLoadTrue} onClose={this.handleClose.bind(this)}>
                                  <DialogContent id="dialogContent">

                                      <DialogContentText id="dialogText">
                                          Данные успешно загружены:
                                          {this.state.result}
                                      </DialogContentText>

                                  </DialogContent>
                                  <DialogActions>
                                      <Button id="cancelButton"
                                              onClick={this.handleClose.bind(this)}
                                              view='rounded'
                                              text='Продолжить'
                                      />
                                  </DialogActions>
                              </Dialog>


                          </Box>

                      <img src={image}
                      />

                  </div>
              )
            }
        }






