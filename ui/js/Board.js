/**
  * class Board
  */

var Board = new Class({
	initialize: function( element, core ){
		/**
		 */
		this.m_view= element;
		/**
		 */
		this.m_skalde = core;

		this._init();
	}
});


/**
 * _init sets all Board attributes to their default value. Make sure to call this
 * method within your class constructor
 */
Board.prototype._init = function ()
{
  /**
   */
  this.m_items = "";

  /**Aggregations: */

  /**Compositions: */
  this.m_drag = new Drag.Move( $('boardOuter') );
  $('board').addEvent('mousedown',function(evt){ new Event(evt).stop(); } );
  $('board').addEvent('mouseup',function(evt){ new Event(evt).stop(); } );
  $('board').addEvent('mouseover',function(evt){ new Event(evt).stop();  this.m_drag.stop();}.bindWithEvent(this) );

}

/**
 */
Board.prototype.update = function ()
{
	this.m_view.empty();
	this.m_view.setHTML("");
	//if( $$('#save').length){
	//	$('save').removeEvents('click');
	//	$('save').addEvent('click', function(evt){
	//			new Event(evt).stop();
	//			var sk = new Skalde();
	//			sk.push();
	//	});
	//}

	if( this.slideshow )
	{
		if( $$('#slideshow').length){
			$$('#slideshow').setStyle('border','inset');
			$$('#slideshow').setStyle('color','white');
		}
	}
	else
	{
		if( $$('#slideshow').length){
			$$('#slideshow').setStyle('border','outset');
			$$('#slideshow').setStyle('color','black');
		}
	}

	var sk = new Skalde();

	if( sk.hasNew() )
	{
		$$('#save').setStyle('display','');
		$$('#save').setStyle('border','outset');
		$$('#save').setStyle('color','red');
	}
	else
	{
		$$('#save').setStyle('display','none');
	}


	$('slideshow').removeEvents('click');
	$('slideshow').addEvent('click', function(evt){
		var event = new Event( evt );
		event.stop();

		if( $defined(this.slideshow) && this.slideshow )
		{
			this.slideshow = false;
		}
		else
		{
			this.slideshow = true ;
		}

		if( this.slideshow )
		{
			this.scrollToNext();
			this.slideshowTimer = this.scrollToNext.periodical( 5*1000,this );
		}
		else
		{
			$clear( this.slideshowTimer );
		}

		if( this.slideshow )
		{
			$('slideshow').setStyle('border','inset');
			$('slideshow').setStyle('color','white');
		}
		else
		{
			$('slideshow').setStyle('border','outset');
			$('slideshow').setStyle('color','black');
		}

	}.bind(this) );

	item_list = this.m_skalde.listPostit();
	this.m_items = new Array();
	for( i=item_list.length-1 ; i>=0 ; i-- )
	{
		this.m_items.push( item_list[i] );
	}

	this.m_items.each( function(item){
		var postit = this.m_skalde.getPostit( item );

		var node = new Element('a',
			{
				'id': 'link'+ postit.m_id,
				'href': '#'
			}
		);


		node.setHTML( postit.m_content );
		node.setHTML( '<li>'+node.innerHTML+'</li>' );

		node.injectInside( this.m_view );
		//this.m_view.adopt( node );

		node.addEvent('click', function(evt) {
			new Event(evt).stop();
			// TODO: make scroll a singleton 
			var top = $('postit'+postit.m_id).getStyle('top').toInt();
			var left = $('postit'+postit.m_id).getStyle('left').toInt();
			left = left -$('screen').getSize().size.x/2+50, 
			top = top  - $('screen').getSize().size.y/2 

			Window._scroll.scrollTo( left, top  );

			var node2 = $('postit'+postit.m_id);
			node2.setStyle('opacity','0.5');
			node2.setStyle('z-index','2');
			node2.setStyle('background-color','#999999');

			var fx = node2.effects({duration: 3000, transition: Fx.Transitions.Quad.easeInOut, 
			    onComplete:function(){
				    this.element.setStyle('opacity',1);
				    this.element.setStyle('z-index','1');
				    this.element.setStyle('background-color','');
			    }
			});

			fx.start.delay( 2000, fx, {
				'opacity': 0.8,
				'background-color': '#eeeeee'
			});

		});

		node.addEvent('slideshow', function() {
			// TODO: make scroll a singleton 
			var top = $('postit'+postit.m_id).getStyle('top').toInt();
			var left = $('postit'+postit.m_id).getStyle('left').toInt();
			left = left -$('screen').getSize().size.x/2+50, 
			top = top  - $('screen').getSize().size.y/2 

			var node2 = $('postit'+postit.m_id);
			node2.setStyle('opacity','1');
			node2.setStyle('z-index','2');
			node2.setStyle('background-color','#999999');

			var fx = node2.effects({duration: 3000, transition: Fx.Transitions.Quad.easeInOut, 
			    onComplete:function(){
				    this.element.setStyle('opacity',1);
				    this.element.setStyle('z-index','1');
				    this.element.setStyle('background-color','');
			    }
			});
			fx.start.delay( 2000, fx, {
				'opacity': 0.8,
				'background-color': '#eeeeee'
			});
			
			Window._scroll.scrollTo( left, top  );
		});

	},this);
}

/**
 */
Board.prototype.scrollToNext = function ()
{
	if( this.slideshow && this.m_items )
	{
		if( !$defined( this.curIdx ) )
		{
			this.curIdx = 0;
		}

		this.curIdx +=1;
		if( this.curIdx >= this.m_items.length )
		{
			this.curIdx = 0;
		}

		var item = this.m_items[this.curIdx];
		var postit = this.m_skalde.getPostit( item );
		$('link'+postit.m_id).fireEvent('slideshow');
	}
}
