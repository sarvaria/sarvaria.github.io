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

/**
 * Represents a local database that stores the carpark zones and the
 * application settings.
 * 
 * @param   {Object}    configuration options (optional)
 */

var DB = function(options) {

    // Reference to the current object
    
    var self = this;
    
    // Checking option parameters

    options = options || {};

    if (typeof (options) !== 'object') {
        throw new TypeError('options must be an object');
    }
    
    // Initializing
    
    self.carpark = [];
    self.settings = {};
};

// Contstanses

DB.URL_CITY = 'https://www.nemzetimobilfizetes.hu/parking_purchases/zonainfo/content';
DB.URL_ZONE = 'https://www.nemzetimobilfizetes.hu/parking_purchases/search_parking_zones/';
DB.DB_NAME = 'carparking.db';
DB.CONFIG_NAME = 'settings.db';

/**
 * Gets the content of the specified URL and returns it as the first parameter
 * of the callback function.
 * 
 * @param   {String}    url         URL that has to load
 * @param   {Function}  callback    callback function. The first parameter is
 *                                  the content of the URL. The second contains
 *                                  the error message if there was any. 
 */

DB._fetchURL = function(url, callback) {
    
    // Preparing
    
    var xmlhttp = new XMLHttpRequest();
    
    // Getting the content of url
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            var content;
            var err;
            
            if (xmlhttp.status == 200) {
                content = xmlhttp.responseText;
            } else {
               err = xmlhttp.statusText;
            }

            // Callbacking
            
            if (callback) {
                callback(content, err);
            }
        }
    };
    
    // Executing the HTTP call
    
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
};

/**
 * Loads the downloaded car park zones from the local database and stores these
 * into the "carpark" property. It returns that the loading was success or not.
 * 
 * @return  {Boolean}   success     loading the was success or not
 */

DB.prototype.loadCarParks = function() {

    // Reference to the current object
    
    var self = this;

    // Getting the car park zones from the local storage
    
    var carpark = localStorage.getItem(DB.DB_NAME);

    // Does the car park zones exists in the local storage?
    
    if (carpark && carpark !== '[]') {
        self.carpark = JSON.parse(carpark);
        return true;
    }
    
    // Car park zones does not exists. Loading was unsuccessfull.
    
    return false;
};

/**
 * Saves the downloaded car park zones to the local database.
 */

DB.prototype.saveCarParks = function() {

    // Reference to the current object
    
    var self = this;

    // Storing the car park zones into the local storage
    
    localStorage.setItem(DB.DB_NAME, JSON.stringify(self.carpark));
};

/**
 * Downloads the car park zones from the internet and stores these into the
 * "carpark" property. After the downloading has been finished the callback
 * function will be called.
 * 
 * @param   {Function}  callback    callback function
 */

DB.prototype.refreshCarParks = function(callback) {

    // Reference to the current object
    
    var self = this;
    
    // Reseting car park zones
    
    self.carpark = [];
    
    // Getting the content of the main page that contains the list of the
    // cities.
    
    DB._fetchURL(DB.URL_CITY, function(content, err) {
        
        // Was any error during the downloading?
        
        if (err) {

            // Callbacking
            
            if (callback) {
                callback(err);
            }
        } else {

            // Getting the cities
            
            var city = [];
            var pos = -1;
    
            while (true) {
                pos = content.indexOf('<option', pos + 1);
    
                if (pos < 0) {
                    break;
                }
    
                var c = content.substring(pos);
                c = c.substring(c.indexOf('>') + 1);
                c = c.substring(0, c.indexOf('<'));
    
                city.push(c);
            }
    
            // Getting the car parks in the cities
    
            var count = 0;
            var k;
            
            for (var i = 0; i < city.length; i++) {
                DB._fetchURL(
                    DB.URL_ZONE + "?search=" + encodeURIComponent(city[i]),
                    function(content, err) {
                        
                        // Was any error during the downloading?
        
                        if (err) {
                
                            // Callbacking
                            
                            if (callback) {
                                callback(err);
                            }
                        } else {
                            var cp = JSON.parse(content);
                            cp = Object.prototype.toString.call(cp) === '[object Array]' ? cp : [cp];
        
                            // Adding the car park to the "carpark" database
                            
                            for (k = 0; k < cp.length; k++) {
                                self.carpark.push(cp[k]);
                            }
        
                            count++;
        
                            // Does the last city downloaded from the internet?
                            
                            if (i == count) {
                                for (k = 0; k < self.carpark.length; k++) {
                                    for (var l = 0; l < self.carpark[k].geometry.length; l++) {
                                        
                                        // Renaming the "long" attribute to "lng"
                                        
                                        var g = self.carpark[k].geometry[l];
                                        self.carpark[k].geometry[l].lat = parseFloat(g.lat);
                                        self.carpark[k].geometry[l].lng = parseFloat(g.long);
                                        delete self.carpark[k].geometry[l].long;
                                    }
                                }
        
                                // Callbacking
                                
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                    }
                );
            }
        }
    });
};