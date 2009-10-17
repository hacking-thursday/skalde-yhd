/**
  * class Editor
  */

/**
 * the initlize function when FCKeditor is load-completed.
 * it does:
 *   auto clean the content if FCKeditor on focus.
 */
function FCKeditor_OnComplete(editorInstance)
{
    var oEditor = editorInstance;

    CleanContentIfFocus = function (editorInstance) 
    {
	    oEditor = editorInstance;
	    //console.log( oEditor )
	    if( !oEditor.IsDirty() || oEditor.LinkedField.getValue() != oEditor.StartupValue )
	    {
		    oEditor.SetHTML('');  
	    }	
	}
    oEditor.Events.AttachEvent( 'OnFocus', CleanContentIfFocus );
}

Editor = function ( options )
{
  this.x = options.x;
  this.y = options.y;
  this.left = options.left;
  this.top = options.top;

  this._init ();

  $$('#editordiv').each( function(item){item.remove();});
  this.view = new Element('div').injectInside(document.documentElement);
  this.view.injectInside( $('wall') );
  this.view.setHTML('\
<div id="msgbox" style="display:block;">\
        <div id="msgbox_t" style="z-index:1;">\
                <div id="msgbox_tl">\
		<div id="msgbox_tr">\
		</div>\
                </div>\
        </div>\
        <div id="msgbox_m" style="z-index:3;">\
                <div id="msgbox_ml">\
		<div id="msgbox_mr">\
		  <form id="editor" name="editor"><div style="width:370px;"><div id="postit_txt" name="postit_txt">FCKEditor++</div></div><div><span><input type="text" id="postit_author" name="postit_author" value="你的名字"/></span><img id="apply" src="image/apply_f2.png"/><img id="cancel" src="image/cancel_f2.png"/></div></form>\
		</div>\
                </div>\
        </div>\
        <div id="msgbox_b" style="z-index:1;">\
                <div id="msgbox_bl">\
                        <div id="msgbox_br"></div>\
                </div>\
        </div>\
</div>\
  ')

  var oFCKeditor = new FCKeditor( 'postit_content' ) ;
  oFCKeditor.BasePath	= "lib/fckeditor/";
  oFCKeditor.ToolbarSet = "Skalde";
  oFCKeditor.Height	= 120;
  oFCKeditor.Width	= 300 ;
  oFCKeditor.Value	= '請輸入你的留言' ;
  if( this.view.getElementsBySelector('#postit_txt').length )
  {
	  this.view.getElementsBySelector('#postit_txt')[0].setHTML( oFCKeditor.CreateHtml() );
  }

  this.view.setProperty('id', 'editordiv' );
  this.view.setStyle('position', 'absolute' );
  this.view.setStyle('width', 350 );
  this.view.setStyle('left', this.left );
  this.view.setStyle('top', this.top );
  this.view.setStyle('opacity', 0.8 );

  if( window.ie )
  {
	  this.view.getElementsBySelector('#msgbox_b').setStyle('display','none');
	  this.view.getElementsBySelector('#msgbox_t').setStyle('display','none');
	  this.view.getElementsBySelector('#msgbox_b').setStyle('margin',0);
	  this.view.getElementsBySelector('#msgbox_t').setStyle('margin',0);
  }

  //this.view.getElementByID('button').addEvent('click', this.submit.bind(this) );
  $('apply').addEvent('click', this.submit.bindWithEvent(this) );
  $('cancel').addEvent('click', this.cancel.bindWithEvent(this) );
  //$('editor').addEvent('submit', function(evt){ (new Event(evt)).stop(); } );
  $('editor').addEvent('submit', this.submit.bind(this) );

  $('postit_author').addEvent('click', function( evt ){ 
	  var event = new Event( evt );
	  event.stop();

	  this.focus(); 
          if( this.getProperty('value') == "你的名字" )
	  {
		  this.setProperty('value','');
	  }
  
  } );

  var drag = new Drag.Move( this.view, {
	  container: $('wall'), 
	  onComplete: function(){
		  var tmp_left = this.view.getStyle('left').toInt();
		  var tmp_top = this.view.getStyle('top').toInt();

		  var wall_pos = {
			  'left': tmp_left,
			  'top': tmp_top 
		  };

		  var real_xy = _wall.real4wall( wall_pos );

		  this.left = wall_pos.left;
		  this.top = wall_pos.top;
		  this.x = real_xy.x;
		  this.y = real_xy.y;
			consol.log(1);
	  }.bind(this)
  });

  this.view.addEvent('click', function(e){
	  var event = new Event(e);
			consol.log(2);

	  // Stop this event from propagating to Wall and trigger another Editor
	  event.stop();
  });

  this.view.addEvent('dblclick', function(e){
	  var event = new Event(e);

	  // Stop this event from propagating to Wall and trigger another Editor
	  event.stop();
  });

}


/**
 * _init sets all Editor attributes to their default value. Make sure to call this
 * method within your class constructor
 */
Editor.prototype._init = function ()
{
  /**
   */
  this.m_item = "";
  /**
   */
  this.m_form = "";
  /**
   */
  this.m_skalde = "";
}

Editor.prototype.cancel= function ( evt)
{
	var event = new Event( evt );
	event.stop();

	this.view.empty();
	Window.fireEvent('redraw');
}

Editor.prototype.submit = function ( evt )
{
	var event = new Event( evt );
	event.stop();

	var form = $('editor');
	var oEditor = FCKeditorAPI.GetInstance('postit_content') ;

	var input = oEditor.EditorDocument.body.innerHTML.slice( 3, -8);
	//console.log(input);

	if( input == "請輸入你的留言" || input == "" )
	{
		//console.log( '請編輯留言' );
		return;
	}

	if( !form.postit_author.value || form.postit_author.value == "你的名字" )
	{
		//console.log( '請填入姓名');
		return;
	}

	var message = new Message;
	// Get the editor instance that we want to interact with.

	message.m_content = input;
	message.m_author= form.postit_author.value ;
	// Remember to adjust time unit to sec
	message.m_date = Math.round( (new Date).getTime()/1000 ); 
	message.m_status = "new";
	message.bubble = true;
	message.m_x= this.x +20;
	message.m_y= this.y -70;
	message.m_z= "1";
	message.m_width= "100";
	message.m_height= "50";

	var skalde = new Skalde();
	skalde.addPostit( message );
	this.view.empty();
 	
	Window.fireEvent('redraw');
}
