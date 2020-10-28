const { expect } = require('chai');
const { EOL } = require('os');
const cmd = require('../util/cmd');
const ENTER = '\x0D';

const convertCommonText = (text) => {
    if (text.includes('\u001b')) {
        return text.slice(0, text.length - 11);
    } else {
        return text;
    }
};

describe('getMode test', () => {
    describe('getMode 호출', () => {
        it('명령어 입력 메시지 호출', async () => {
            const res = await cmd.execute('app.js', [], []);
            const result = convertCommonText(res.trim().split(EOL).shift());
            expect(result).to.eql(
                '? 입력(i[income]: 입고, o[outcome]: 출고, l[list]: 재고 리스트, q[quit]: 종료) : '
            );
        });
    });

    describe('명령어 입력 test', () => {
        it('아무 명령어 입력하지 않고 ENTER 입력 시, 명령어 입력 메시지 다시 호출', async () => {
            const res = await cmd.execute('app.js', [], [ENTER]);
            const result = convertCommonText(res.trim().split(EOL).shift());
            expect(result).to.eql(
                '? 입력(r[good receipt]: 입고, i[good issue]: 출고, l[list]: 재고 리스트, q[quit]: 종료) : '
            );
        });

        it('명령어 리스트에 없는 명령어 입력 시, 명령어 입력 메시지 다시 호출', async () => {
            const res = await cmd.execute('app.js', [], [ENTER]);
            const result = convertCommonText(res.trim().split(EOL).shift());
            expect(result).to.eql(
                '? 입력(r[good receipt]: 입고, i[good issue]: 출고, l[list]: 재고 리스트, q[quit]: 종료) : '
            );
        });

        it('q 입력 시 프로그램 종료', async () => {
            const res = await cmd.execute('app.js', [], ['q', ENTER]);
            const result = convertCommonText(res.trim().split(EOL).shift());
            expect(result).to.eql('프로그램을 종료합니다.');
        });

        it('r 입력 시 good receipt(입고) 모드 실행 및 명령어 입력 메시지 호출', async () => {
            const res = await cmd.execute('app.js', [], ['i', ENTER]);
            const result = convertCommonText(res.trim().split(EOL).shift());
            expect(result).to.eql(
                'good receipt(입고) 모드로 진입했습니다. \n ? 품번을 입력해주세요 : '
            );
        });

        it('i 입력 시 good issue(출고) 모드 실행 및 명령어 입력 메시지 호출', async () => {
            const res = await cmd.execute('app.js', [], ['o', ENTER]);
            const result = convertCommonText(res.trim().split(EOL).shift());
            expect(result).to.eql(
                'good issue(출고) 모드로 진입했습니다. \n ? 품번을 입력해주세요 : '
            );
        });

        it('l 입력 시 재고 리스트 출력 및 명령어 입력 메시지 호출', async () => {
            const res = await cmd.execute('app.js', [], ['l', ENTER]);
            const result = convertCommonText(res.trim().split(EOL).shift());
            expect(result).to.eql(
                '재고 리스트를 출력합니다. \n ? 입력(a[all] : 전체 조회, i[item] : 품번 조회, t[time] : 기간 조회) : '
            );
        });
    });
});

//
