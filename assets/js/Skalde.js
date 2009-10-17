/**
  * class Skalde
  */

Skalde = new Class({
	initialize: function(){
		this._init();
	}
});


/**
 * _init sets all Skalde attributes to their default value. Make sure to call this
 * method within your class constructor
 */
Skalde.prototype._init = function ()
{
  /**
   * 存放所有的 Postits 物件
   */
  this.m_postits = new Array;

  /**Aggregations: */

  /**Compositions: */
  this.cgipath = "/cgi-bin/json";
}


Skalde.prototype.hasNew = function(){

	var news = this.listPostit(function(item){ return item.m_status=="new";});

	return news.length > 0;
}

/**
 * 列出所有的物件編號。可指定過濾函式；若無，列出全部
 * @param filter
    *      過濾的函式
 */
Skalde.prototype.listPostit = function (filter)
{
	var result = [];

	if( typeof( filter ) == "function" )
	{
		var temp = this.m_postits.filter( filter );
	}
	else
	{
		var temp = this.m_postits;
	}
  
	temp.each( function( item ){ 
		result.push( item.m_id );
	});

	return result;
}


/**
 * 根據編號取得物件
 * @param id
    *      根據編號取得物件
 */
Skalde.prototype.getPostit = function (id)
{
	var result = this.m_postits.filter( function(item){
		return (item.m_id == id);
	});

	if( result.length == 1 )
	{
		return result[0];
	}

	return null;
}


/**
 * 新增一個 Postit 物件
 * @param data
    *      要新增的 Postit 物件
 */
Skalde.prototype.addPostit = function (data)
{
	if( !data.m_id )
	{
		var lowest = -1;
		this.m_postits.each(function(item){
			if( item.m_id.toInt() <= lowest )
			{
				lowest = item.m_id.toInt() -1;
			}
		});

		data.m_id = String(lowest);
	}

	var dup = this.m_postits.filter( function(item){
		if( item.m_id == data.m_id )
		{
			return true;
		}

		if( item.m_author == data.m_author &&
			item.m_content == data.m_content &&
			item.m_date == data.m_date )
		{
			if( item.m_id < 0 && data.m_id > 0 )
			{
				item.m_id = data.m_id;
				item.m_status = "";
			}

			return true;
		}


	});

	if( dup.length <=0 )
	{
		data.bubble = true;
		this.m_postits.include( data );
	}
}


/**
 * 根據物件編號刪除一個 Postit 物件
 * @param id
    *      要刪除的物件的 id
 */
Skalde.prototype.delPostit = function (id)
{
	this.m_postits.each( function(item){
		if( item.m_id == id )
		{
			item.m_status = "deleted";
		}
	});
}


/**
 * 將指定的物件編號的物件對照指定的 Postit 物件作編輯。只改變資料，不改變位置。
 * @param id
    *      要修改的物件的編號
 * @param data
    *      用來取代舊物件的新物件
 */
Skalde.prototype.editPostit = function (id, data)
{
	this.m_postits.each( function(item){
		if( item.m_id == id )
		{
			var old = item;
			item = data;
			item.m_id = old.m_id;
			item.m_status = "changed"
			item.m_x = old.m_x;
			item.m_y = old.m_y;
			item.m_z = old.m_z;
			item.m_width = old.m_width;
			item.m_height = old.m_height;
		}
	});
}


/**
 * 將指定的物件編號的物件對照指定的 Postit 物件作更新。只改變位置，不改變資料。
 * @param id
    *      物件編號
 * @param data
    *      存放新的狀態的資料物件
 */
Skalde.prototype.updatePostit = function (id, data)
{
	this.m_postits.each( function(item){
		if( item.m_id == id )
		{
			item.m_x = data.m_x;
			item.m_y = data.m_y;
			item.m_z = data.m_z;
			item.m_width = data.m_width;
			item.m_height = data.m_height;
		}
	});
}


/**
 * 根據指定的編號列表從 Server 取回資料。若沒有指定，則取回全部。
 * @param ids
    *      指定的編號列表
 */
Skalde.prototype.pull = function ()
{

	//var query = "SELECT * FROM skalde ORDER BY m_id ASC LIMIT 200 ";
	var query = "SELECT * FROM skalde ";

	var ajax = new Ajax( this.cgipath, {
		method:'get',
		onComplete: function(response){
			var result = Json.evaluate( response ).query0;
			result.each( this.addPostit, this );
			this.update.delay( 1000,this);
		}.bind(this)
	});
	//ajax.setHeader('Cache-Control','no-cache');
	//ajax.setHeader('Pragma','No-cache');
	ajax.setHeader('If-Modified-Since','0');
	ajax.request({'query': query});
}


/**
 * 根據指定的編號的物件資料寫回 Server。若沒有指定，則寫回所有具 "changed", "deleted", "new" 狀態的物件。
 * @param ids
    *      指定的編號
 */
Skalde.prototype.push = function(){

		var other_list = this.m_postits.filter( function( item ){
			return ( item.m_status == "new" || item.m_status == "changed" );
		});

		if( other_list.length > 0 )
		{
			other_list.each( function(item){
				var query = "INSERT INTO skalde( m_content,m_author,m_date,m_style,m_x,m_y,m_z,m_width,m_height) VALUES ('"+item.m_content+"','"+item.m_author+"','"+item.m_date+"','"+item.m_style+"','"+item.m_x+"','"+item.m_y+"','"+item.m_z+"','"+item.m_width+"','"+item.m_height+"')";

				new Ajax( this.cgipath, {
					method:'get',
					onComplete: function(){
						var sk = new Skalde();
						sk.pull();
					}
				}).request({'query': query});
			},this);
		}

}

/**
 */
Skalde.prototype.update = function ()
{
	if( $$('#editordiv').length <=0 )
	{
		Window.fireEvent('redraw');
	}
}
