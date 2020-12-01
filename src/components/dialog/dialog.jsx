import React from "react";
import "./dialog.less";
import Button from "arui-feather/button";
import { Dialog } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import Spin from "arui-feather/spin";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";

export const SendDialog = ({ open, onClose, action }) => (
  <Dialog open={open} onClose={onClose} disableBackdropClick>
    <DialogContent id="dialogContent">
      <Spin size={"xl"} visible={true} />
      <DialogContentText id="dialogText">Отправка...</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button id="cancelButton" onClick={action} view="rounded" text="Отмена" />
    </DialogActions>
  </Dialog>
);

export const ResponseDialog = ({ open, onClose, text, action }) => (
  <Dialog open={open} onClose={onClose} disableBackdropClick>
    <DialogContent id="dialogContent">
      <DialogContentText id="dialogText">{text}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        id="cancelButton"
        onClick={action}
        view="rounded"
        text="Продолжить"
      />
    </DialogActions>
  </Dialog>
);
