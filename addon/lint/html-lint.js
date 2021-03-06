// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
// Depends on htmlhint.js from http://htmlhint.com/js/htmlhint.js
// declare global: HTMLHint

(function (mod) {
    // AMD
    
    module.exports = mod(require('../../lib/codemirror'), require('htmlhint')) || module.exports;;
}(function (CodeMirror) {
    'use strict';
    var defaultRules = {
        'tagname-lowercase': true,
        'attr-lowercase': true,
        'attr-value-double-quotes': true,
        'doctype-first': false,
        'tag-pair': true,
        'spec-char-escape': true,
        'id-unique': true,
        'src-not-empty': true,
        'attr-no-duplication': true
    };
    CodeMirror.registerHelper('lint', 'html', function (text, options) {
        var found = [];
        if (!window.HTMLHint)
            return found;
        var messages = HTMLHint.verify(text, options && options.rules || defaultRules);
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];
            var startLine = message.line - 1, endLine = message.line - 1, startCol = message.col - 1, endCol = message.col;
            found.push({
                from: CodeMirror.Pos(startLine, startCol),
                to: CodeMirror.Pos(endLine, endCol),
                message: message.message,
                severity: message.type
            });
        }
        return found;
    });
}));