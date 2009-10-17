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
