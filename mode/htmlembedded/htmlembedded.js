// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
    // AMD
    
    module.exports = mod(require('../../lib/codemirror'), require('../htmlmixed/htmlmixed'), require('../../addon/mode/multiplex')) || module.exports;;
}(function (CodeMirror) {
    'use strict';
    CodeMirror.defineMode('htmlembedded', function (config, parserConfig) {
        return CodeMirror.multiplexingMode(CodeMirror.getMode(config, 'htmlmixed'), {
            open: parserConfig.open || parserConfig.scriptStartRegex || '<%',
            close: parserConfig.close || parserConfig.scriptEndRegex || '%>',
            mode: CodeMirror.getMode(config, parserConfig.scriptingModeSpec)
        });
    }, 'htmlmixed');
    CodeMirror.defineMIME('application/x-ejs', {
        name: 'htmlembedded',
        scriptingModeSpec: 'javascript'
    });
    CodeMirror.defineMIME('application/x-aspx', {
        name: 'htmlembedded',
        scriptingModeSpec: 'text/x-csharp'
    });
    CodeMirror.defineMIME('application/x-jsp', {
        name: 'htmlembedded',
        scriptingModeSpec: 'text/x-java'
    });
    CodeMirror.defineMIME('application/x-erb', {
        name: 'htmlembedded',
        scriptingModeSpec: 'ruby'
    });
}));