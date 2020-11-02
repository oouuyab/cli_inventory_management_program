const inquirer = require('inquirer');
const issueView = require('./issueView');
const receiptView = require('./receiptView');
const listView = require('./listView');

const option = [
    {
        type: 'input',
        name: 'menu',
        message: '입력(r[receipt]: 입고, i[issue]: 출고, l[list]: 재고 리스트, q[quit]: 종료) : '
    }
];

const setMode = async (choice) => {
    try {
        let mode = choice.menu;
        let message;
        if (mode === 'q') {
            console.log('프로그램을 종료합니다.');
            return;
        } else if (mode === 'i') {
            console.log('issue(출고) 모드에 진입합니다.');
            return issueView();
        } else if (mode === 'r') {
            console.log('receipt(입고) 모드에 진입합니다.');
            return receiptView();
        } else if (mode === 'l') {
            console.log('list 모드에 진입합니다.');
            return listView();
        } else {
            return getMode();
        }
    } catch (err) {
        console.log('setMode err');
        console.log(err);
        return;
    }
};

const getMode = () => {
    try {
        return inquirer.prompt(option).then(setMode);
    } catch (err) {
        console.log('getMode err');
        console.log(err);
        return;
    }
};

module.exports = getMode;
