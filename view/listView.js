const inquirer = require('inquirer');

const option = [
    {
        type: 'input',
        name: 'menu',
        message: '입력(a[all] : 전체 조회, i[item] : 품번 조회, t[time] : 기간 조회) : '
    }
];

const setListMode = () => {
    try {
    } catch (err) {
        console.log('setListMode err');
        console.log(err);
    }
};

module.exports = () => {
    try {
        inquirer.prompt(option).then(setListMode);
    } catch (err) {
        console.log('issueView err');
        console.log(err);
    }
};
