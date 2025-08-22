// ==UserScript==
// @name         WhatsApp Web Accessibility Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhance WhatsApp Web accessibility: hotkeys to speak messages (aria-label preferred), wrap messages in h3, live region announcement
// @author       OpenAI, customized for Oriol
// @match        https://web.whatsapp.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    // Ensure jQuery is available and assign to $
    window.$ = window.jQuery || window.$;

    // Insert the aria-live region on document ready
    $(function() {
        if ($('#tmk-wa-speak').length === 0) {
            $('<div id="tmk-wa-speak" aria-live="assertive" aria-atomic="true" style="position:fixed;top:-9999px;left:-9999px;"></div>').appendTo('body');
        }
    });

    // Util: find all visible chat messages in DOM
    function getMessagesArr() {
        // WhatsApp messages have:
        //   .message-in or .message-out and ._amjy
        return $('.message-in._amjy, .message-out._amjy').toArray();
    }

    // Util: extract text to speak from a WhatsApp message node
    function getMessageSpeakText(node) {
        var $msg = $(node);
        // Prefer aria-label if available and non-empty
        var label = $msg.attr('aria-label');
        if (label && label.trim() !== '') return label.trim();
        // Fallback: find .copyable-text
        var $copyable = $msg.find('.copyable-text ._akbu .selectable-text');
        if ($copyable.length) return $copyable.text();
        // Fallback2: all text
        return $msg.text().trim();
    }

    // Announce to live region and use SpeechSynthesis if available
    function speak(text) {
        $('#tmk-wa-speak').text(text);
    }

    // Keyboard: alt+1...alt+0 triggers speak of Nth message from the bottom
    // alt+1 = last msg, alt+2 = 2nd to last, ..., alt+0 = 10th to last
    $(document).on('keydown', function(e) {
        if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
            let num = -1;
            if (e.code.match(/^Digit([1-9])$/)) {
                num = parseInt(e.code.replace('Digit',''),10);
            } else if (e.code === 'Digit0' || e.key === '0') {
                num = 10;
            }
            if (num > 0 && num <= 10) {
                let msgs = getMessagesArr();
                if (msgs.length >= num) {
                    let msgNode = msgs[msgs.length - num];
                    let txt = getMessageSpeakText(msgNode);
                    speak(txt || 'No message found');
                } else {
                    speak('Not enough messages on screen');
                }
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });

    // MutationObserver: wrap any ._amjy inside an <h3> if not already wrapped
    function wrapAllMessages() {
        $('.message-in._amjy, .message-out._amjy').each(function(){
            let $msg = $(this);
            // Only wrap if not already direct child of h3
            if (!$msg.parent().is('h3')) {
                $msg.wrap('<h3 class="tmk-wa-message"></h3>');
            }
        });
    }

    // Observe DOM and wrap new messages as they appear
    function observeAndWrap() {
        // Initial wrap
        wrapAllMessages();

        // Observe the message pane, which contains all chat messages
        var target = null;
        function findContainer() {
            var $el = $('.message-in._amjy, .message-out._amjy').closest('[role="region"],[aria-label]').first();
            return $el.length ? $el.parent()[0] : document.body;
        }
        target = findContainer();

        if (!target) target = document.body;

        // Listen for mutations
        var mo = new MutationObserver(function(mutations) {
            wrapAllMessages();
        });
        mo.observe(target, {childList:true, subtree:true});
    }

    // Wait for WhatsApp web to fully load chat and begin observing/wrapping
    function waitForReady() {
        if ($('.message-in._amjy, .message-out._amjy').length > 0) {
            observeAndWrap();
        } else {
            setTimeout(waitForReady, 1000);
        }
    }
    waitForReady();
})();
