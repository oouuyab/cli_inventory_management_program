const inquirer = require('inquirer');

const option = [
    {
        type: 'input',
        name: 'menu',
        message: '품번을 입력해주세요 : '
    }
];

const setReceiptMode = () => {
    try {
    } catch (err) {
        console.log('setReceiptMode err');
        console.log(err);
    }
};

module.exports = () => {
    try {
        inquirer.prompt(option).then(setReceiptMode);
    } catch (err) {
        console.log('issueView err');
        console.log(err);
    }
};
