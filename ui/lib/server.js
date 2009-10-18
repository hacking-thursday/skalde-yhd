
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf(" chrome/") >= 0 || ua.indexOf(" firefox/") >= 0 || ua.indexOf(' gecko/') >= 0) {
	var StringMaker = function () {
		this.str = "";
		this.length = 0;
		this.append = function (s) {
			this.str += s;
			this.length += s.length;
		}
		this.prepend = function (s) {
			this.str = s + this.str;
			this.length += s.length;
		}
		this.toString = function () {
			return this.str;
		}
	}
} else {
	var StringMaker = function () {
		this.parts = [];
		this.length = 0;
		this.append = function (s) {
			this.parts.push(s);
			this.length += s.length;
		}
		this.prepend = function (s) {
			this.parts.unshift(s);
			this.length += s.length;
		}
		this.toString = function () {
			return this.parts.join('');
		}
	}
}



var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
	var output = new StringMaker();
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	while (i < input.length) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output.append(keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4));
   }
   
   return output.toString();
}

function decode64(input) {
	var output = new StringMaker();
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	while (i < input.length) {
		enc1 = keyStr.indexOf(input.charAt(i++));
		enc2 = keyStr.indexOf(input.charAt(i++));
		enc3 = keyStr.indexOf(input.charAt(i++));
		enc4 = keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output.append(String.fromCharCode(chr1));

		if (enc3 != 64) {
			output.append(String.fromCharCode(chr2));
		}
		if (enc4 != 64) {
			output.append(String.fromCharCode(chr3));
		}
	}

	return output.toString();
}



/*
 * Class: Server
 *    The js interface to communicate with server.
 */
var Server = new Class({
	options:{
		url:'../index.php'
	},
	
	/*
	 * Property: htmlCache
	 * 
	 * Using Mootols' Hash to hold html cache
	 */
	htmlCache:new Hash(),
	
	/*
	 * Constructor: initialize
	 * 
	 * do nothing
	 */
	initialize:function() {
		
	},
	
	/*
	 * Method: getHTML
	 * 
	 * get html from server
	 * 
	 * Parameters:
	 *    path - the html's path on server
	 *    f - function to callback
	 */
	getHTML:function(path,f) {
		// check cache first
		if (this.htmlCache.hasKey(path)) {
			f(this.htmlCache.get(path))
	        } 
		else {
		      new Ajax(path,{
			    method:'get',
			    onComplete:function(r) {
				  this.htmlCache.set(path,r)
				  f(r)
			    }.bind(this)
		      }).request();
		}
	},

	/*
	 * Method: getData
	 * 
	 * get Data from server
	 * 
	 * Parameters:
	 *    path - the data's path on server
	 *    f - function to callback
	 */
	getData:function(path,f) {
		      new Ajax(path,{
			    method:'get',
			    onComplete:function(r) {
				  f(r)
			    }.bind(this)
		      }).request({query: 'SELECT * FROM skalde'});
	},

	/*
	 * Method: postData
	 * 
	 * post data from server
	 * 
	 * Parameters:
	 *    path - the data's path on server
	 *    input - data object
	 */
	postData:function(path,input) {
		    var ajax = new Ajax(path,{
			    method:'get'
		    });
		    ajax.request({query: input});
	},

	/*
	 * Method: deleteData
	 * 
	 * delete data from server
	 * 
	 * Parameters:
	 *    path - the data's path on server
	 *    input - data object
	 */
	deleteData:function(path,input) {
		      new Ajax(path,{
			    method:'delete',
			    data: input
		      }).request();
	},
	
	
	/*
	 * Method: genericCall
	 * 
	 * A generic method used by other methods
	 * 
	 * Parameters:
	 *    params - parameters passed to Ajax
	 *    f - function to callback
	 */
	genericCall:function(params,f) { // TODO
		new Ajax(this.options.url,{
			onComplete:function(r) {
			        // "\s" ==> Any whitespace character including tab,
			        // space, newline, carriage return, and form feed. 
			        // Similar to [ \t\n\r\f]. 
				r = r.replace(/\s/g,'')
				if (f) f(r)
			}
		}).request(Object.toQueryString(params))
	}
	
});

Server.implement(new Options);
