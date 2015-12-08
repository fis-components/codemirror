// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
    // AMD
    
    module.exports = mod(require('../../lib/codemirror')) || module.exports;;
}(function (CodeMirror) {
    'use strict';
    CodeMirror.defineMode('diff', function () {
        var TOKEN_NAMES = {
            '+': 'positive',
            '-': 'negative',
            '@': 'meta'
        };
        return {
            token: function (stream) {
                var tw_pos = stream.string.search(/[\t ]+?$/);
                if (!stream.sol() || tw_pos === 0) {
                    stream.skipToEnd();
                    return ('error ' + (TOKEN_NAMES[stream.string.charAt(0)] || '')).replace(/ $/, '');
                }
                var token_name = TOKEN_NAMES[stream.peek()] || stream.skipToEnd();
                if (tw_pos === -1) {
                    stream.skipToEnd();
                } else {
                    stream.pos = tw_pos;
                }
                return token_name;
            }
        };
    });
    CodeMirror.defineMIME('text/x-diff', 'diff');
}));