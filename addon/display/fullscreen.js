// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
    // AMD
    
    module.exports = mod(require('../../lib/codemirror')) || module.exports;;
}(function (CodeMirror) {
    'use strict';
    CodeMirror.defineOption('fullScreen', false, function (cm, val, old) {
        if (old == CodeMirror.Init)
            old = false;
        if (!old == !val)
            return;
        if (val)
            setFullscreen(cm);
        else
            setNormal(cm);
    });
    function setFullscreen(cm) {
        var wrap = cm.getWrapperElement();
        cm.state.fullScreenRestore = {
            scrollTop: window.pageYOffset,
            scrollLeft: window.pageXOffset,
            width: wrap.style.width,
            height: wrap.style.height
        };
        wrap.style.width = '';
        wrap.style.height = 'auto';
        wrap.className += ' CodeMirror-fullscreen';
        document.documentElement.style.overflow = 'hidden';
        cm.refresh();
    }
    function setNormal(cm) {
        var wrap = cm.getWrapperElement();
        wrap.className = wrap.className.replace(/\s*CodeMirror-fullscreen\b/, '');
        document.documentElement.style.overflow = '';
        var info = cm.state.fullScreenRestore;
        wrap.style.width = info.width;
        wrap.style.height = info.height;
        window.scrollTo(info.scrollLeft, info.scrollTop);
        cm.refresh();
    }
}));