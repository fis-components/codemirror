// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
    // AMD
    
    module.exports = mod(require('../../lib/codemirror')) || module.exports;;
}(function (CodeMirror) {
    'use strict';
    CodeMirror.defineMode('apl', function () {
        var builtInOps = {
            '.': 'innerProduct',
            '\\': 'scan',
            '/': 'reduce',
            '\u233F': 'reduce1Axis',
            '\u2340': 'scan1Axis',
            '\xA8': 'each',
            '\u2363': 'power'
        };
        var builtInFuncs = {
            '+': [
                'conjugate',
                'add'
            ],
            '\u2212': [
                'negate',
                'subtract'
            ],
            '\xD7': [
                'signOf',
                'multiply'
            ],
            '\xF7': [
                'reciprocal',
                'divide'
            ],
            '\u2308': [
                'ceiling',
                'greaterOf'
            ],
            '\u230A': [
                'floor',
                'lesserOf'
            ],
            '\u2223': [
                'absolute',
                'residue'
            ],
            '\u2373': [
                'indexGenerate',
                'indexOf'
            ],
            '?': [
                'roll',
                'deal'
            ],
            '\u22C6': [
                'exponentiate',
                'toThePowerOf'
            ],
            '\u235F': [
                'naturalLog',
                'logToTheBase'
            ],
            '\u25CB': [
                'piTimes',
                'circularFuncs'
            ],
            '!': [
                'factorial',
                'binomial'
            ],
            '\u2339': [
                'matrixInverse',
                'matrixDivide'
            ],
            '<': [
                null,
                'lessThan'
            ],
            '\u2264': [
                null,
                'lessThanOrEqual'
            ],
            '=': [
                null,
                'equals'
            ],
            '>': [
                null,
                'greaterThan'
            ],
            '\u2265': [
                null,
                'greaterThanOrEqual'
            ],
            '\u2260': [
                null,
                'notEqual'
            ],
            '\u2261': [
                'depth',
                'match'
            ],
            '\u2262': [
                null,
                'notMatch'
            ],
            '\u2208': [
                'enlist',
                'membership'
            ],
            '\u2377': [
                null,
                'find'
            ],
            '\u222A': [
                'unique',
                'union'
            ],
            '\u2229': [
                null,
                'intersection'
            ],
            '\u223C': [
                'not',
                'without'
            ],
            '\u2228': [
                null,
                'or'
            ],
            '\u2227': [
                null,
                'and'
            ],
            '\u2371': [
                null,
                'nor'
            ],
            '\u2372': [
                null,
                'nand'
            ],
            '\u2374': [
                'shapeOf',
                'reshape'
            ],
            ',': [
                'ravel',
                'catenate'
            ],
            '\u236A': [
                null,
                'firstAxisCatenate'
            ],
            '\u233D': [
                'reverse',
                'rotate'
            ],
            '\u2296': [
                'axis1Reverse',
                'axis1Rotate'
            ],
            '\u2349': [
                'transpose',
                null
            ],
            '\u2191': [
                'first',
                'take'
            ],
            '\u2193': [
                null,
                'drop'
            ],
            '\u2282': [
                'enclose',
                'partitionWithAxis'
            ],
            '\u2283': [
                'diclose',
                'pick'
            ],
            '\u2337': [
                null,
                'index'
            ],
            '\u234B': [
                'gradeUp',
                null
            ],
            '\u2352': [
                'gradeDown',
                null
            ],
            '\u22A4': [
                'encode',
                null
            ],
            '\u22A5': [
                'decode',
                null
            ],
            '\u2355': [
                'format',
                'formatByExample'
            ],
            '\u234E': [
                'execute',
                null
            ],
            '\u22A3': [
                'stop',
                'left'
            ],
            '\u22A2': [
                'pass',
                'right'
            ]
        };
        var isOperator = /[\.\/⌿⍀¨⍣]/;
        var isNiladic = /⍬/;
        var isFunction = /[\+−×÷⌈⌊∣⍳\?⋆⍟○!⌹<≤=>≥≠≡≢∈⍷∪∩∼∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⌷⍋⍒⊤⊥⍕⍎⊣⊢]/;
        var isArrow = /←/;
        var isComment = /[⍝#].*$/;
        var stringEater = function (type) {
            var prev;
            prev = false;
            return function (c) {
                prev = c;
                if (c === type) {
                    return prev === '\\';
                }
                return true;
            };
        };
        return {
            startState: function () {
                return {
                    prev: false,
                    func: false,
                    op: false,
                    string: false,
                    escape: false
                };
            },
            token: function (stream, state) {
                var ch, funcName;
                if (stream.eatSpace()) {
                    return null;
                }
                ch = stream.next();
                if (ch === '"' || ch === '\'') {
                    stream.eatWhile(stringEater(ch));
                    stream.next();
                    state.prev = true;
                    return 'string';
                }
                if (/[\[{\(]/.test(ch)) {
                    state.prev = false;
                    return null;
                }
                if (/[\]}\)]/.test(ch)) {
                    state.prev = true;
                    return null;
                }
                if (isNiladic.test(ch)) {
                    state.prev = false;
                    return 'niladic';
                }
                if (/[¯\d]/.test(ch)) {
                    if (state.func) {
                        state.func = false;
                        state.prev = false;
                    } else {
                        state.prev = true;
                    }
                    stream.eatWhile(/[\w\.]/);
                    return 'number';
                }
                if (isOperator.test(ch)) {
                    return 'operator apl-' + builtInOps[ch];
                }
                if (isArrow.test(ch)) {
                    return 'apl-arrow';
                }
                if (isFunction.test(ch)) {
                    funcName = 'apl-';
                    if (builtInFuncs[ch] != null) {
                        if (state.prev) {
                            funcName += builtInFuncs[ch][1];
                        } else {
                            funcName += builtInFuncs[ch][0];
                        }
                    }
                    state.func = true;
                    state.prev = false;
                    return 'function ' + funcName;
                }
                if (isComment.test(ch)) {
                    stream.skipToEnd();
                    return 'comment';
                }
                if (ch === '\u2218' && stream.peek() === '.') {
                    stream.next();
                    return 'function jot-dot';
                }
                stream.eatWhile(/[\w\$_]/);
                state.prev = true;
                return 'keyword';
            }
        };
    });
    CodeMirror.defineMIME('text/apl', 'apl');
}));