import React, { Component } from "react";
import "./app.less";
import { Input } from "arui-feather/input";
import Select from "arui-feather/select";
import Button from "arui-feather/button";
import { Box, Dialog } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import Spin from "arui-feather/spin";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      ifLoadTrue: false,
      ifLoadFalse: false,
      isOpen: false,
      items: [],
      textInput: "",
      numericInput: "",
      listInput: null,
      listOptions: [],
    };
    this.controller = new AbortController();
  }

  componentDidMount() {
    const targetUrl = "http://test.clevertec.ru/tt/meta";
    fetch(targetUrl, {
      method: "POST",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          const options = [];

          for (const field of result.fields) {
            if (field.type === "LIST") {
              for (const property in field.values) {
                options.push({ value: property, text: field.values[property] });
              }
            }
          }
          this.setState({
            isLoaded: true,
            title: result.title,
            fields: result.fields,
            image: result.image,
            listOptions: options,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  renderInput(item) {
    if (item.type === "TEXT") {
      return (
        <div key={item.type} className="inputBox">
          <p>{item.title}</p>
          <Input
            label="Текст"
            value={this.state.textInput}
            placeholder="Введите текст"
            view="filled"
            type="text"
            pattern="^[a-zA-Z\s]+$"
            size="m"
            onChange={(value) => {
              this.setState({ textInput: value });
            }}
          />
        </div>
      );
    }

    if (item.type === "NUMERIC") {
      return (
        <div key={item.type} className="inputBox">
          <p>{item.title}</p>
          <Input
            label="Число"
            value={this.state.numericInput}
            placeholder="Введите число"
            view="filled"
            type="number"
            size="m"
            onChange={(value) => {
              this.setState({ numericInput: value });
            }}
          />
        </div>
      );
    }

    if (item.type === "LIST") {
      return (
        <div key={item.type} className="inputBox">
          <p>{item.title}</p>
          <Select
            mode="radio"
            value={this.state.listInput}
            options={this.state.listOptions}
            onChange={(value) => {
              this.setState({ listInput: value });
            }}
          />
        </div>
      );
    }
  }
  sendData() {
    this.setState({ isOpen: true });
    setTimeout(() => {
      const data = {
        form: {
          text: this.state.textInput,
          numeric: this.state.numericInput,
          list: this.state.listInput[0],
        },
      };
      try {
        const response = fetch("http://test.clevertec.ru/tt/data", {
          method: "POST",
          body: JSON.stringify(data),
          signal: this.controller.signal,
        })
          .then((res) => res.json())
          .then((result) => {
            this.setState({
              isLoaded: true,
              isOpen: false,
              ifLoadTrue: true,
              result: result.result,
            });
          });
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }, 3000);
  }
  handleClose() {
    this.setState({ isOpen: false });
    this.controller.abort();
  }
  handleContinue() {
    this.setState({
      ifLoadTrue: false,
      textInput: "",
      numericInput: "",
      listInput: this.state.listOptions[0]?.value,
    });
  }

  render() {
    const { error, isLoaded, title, image, fields } = this.state;
    if (error) {
      return <p>Error {error.message}</p>;
    }

    if (!isLoaded) {
      return <p>Loading...</p>;
    }

    return (
      <div className="mainBox">
        <div className="title">{title}</div>
        {fields.map((field) => this.renderInput(field))}
        <Box>
          <Button
            id="sendDataButton"
            onClick={this.sendData.bind(this)}
            view="rounded"
            text="Отправить"
          />
          <Dialog
            open={this.state.isOpen}
            onClose={this.handleClose.bind(this)}
            disableBackdropClick
          >
            <DialogContent id="dialogContent">
              <Spin size={"xl"} visible={true} />
              <DialogContentText id="dialogText">Отправка...</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                id="cancelButton"
                onClick={this.handleClose.bind(this)}
                view="rounded"
                text="Отмена"
              />
            </DialogActions>
          </Dialog>

          <Dialog
            open={this.state.ifLoadTrue}
            onClose={this.handleClose.bind(this)}
            disableBackdropClick
          >
            <DialogContent id="dialogContent">
              <DialogContentText id="dialogText">
                  {this.state.result}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                id="cancelButton"
                onClick={this.handleContinue.bind(this)}
                view="rounded"
                text="Продолжить"
              />
            </DialogActions>
          </Dialog>
        </Box>

        <img src={image} />
      </div>
    );
  }
}
