/*
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * Copyright (C) 2015 Andras Sarvari <andras.sarvari@sarvaria.net>
 */

var Action = function(options) {

    // Reference to the current object
    
    var self = this;
    
    // Checking option parameters

    options = options || {};
    
    if (typeof (options) !== 'object') {
        throw new TypeError('options must be an object');
    } else if (options.workerURL !== undefined && typeof(options.workerURL) !== 'string') {
        throw new TypeError('options.workerURL must be a string');
    } else if (options.action !== undefined && typeof(options.action) !== 'string') {
        throw new TypeError('options.action must be a string');
    } else if (options.options !== undefined && typeof(options.options) !== 'object') {
        throw new TypeError('options.options must be an object');
    } else if (options.messageprocessor !== undefined && typeof(options.messageprocessor) !== 'function') {
        throw new TypeError('options.messageprocessor must be a function');
    }
    
    if (options.workerURL === undefined) {
        throw new TypeError('options.workerURL is mandatory');
    } else if (options.action === undefined) {
        throw new TypeError('options.action is mandatory');
    } else if (options.messageprocessor === undefined) {
        throw new TypeError('options.messageprocessor is mandatory');
    }
    
    // Initializing
    
    self.workerURL = options.workerURL;
    self.action = options.action;
    self.options = options.options || {};
    self.messageprocessor = options.messageprocessor;
};

/**
 * Executes the action in the worker.
 */

Action.prototype.run = function() {

    // Reference to the current object
    
    var self = this;

    // Checking worker support
    
    if (typeof(Worker) !== 'undefined') {
        
        // Creating worker if it does not exists yet
        
        self.worker = self.worker || {};
        
        if(!self.worker[self.workerURL]) {
            self.worker[self.workerURL] = new Worker(self.workerURL);
        }

        // Executing the action

        self.worker[self.workerURL].postMessage(JSON.stringify(
            {
                action:  self.action,
                options: self.options
            }
        ));
        
        // Worker message handler
        
        self.worker[self.workerURL].onmessage = function(event) {
            if (self.messageprocessor) {
                self.messageprocessor(event.data.content);
            }
        };
    } else {
        
        // Unsupported browser
        
        throw new Error('Browser does not support Web Workers');
    }    
};