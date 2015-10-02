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
 * General utility functions.
 */
 
// Declaring namespaces

var Util = {};
var U = Util;

/**
 * Does the string ends with the specified suffix?
 *
 * @param   {String}  suffix    suffix that has to check
 * @return  {Boolean} endswith  does the string ends with the suffix
 */

String.prototype.endsWith = function(suffix) {
    return suffix ? this.indexOf(suffix, this.length - suffix.length) !== -1 : false;
};

/**
 * Replaces all of the occurances of the specified string with another.
 *
 * @param   {String}  find      string that has to find
 * @param   {String}  replace   string that is the substitute string
 * @return  {String}  result    new replaced string
 */

String.prototype.replaceAll = function(find, replace) {
    return find ? this.replace(new RegExp(find, 'g'), (replace === '' || replace) ? replace : find) : this;
};

/**
 * Checks that does the string contain digit (0-9) characters only or not.
 *
 * @return  {Boolean} digit     string contains digit only or not
 */

String.prototype.isDigit = function() {

    // Checking string

    if (!this || this.length === 0) {
        return false;
    }

    for (var i = 0; i < this.length; i++) {
        if (isNaN(parseInt(this[i], 10))) {
            return false;
        }
    }

    // String contains digit only

    return true;
};

/**
 * Checks that does the string contain alpha (a-z) characters only or not.
 *
 * @return  {Boolean} alpha     string contains alpha characters only or not
 */

String.prototype.isAlpha = function() {

    if (!this || this.length === 0) {
        return false;
    }

    // Checking string

    return this.search(/[^A-Za-z]/) == -1;
};

/**
 * Checks that the specified element is in the array or not.
 *
 * @param   {Object}  element   object that has to check
 * @param   {Number}  from      index position where the check begins from
 * @return  {Number}  result    position in the array where the element is or
 *                              -1 if it does not found
 */

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    
        if (from < 0) {
          from += len;
        }
    
        for (; from < len; from++) {
          if (from in this && this[from] === elt) {
            return from;
          }
        }
    
        return -1;
    };
}

/**
 * Extends the specified class (subclass) from the super class (baseclass).
 *
 * @param  {Object}     subClass    sublass for inheritation
 * @param  {Object}     baseClass   baseclass that is the super class in
 *                                  inheritation
 */

Util.extending = function(subClass, baseClass) {

    // Inheriting

    function inheritance() {}

    if (subClass && baseClass) {
        inheritance.prototype = baseClass.prototype;

        subClass.prototype = new inheritance();
        subClass.prototype.constructor = subClass;
        subClass.baseConstructor = baseClass;
        subClass.superClass = baseClass.prototype;
    }
};

/**
 * Callbacks the specified function.
 * 
 * @param   {Function}  callback    callback function that has to invoke.
 */
 
Util.callback = function(callback) {
    if (this.isFunction(callback)) {
        callback.apply(this, Array.prototype.slice.call(arguments, 1));   
    }
};

/**
 * Merges the specified JSON objects and returns result. The target object will
 * be changed.
 *
 * @param  {Object}     target      target object
 * @param  {Object}     source      source object
 * @param  {Object}     result      result after the merging
 */

Util.merge = function(target, source) {

    // Checking the type of the target object
   
    if (typeof(target) !== 'object') {
        target = {};
    }
    
    // Getting properties of the source object and adding these to the target

    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            var sourceProperty = source[property];
            
            // Calling recursively in case of JSON object in the property value

            if (typeof(sourceProperty) === 'object') {
                target[property] = this.merge(target[property], sourceProperty);
                continue;
            }
            
            target[property] = sourceProperty;
        }
    }
    
    // Returns the target object

    return target;
};

/**
 * Gets the value of the specified object and attribute.
 *
 * @param   {Object}  object      object that has to observe
 * @param   {String}  attribute   attribute of the object
 * @return  {Object}  object      value of the attribute
 */

Util.getAttr = function (object, attribute) {

    // Processing attribute

    if (object && attribute && typeof(object) === 'object' && typeof(attribute) === 'string') {
        attribute = attribute.split('.');

        // Getting the attribute

        if (attribute[0]) {
            while (object && attribute[0]) {
                object = object[attribute.shift()];
            }
        } else {
            return undefined;
        }

        // Returns the attribute value

        return object;
    } else {

        // Empty or invalid parameters

        return undefined;
    }
};

/**
 * Checks that the specified object is a string or not.
 *
 * @param   {Object}    object     object that has to check
 * @return  {Boolean}   isstring   object is string or not
 */

Util.isString = function(object) {
    return typeof(object) === "string";
};

/**
 * Checks that the specified object is a function or not.
 *
 * @param   {Object}    object        object that has to check
 * @return  {Boolean}   isfunction    object is function or not
 */
 
Util.isFunction = function(object) {
    return {}.toString.call(object) === '[object Function]';
};

/**
 * Checks that the specified object is an array or not.
 *
 * @param   {Object}    object     object that has to check
 * @return  {Boolean}   isarray    object is array or not
 */

Util.isArray = function(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
};

/**
 * Checks that the specified object has a primitive type or not.
 *
 * @param   {Object}    object        object that has to check
 * @return  {Boolean}   isprimitive   object has primitive type or not
 */

Util.isPrimitive = function(object) {
    var type = typeof(object);
    return object !== undefined && object !== null && (type != "object" && type != "function");
};

/**
 * Gets the current browser type and version. Can be 'Chrome', 'Firefox', 'IE'
 * or 'Opera' and its version number.
 *
 * @return  {Object}    browser     browser type and version
 */

Util.browser = function() {

    // Preparing

    var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    // Detecting IE

    if (/trident/i.test(M[1])) {
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { type: 'IE', version: tem[1] || '' };
    }

    // Detecting Chrome

    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);

        if (tem !== null) {
            return { type: 'Opera', version: tem.slice(1).join(' ').replace('OPR', '') };
        }
    }

    // Detecting others

    M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
        M.splice(1, 1, tem[1]);
    }

    // Returns the browser type and its version

    return { type: M[0], version: M[1] };
};

/**
 * Is the specified value empty (undefined, null or empty string)?
 * 
 * @param     {String}     value     value that has to check
 * @return    {Boolean}    empty     value is empty or not
 */
 
Util.isEmpty = function(value) {
    return value === undefined || value === null || value === '';
};

/**
 * Converts the specified object to array and returns it. An empty array will be
 * returned if the object is empty (undefined or null). If there are more
 * attributes specified, the conversion will be called recursively for all of
 * the specified attributes.
 * <p>
 * @param   {Object}        object      object that has to convert
 * @param   {String}        attribute   attribute names
 * @return  {Array}         array       converted object as an array
 */

Util.getArray = function(object, attribute) {

    // Checking the parameters

    if (arguments.length === 0) {
        return [];
    } else if (arguments.length == 1) {

        // Converting the object to array

        if (!object) {
            return [];
        } else if (this.isArray(object)) {
            return object;
        } else {
            return [object];
        }
    } else {

        // Checking and searching the attributes

        var result = attribute ? this.getAttr(object, attribute) : object;
        return this.isEmpty(result) ? 
            [] : (this.isArray(result) ? result : [result]);
    }
};

/**
 * Does the ENTER key pressed?
 * 
 * @param     {Object}     event     event object
 * @return    {Boolean}    pressed   ENTER key pressed
 */
 
Util.isENTER = function(event) {
    return event && typeof(event) === 'object' ? 
        ((event.keyCode ? event.keyCode : event.which) === 13) : false;
};
   
/**
 * Does the ESC key pressed?
 * 
 * @param     {Object}     event     event object
 * @return    {Boolean}    pressed   ESC key pressed
 */
 
Util.isESC = function(event) {
    return event && typeof(event) === 'object' ?
        ((event.keyCode ? event.keyCode : event.which) == 27) : false;
};

/**
 * Standard prevent default event handler for various events.
 * <p>
 * @param   {Object}    event         event
 */

Util.preventDefault = function(event) {

    // Event handling

    if (event) {
        if (event.preventDefault && this.isFunction(event.preventDefault)) {
            event.preventDefault();
        }
    
        event.returnValue = false;    
    }
};

/**
 * Does the CTRL+S key pressed?
 * 
 * @param     {Object}     event     event object
 * @return    {Boolean}    pressed   CTRL+S key pressed
 */
 
Util.isCTRLS = function(event) {

    // Checking the pressed key

    if (event && typeof(event) === 'object' &&
    (event.ctrlKey || event.metaKey) && 
    (event.keyCode ? event.keyCode : event.which) == 83) {
        Util.preventDefault(event);
        return true;
    }

    // There is no CTRL+S pressing

    return false;
};

/**
 * Prevents caching during the URL invoking by using this timestamp at the end
 * of the url.
 * 
 * @return  {String}    date        current date in UNIX timestamp format
 */

Util.noCache = function() {
    return new Date().getTime();
};

/**
 * Gets the parameters of the specified URL or if it does not specified then the
 * current one. It returns the parameters as a JSON object. If there is no
 * parameter in the URL, an empty object will be returned.
 * 
 * @param     {String}     url        URL that has to observe
 * @return    {Object}     params     URL parameters
 */

Util.getURLParameters = function(url) {
    
    // Preparing

    var urlString = ((url && this.isString(url)) ? url : undefined) || 
                    window.location.search;

    if (urlString && urlString.indexOf('?') === 0) {
        urlString = urlString.substring(1);
    }

    var pairs = urlString.split('#')[0].split("&");
    var obj = {};
    var pair;

    // Parsing the parameters

    for (var i in pairs) {
        if (pairs[i] === '') {
            continue;
        }

        pair = pairs[i].split("=");
        obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    // Returns the JSON object

    return obj;
};

/**
 * Gets the anchor without # symbol based on the current page's URL. If there
 * is no anchor defined in the URL, a null value will be returned.
 * 
 * @return    {String}     anchor     anchor in the current URL or null
 */

Util.getURLAnchor = function() {
    
    // Getting the anchor from the URL of the current page
    
    var anchor = window.location.hash;

    // Returns the anchor
    
    return anchor ? anchor.substring(1) : null;
};

/**
 * Escapes the specified HTML string and returns it. It replaces the &, <, "
 * characters with &amp;, &lt;, &quot; symbols.
 * 
 * @param     {String}     html     HTML string that has to observe
 * @return    {String}     result   corrected HTML string
 */

Util.escapeHTML = function(html) {
    return html ? html.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;') : html;
};

/**
 * Escapes the specified XML string and returns it. It replaces the &, <, "
 * characters with &amp;, &lt;, &quot; symbols.
 * 
 * @param     {String}     xml     XML string that has to observe
 * @return    {String}     result  corrected XML string
 */

Util.escapeXML = function(xml) {
    return this.escapeHTML(xml);
};

/**
 * Escapes the specified string by replacing NEWLINE characters (CR/LF) with
 * <BR> text and returns it.
 * 
 * @param     {String}     value   string that has to observe
 * @return    {String}     result  corrected string
 */

Util.escapeNL = function(value) {
    
    // Checking and searching the CR LF characters

    if (value) {
        var CR = String.fromCharCode(13);
        var LF = String.fromCharCode(10);
        var NL = '<br>';

        value = value.replaceAll(CR + LF, NL);
        value = value.replaceAll(LF + CR, NL);
        value = value.replaceAll(CR, NL);
        value = value.replaceAll(LF, NL);
    }

    // Returns the escaped value

    return value;
};

/**
 * Converts the specified relative or combined (.,..) URL to absolute URL and
 * returns it.
 * 
 * @param     {String}     url       URL that has to convert
 * @return    {String}     absolute  absolute URL after the
 *                                   conversion
 */

Util.qualifyURL = function(url) {
    
    // Reference to the current object
    
    var self = this;

    // Converting the url
    
    if (url) {
        var el = document.createElement('div');
        el.innerHTML = '<a href="' + self.escapeHTML(url) + '">x</a>';
        return el.firstChild.href;
    } else {
        return url;
    }
};

/**
 * Removes the last slash (/) character from the end of the URL if there is any
 * and returns it.
 * 
 * @param     {String}     url       URL that has to observe
 * @return    {String}     newurl    URL without last slash
 */
    
Util.removeLastSlash = function(url) {
        
    // Getting the position of the last slash
    
    if (url && this.isString(url)) {
        var pos = url.lastIndexOf('/');

        // Removing the last slash
        
        if (pos === url.length - 1) {
            return url.substring(0, pos);
        } else {
            return url;
        }
    } else {
        return url;
    }
};

/**
 * Gets the offset x and y coordinates of the specified element.
 * 
 * @param     {HTMLElement} element     HTML element
 * @return    {Object}      offset      offset of the element in 
 *                                      {x: x, y: y} format
 */

Util.getOffset = function(element) {
    
    // Preparing
    
    var x = 0;
    var y = 0;

    // Getting the offset left and top coordinates of the element
    
    if (element) {
        do {
            x += element.offsetLeft || 0;
            y += element.offsetTop  || 0;
            element = element.offsetParent;
        } while(element);
    }

    // Returns the offset

    return {
        x:   x,
        y:   y
    };
};

/**
 * Case-insensitive sorter function.
 * <p>
 * @param   {String}    attr          name of the attribute
 * @param   {String}    direction     direction of the sorting (asc/desc)
 * @return  {Function}  sorter        generated sorter function for the direction
 */

Util.sortData = function(attr, direction) {

    // Defining case-insensitive sorter function

    return function(a, b) {
        
        // Preparing
        
        var valueA;
        var valueB;

        if (attr) {
            valueA = a[attr];
            valueB = b[attr];
        } else {
            valueA = a;
            valueB = b;
        }

        if (typeof(valueA) === 'string') {
            valueA = valueA.toLowerCase();
        } else {
            valueA = valueA || '';
        }

        if (typeof(valueB) === 'string') {
            valueB = valueB.toLowerCase();
        } else {
            valueB = valueB || '';
        }
        
        // Comparing
        
        if ((direction || 'asc') == 'asc') {
            return ((valueA < valueB) ? -1 : ((valueA > valueB) ? 1 : 0));
        } else {
            return ((valueA > valueB) ? -1 : ((valueA < valueB) ? 1 : 0));
        }
    };
};

/**
 * Adds the specified template by ID - that is published previously - to the
 * shadow DOM of the specified element.
 * <p>
 * @param   {Object}    element       element
 * @param   {String}    id            template ID
 */

Util.addTemplateToShadowDOM = function(element, id) {

    // Checking that the template does exists in the shadow DOM of the element
    // or not.

    if (id && element && !element.shadowRoot.getElementById(id)) {
		var tmpl = document.body.querySelector('#' + id);

        // Preparing

        if (!window.importedTemplates) {
            window.importedTemplates = [];
        }
        
        // Adding template to the shadow DOM if it exists
        
		if (tmpl !== null) {
		    element.shadowRoot.appendChild(tmpl);
		    window.importedTemplates.push(tmpl);
		} else {

		    // Searching template in the previously added template's list

		    for (var i = 0;i < window.importedTemplates.length; i++) {
	            element.shadowRoot.appendChild(window.importedTemplates[i]);
		    }
    	}
    }
};
            
/**
 * Publishes the specified template by ID from the specified document to the
 * document body, so the template will be available in the whole document. The
 * template ID must be uniq.
 * <p>
 * @param   {Object}    doc           owner document of the template
 * @param   {String}    templateID    template ID
 */

Util.publishTemplate = function(doc, templateID) {
    
    // Preparing
    
    var tmplID = Util.isArray(templateID) ? templateID : [templateID];
    
    // Getting the template
    
    for (var i = 0; i < tmplID.length; i++) {
        var template = doc.querySelector('#' + tmplID[i]);
        
        // Adding the template to the document body if it does not exists
        
        if (template && !document.body.querySelector('#' + tmplID[i])) {
            document.body.appendChild(document.importNode(template, true));
        }
    }
};

/**
 * Parses the specified XML text and returns it as an XML object. If the parsing
 * was failed, a NULL value will be returned.
 * <p>
 * @param   {String}    text          XML string
 * @return  {Object}    xml           parsed text as an XML object
 */
 
Util.parseXml = function(text) {

    // Preparing

    var pXml;
    var browser = this.browser().type;

    // Getting the XML parser of the browser

    if (browser != 'IE') {
        pXml = function(xmlStr) {
            return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
        };

    // In case of IE and when the MS-XML processor is available

    } else if (browser == 'IE' && window.ActiveXObject != "undefined" && new window.ActiveXObject('Msxml2.DOMDocument.6.0')) {
        pXml = function(xmlStr) {
            var xmlDoc = new ActiveXObject('Msxml2.DOMDocument.6.0'); 
            xmlDoc.validateOnParse = false;
            xmlDoc.async = false;
            xmlDoc.resolveExternals = false;
            xmlDoc.setProperty("ProhibitDTD", false);
            xmlDoc.loadXML(xmlStr);

            return xmlDoc;
        };

    // XML processor is not available

    } else {
        pXml = function() {
            return null;
        };
    }
    
    // Parsing the xml text
    
    return pXml(text);
};

/**
 * Encrypts the specified data by using the key and returns it.
 *
 * @param   {String}        data that has to encrypt
 * @param   {String}        encryption key
 * @return  {String}        encrypted data
 */

Util.encrypter = function(data, key) {

    // Encrypting the data

    var result = '';

    for (var i = 0; i < data.length; i++) {
        result = result + String.fromCharCode(data.charCodeAt(i) ^ key);
    }

    // Returns the decrypted data

    return btoa(result); /* global btoa */
};

/**
 * Decrypts the specified data by using the key and returns it.
 *
 * @param   {String}        data that has to decrypt
 * @param   {String}        encryption key
 * @return  {String}        decrypted data
 */

Util.decrypter = function(data, key) {

    // Decrypting the data

    var toDecrypt = atob(data); /* global atob */
    var result = '';

	for (var i = 0; i < toDecrypt.length; i++) {
		result+=String.fromCharCode(key ^ toDecrypt.charCodeAt(i));
	}

    // Returns the decrypted data

    return result;
};

/**
 * Decodes the specified base64 string to an array buffer and returns it.
 * 
 * @param     {String}     base64       BASE64 string that has to decode
 * @return    {Object}     arrayBuffer  array buffer for the string
 */

Util.arrayBufferBase64 = function(base64) {

    var Base64Binary = {
    	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    	
    	// Will return a  Uint8Array type

    	decodeArrayBuffer: function(input) {
    		var bytes = (input.length/4) * 3;
    		var ab = new ArrayBuffer(bytes);
    		this.decode(input, ab);
    		
    		return ab;
    	},
    	
    	decode: function(input, arrayBuffer) {
    		
            // Get last chars to see if are valid

    		var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));		 
    		var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));		 
    	
    		var bytes = (input.length/4) * 3;
    		if (lkey1 == 64) bytes--; //padding chars, so skip
    		if (lkey2 == 64) bytes--; //padding chars, so skip
    		
    		var uarray;
    		var chr1, chr2, chr3;
    		var enc1, enc2, enc3, enc4;
    		var i = 0;
    		var j = 0;
    		
    		if (arrayBuffer)
    			uarray = new Uint8Array(arrayBuffer);
    		else
    			uarray = new Uint8Array(bytes);
    		
    		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    		
    		for (i=0; i<bytes; i+=3) {	
    			
                // Get the 3 octects in 4 ascii chars

    			enc1 = this._keyStr.indexOf(input.charAt(j++));
    			enc2 = this._keyStr.indexOf(input.charAt(j++));
    			enc3 = this._keyStr.indexOf(input.charAt(j++));
    			enc4 = this._keyStr.indexOf(input.charAt(j++));
    	
    			chr1 = (enc1 << 2) | (enc2 >> 4);
    			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    			chr3 = ((enc3 & 3) << 6) | enc4;
    	
    			uarray[i] = chr1;			
    			if (enc3 != 64) uarray[i+1] = chr2;
    			if (enc4 != 64) uarray[i+2] = chr3;
    		}
    	
    		return uarray;	
    	}
    };

    // Decoding

    return Base64Binary.decodeArrayBuffer(base64);
};
            
/**
 * Encodes the specified array buffer as BASE64 text and returns it.
 * 
 * @param     {Object}     arrayBuffer  array buffer that has to encode
 * @return    {String}     base64       BASE64 encoded array buffer
 */
    
Util.base64ArrayBuffer = function(arrayBuffer) {
    
    // Preparing
    
    var base64 = '';
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;
    var a, b, c, d;
    var chunk;
    
    // Main loop deals with bytes in chunks of 3
    
    for (var i = 0; i < mainLength; i = i + 3) {
        
        // Combine the three bytes into a single integer
        
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    
        // Use bitmasks to extract 6-bit segments from the triplet
        
        a = (chunk & 16515072) >> 18;              // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12;                  // 258048 = (2^6 - 1) << 12
        c = (chunk & 4032) >>  6;                       // 4032 = (2^6 - 1) << 6
        d = chunk & 63;                                          // 63 = 2^6 - 1
    
        // Convert the raw binary segments to the appropriate ASCII encoding
        
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    
    // Deal with the remaining bytes and padding
    
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];

        // 252 = (2^6 - 1) << 2
        
        a = (chunk & 252) >> 2;
        
        // Set the 4 least significant bits to zero
        // 3 = 2^2 - 1
        
        b = (chunk & 3) << 4;
        
        base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    
        // 64512 = (2^6 - 1) << 10
        
        a = (chunk & 64512) >> 10;
        
        // 1008  = (2^6 - 1) << 4
        
        b = (chunk & 1008)  >>  4;
    
        // Set the 2 least significant bits to zero
        
        // 15 = 2^4 - 1
        
        c = (chunk & 15) << 2;
    
        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }
  
    // Returns the BASE64 encoded text
    
    return base64;
};

Util.format = function() {
    var re = {
        not_string: /[^s]/,
        number: /[dief]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fiosuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    };

    function sprintf() {
        var key = arguments[0], cache = sprintf.cache;

        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] = sprintf.parse(key);
        }

        return sprintf.format.call(null, cache[key], arguments);
    }

    sprintf.format = function(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = "";

        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i]);

            if (node_type === "string") {
                output[output.length] = parse_tree[i];
            }
            else if (node_type === "array") {
                match = parse_tree[i]; // convenience purposes only

                if (match[2]) { // keyword argument
                    arg = argv[cursor];

                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]));
                        }

                        arg = arg[match[2][k]];
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]];
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++];
                }

                if (get_type(arg) == "function") {
                    arg = arg();
                }

                if (re.not_string.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)));
                }

                if (re.number.test(match[8])) {
                    is_positive = arg >= 0;
                }

                switch (match[8]) {
                    case "b":
                        arg = arg.toString(2);
                        break;
                    case "c":
                        arg = String.fromCharCode(arg);
                        break;
                    case "d":
                    case "i":
                        arg = parseInt(arg, 10);
                        break;
                    case "e":
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
                        break;
                    case "f":
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                        break;
                    case "o":
                        arg = arg.toString(8);
                        break;
                    case "s":
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
                        break;
                    case "u":
                        arg = arg >>> 0;
                        break;
                    case "x":
                        arg = arg.toString(16);
                        break;
                    case "X":
                        arg = arg.toString(16).toUpperCase();
                        break;
                }

                if (re.number.test(match[8]) && (!is_positive || match[3])) {
                    sign = is_positive ? "+" : "-";
                    arg = arg.toString().replace(re.sign, "");
                } else {
                    sign = "";
                }

                pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " ";
                pad_length = match[6] - (sign + arg).length;
                pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : "";
                output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg);
            }
        }

        return output.join("");
    };

    sprintf.cache = {};

    sprintf.parse = function(fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;

        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = match[0];
            } else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = "%";
            } else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1;
                    var field_list = [], replacement_field = match[2], field_match = [];

                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list[field_list.length] = field_match[1];

                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1];
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1];
                            }
                            else {
                                throw new SyntaxError("[sprintf] failed to parse named argument key");
                            }
                        }
                    }
                    else {
                        throw new SyntaxError("[sprintf] failed to parse named argument key");
                    }

                    match[2] = field_list;
                }
                else {
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
                }

                parse_tree[parse_tree.length] = match;
            }
            else {
                throw new SyntaxError("[sprintf] unexpected placeholder");
            }

            _fmt = _fmt.substring(match[0].length);
        }

        return parse_tree;
    };

    /**
     * helpers
     */
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    function str_repeat(input, multiplier) {
        return Array(multiplier + 1).join(input);
    }

    return sprintf.apply(this, arguments);
};
