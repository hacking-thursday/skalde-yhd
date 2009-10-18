Server.toSingleton();

new Asset.javascript('./js/types.js');
new Asset.javascript('./js/Board.js');
new Asset.javascript('./js/Wall.js');
new Asset.javascript('./js/Editor.js');
new Asset.javascript('./js/Skalde.js');

Window.addEvent('domready',function(){
	Board.toSingleton();
	Wall.toSingleton();
	Skalde.toSingleton();

	Window.fireEvent('start');
});

var MyScroller = Scroller.extend({
	start: function(){
		this.started = true;
		this.last={'x':undefined,'y':undefined};
		this.coord = this.getCoords.bindWithEvent(this);
		this.mousemover.addListener('mousemove', this.coord);
	},
	
	stop: function() {
		this.started = false;
		this.parent();
	},
	
	scroll: function(){
		var el = this.element.getSize();
		var pos = this.element.getPosition();

		var change = {'x': 0, 'y': 0};
		for (var z in this.page){
			if (this.last[z]!=undefined)
				change[z] = (this.last[z] - this.page[z]); 
			this.last[z]=this.page[z];
		}
		if (change.y || change.x) this.fireEvent('onChange', [el.scroll.x + change.x, el.scroll.y + change.y]);
		
	}
});

Window.addEvent('start',function(){

	Window._scroll = new Fx.Scroll('screen', {
		wait: true,
		duration: 2500,
		offset: {
			'x': 0,
			'y': 0
		},
		transition: Fx.Transitions.Quad.easeInOut
	});

	Window._skalde = new Skalde();
	Window._board = new Board( $('board'), _skalde );
	Window._wall = new Wall( $('wall'), _skalde );

		var scroll_drag = new MyScroller( $('screen'), {
			area : 200,
			velocity : 0.25
		});

		scroll_drag.addEvent('onChange', function(e) {
			// onChange handler
		});

		$('screen').addEvents({
			'mousedown': function(ev) {
				if( !window.ie )
				{
					this.setStyle('cursor', '-moz-grabbing');
				}
				scroll_drag.start();
			},

			'mouseup': function(ev) {
				if( !window.ie )
				{
					this.setStyle('cursor', '-moz-grab');
				}
				scroll_drag.stop();
			},

			'mouseover': function(ev) {
				if( !window.ie )
				{
					this.setStyle('cursor', '-moz-grab');
				}
				scroll_drag.stop();
			},

			'mouseout': function(ev) {
				this.setStyle('cursor', 'default');
				scroll_drag.stop();
			}
		});

		(function(){_scroll.scrollTo( 
			$('wall').getSize().size.x/2 - $('screen').getSize().size.x/2, 
			$('wall').getSize().size.y/2 - $('screen').getSize().size.y/2
		) }).delay( 2000 );

	_skalde.pull();
	_skalde.pull.periodical( 30*1000, _skalde) ;
});

Window.addEvent('redraw', function(){
	Window._wall.update();
	Window._board.update();
});

