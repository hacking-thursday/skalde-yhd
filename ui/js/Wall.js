var post_html = '<div id="content" style=""> \
			MESSAGE \
		</div> \
		<div style="padding-top:0px; padding-left:50px;"> \
			<span id="who" style="font-weight: bold;font-style:italic;">WHO</span> \
			<span id="date" style="font-style:italic;padding-top:7px;position:relative;left:-40px; top:14px;" >TIME</span> \
		</div>';

var post_node1 = new Element('div', { 'id':'content' } );
post_node1.setHTML('MESSAGE');

var post_node2 = new Element('div', { 'styles':{ 'padding-top':'0px', 'padding-left': '50px'  } } );

var post_node21 = new Element('span', { 'id':'who', 'styles':{ 
	'font-weight':'bold', 
	'font-style': 'italic'  
	} 
});
post_node21.setHTML('WHO');

var post_node22 = new Element('span', { 'id':'date', 'styles':{ 
	'font-style':'italic', 
	'padding-top': '7px',  
	'left': '-40px',  
	'top': '14px',  
	'position': 'relative'  
	} 
});
post_node22.setHTML('TIME');

post_node2.adopt( post_node21 );
post_node2.adopt( post_node22 );


/**
  * class Wall
  */
Wall = new Class({
	initialize: function( element, core ){
		this._init();
		/**
		*/
		this.m_view= element;
		/**
		*/
		this.m_skalde = core;

		//this.m_view.addEvent('dblclick', this.showEditor );
		this.m_view.addEvent('dblclick', this.showEditor.bindWithEvent(this) );
	}
});


/**
 * _init sets all Wall attributes to their default value. Make sure to call this
 * method within your class constructor
 */
Wall.prototype._init = function ()
{
  /**
   */
  this.m_width = "";
  /**
   */
  this.m_height = "";
  /**
   */
  this.m_items = "";

  /**Aggregations: */

  /**Compositions: */

}

/**
 */
Wall.prototype.update = function ()
{
	this.m_view.empty();

	this.m_items = this.m_skalde.listPostit();

	var count=0;
	this.m_items.each( function(item){
		var postit = this.m_skalde.getPostit( item );

		var real_xy = { 'x': postit.m_x, 'y': postit.m_y };
		var wall_pos = this.wall4real( real_xy );

		var node = new Element('div',{
			'id': 'postit'+ postit.m_id,
			'class': "scrolling-postit",
			'styles': { 
				'top': wall_pos.top, 
				'left': wall_pos.left, 
				'background': 'white', 
				'opacity': 0.5, 
				'width': '300px'
				}
			}
		);

		var date = new Date( postit.m_date*1000 );
		var post_html = '<div id="content" style=""><center>'+postit.m_content+'</center></div> \
				<div style="padding-top:0px; padding-left:50px;"> \
					<span id="who" style="font-weight: bold;font-style:italic;">'+postit.m_author+'</span> \
					<span id="date" style="font-style:italic;padding-top:7px;position:relative;left:-40px; top:14px;" >'+date.toLocaleDateString()+'</span> \
				</div>';

		node.setHTML( post_html );
		this.m_view.adopt( node );

		node.addEvent('mouseover',function(evt){
			this.setStyles({
				'border':'1px',
				'z-index':'3',
				'background':'gray'
			});
		});

		node.addEvent('mouseleave',function(evt){
			this.setStyles({
				'border':'none',
				'z-index':'0',
				'background':'white'
			});
		});

		//var node01 = post_node1.clone();
		//var node02 = post_node2.clone();
		//node.adopt( node01 );	
		//node.adopt( node02 );	

		//this.m_view.adopt( node );

		//if( node.getElementsBySelector('#date').length )
		//{
		//	var date = new Date( postit.m_date*1000 );
		//	node.getElementsBySelector('#date')[0].setHTML( date.toLocaleDateString() );
		//}
		//if( node.getElementsBySelector('#who').length )
		//{
		//	node.getElementsBySelector('#who')[0].setHTML( postit.m_author );
		//}

		//if( node.getElementsBySelector('#content').length )
		//{
		//	node.getElementsBySelector('#content').setHTML( postit.m_content );
		//}
		
		if( postit.bubble )
		{
			postit.bubble=null;

			node.setStyle('opacity','0.5');
			node.setStyle('background-color','#999999');

			var fx = node.effects({duration: 3000, transition: Fx.Transitions.Quad.easeInOut, 
			    onComplete:function(){
				    this.element.setStyle('background-color','white');
			    }
			});
			fx.start.delay( count*1000, fx, {
				'opacity': 0.8,
				'background-color': '#eeeeee'
			});

			count++;
			if( count > 5 ) 
			{ 
				count=0;
			}
		}

	},this);
}


/**
 * 
 */
Wall.prototype.wall4real= function ( real_xy )
{
	var orig_l = this.m_view.getSize().size.x.toInt() / 2 ;
	var orig_t = this.m_view.getSize().size.y.toInt() / 2 ;

	var result = {
		'left': orig_l + real_xy.x.toInt(),
		'top': orig_t - real_xy.y.toInt()
	};

	return result;
}

/**
 * 
 */
Wall.prototype.real4wall= function ( wall_pos )
{
	var orig_l = this.m_view.getSize().size.x.toInt() / 2 ;
	var orig_t = this.m_view.getSize().size.y.toInt() / 2 ;

	var result = {
		'x': wall_pos.left - orig_l,
		'y': -( wall_pos.top - orig_t )
	};

	return result;

}
/**
 * 
 */
Wall.prototype.showEditor= function ( evt )
{
	var event = new Event( evt );

	// Dirty hack
	var frame_pos= { 
		'left': $('screen').getStyle('left').toInt(),
		'top': $('screen').getStyle('top').toInt()
	};

	if( !frame_pos.left )
	{
		frame_pos.left = 0;
	}

	if( !frame_pos.top )
	{
		frame_pos.top = 0;
	}

        var view_pos = $('screen').getSize();

        var click_pos = event.client;
        var wall_pos = {
              'left': click_pos.x - frame_pos.left + view_pos.scroll.x,
              'top': click_pos.y - frame_pos.top + view_pos.scroll.y
        };

	var real_xy = this.real4wall( wall_pos );

	//console.log( 'click position: ( '+wall_pos.left+', '+wall_pos.top+' )' );
	//console.log( 'real  position: ( '+real_xy.x+', '+real_xy.y+' )' );

	var editor = new Editor({ 'left': wall_pos.left, 'top': wall_pos.top, 'x': real_xy.x, 'y': real_xy.y });
	
	this.m_view.adopt( editor );

	event.stop();

}
