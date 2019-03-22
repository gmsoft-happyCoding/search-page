interface Confirm {
  (message: string): Promise<any>;
}

interface Callback {
  (ok: boolean): void;
}

const defaultConfirm: Confirm = message =>
  new Promise((resolve, reject) => {
    /* eslint-disable no-unused-expressions,no-alert */
    window.confirm(message) ? resolve() : reject();
  });

let confirm: Confirm = defaultConfirm;

export const setConfirm = (c: Confirm) => {
  confirm = c;
};

export const resetConfirm = () => {
  confirm = defaultConfirm;
};

export const getConfirmation = (message: string, callback: Callback) => {
  confirm(message).then(() => callback(true), () => callback(false));
};
