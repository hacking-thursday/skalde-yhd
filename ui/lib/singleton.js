/* 
* http://forum.mootools.net/viewtopic.php?id=6409
*
* Example:
*
*   Counter.toSingleton(); // Make class a singleton
*
*
*   testA = new Counter(); //output = 'counter initialized'
*   testB = new Counter();
*   testC = new Counter();
*
*   testA.count(); // output = 1
*   testB.count(); // output = 2
*   testC.count(); // output = 3
*/

Class.prototype.toSingleton = function(){
   var p = this.prototype;
   var instance = undefined;

   if($defined(p.initialize) && $type(p.initialize) == 'function') var init = p.initialize

   p.initialize = function(){
	 if(!$defined(instance)){
	       if($defined(init) && $type(init) == 'function') init.apply(this,arguments)
	       instance = this;
	 }
	 return instance;   
   }
};

