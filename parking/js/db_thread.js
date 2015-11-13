/* global DB */

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

importScripts('db.js');

self.addEventListener('message', function(event) {

    // Getting the options

    var options = JSON.parse(event.data || '{}');

    // Checking option parameters

    if (typeof (options) !== 'object') {
        throw new TypeError('options must be an object');
    } else if (options.action !== undefined && typeof(options.action) !== 'string') {
        throw new TypeError('options.action must be a string');
    }

    if (options.action === undefined) {
        throw new TypeError('options.action is mandatory');
    }

    // Processing the action
    
    var db = new DB();
    
    // Loading car park zones from local database
    
    if (options.action == 'load') {
        var status = db.loadCarParks();
        
        // Returns the result

        self.postMessage({
            cmd:        options.action,
            content:    { status: status, carpark: db.carpark }
        });        

    // Downloading car park zones from the internet
    
    } else if (options.action == 'refresh') {
        db.refreshCarParks(function(err) {
            
            // Returns the result

            self.postMessage({
                cmd:        options.action,
                content:    { status: err === undefined, carpark: db.carpark }
            });        
        });

    // Unknown action

    } else {
        self.postMessage({
            cmd:        'unknown'
        });
    }
}, false);