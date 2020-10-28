const inquirer = require('inquirer');

const option = [
    {
        type: 'input',
        name: 'menu',
        message: '명령어를 작성하세요(q[quit]: 종료)'
    }
];

const setMode = async (choice) => {
    try {
        let mode = choice.menu;
        let message;
        if (mode === 'q') {
            message = '프로그램을 종료합니다.';
            console.log(message);
            return message;
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
