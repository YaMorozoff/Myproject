import React, { Component } from "react";
import "./app.less";
import { Input } from "arui-feather/input";
import Select from "arui-feather/select";
import Button from "arui-feather/button";
import { Box } from "@material-ui/core";
import { setItems } from "../reducers/reposReducer";

import { SendDialog, ResponseDialog } from "../components";
import connect from "react-redux/lib/connect/connect";

class App extends Component {
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
          this.props.setReduxItems(options);
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
          <div className="inputContainer">
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
        </div>
      );
    }

    if (item.type === "NUMERIC") {
      return (
        <div key={item.type} className="inputBox">
          <p>{item.title}</p>
          <div className="inputContainer">
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
        </div>
      );
    }

    if (item.type === "LIST") {
      return (
        <div key={item.type} className="inputBox">
          <p>{item.title}</p>
          <div className="inputContainer">
            <Select
              width="available"
              className="inputField"
              mode="radio"
              value={this.state.listInput}
              options={this.state.listOptions}
              onChange={(value) => {
                this.setState({ listInput: value });
              }}
            />
          </div>
        </div>
      );
    }
  }
  sendData() {
    this.setState({ isOpen: true });
    setTimeout(() => {
      const selected = this.state.listOptions.filter(
        (item) => item.value === this.state.listInput[0]
      );
      const data = {
        form: {
          text: this.state.textInput,
          numeric: this.state.numericInput,
          list: selected[0]?.text,
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
          })
          .catch((error) => {
            console.log(error.name);
            if (error.name === "AbortError") return;
            throw error;
          });
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }, 3000);
  }
  handleClose() {
    this.setState({ isOpen: false });
    this.controller.abort();
    setTimeout(() => {
      this.controller = new AbortController();
    }, 3000);
  }
  handleContinue() {
    this.setState({
      ifLoadTrue: false,
      textInput: "",
      numericInput: "",
      listInput: [this.state.listOptions[0]?.value],
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
        <Button
          id="sendDataButton"
          onClick={this.sendData.bind(this)}
          view="rounded"
          text="Отправить"
        />
        <Box>
          <SendDialog
            open={this.state.isOpen}
            onClose={this.handleClose.bind(this)}
            action={this.handleClose.bind(this)}
          />
          <ResponseDialog
            open={this.state.ifLoadTrue}
            onClose={this.handleClose.bind(this)}
            action={this.handleContinue.bind(this)}
            text={this.state.result}
          />
        </Box>

        <img src={image} />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  reduxItems: state.repos.items,
});

const mapDispatchToProps = {
  setReduxItems: setItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
