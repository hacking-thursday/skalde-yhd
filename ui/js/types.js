/**
  * class Postit
  */

Postit = function ()
{
  this._init ();
}


/**
 * _init sets all Postit attributes to their default value. Make sure to call this
 * method within your class constructor
 */
Postit.prototype._init = function ()
{
  /**
   * 物件編號
   */
  this.m_id = "";
  /**
   * "new": 剛新增
   * "changed": 資料更改過
   * "deleted": 已經移除
   */
  this.m_status = "";
  /**
   */
  this.m_x = "";
  /**
   */
  this.m_y = "";
  /**
   */
  this.m_z = "";
  /**
   */
  this.m_width = "";
  /**
   */
  this.m_height = "";

  /**Aggregations: */

  /**Compositions: */

}


/**
  * class Message
  */

Message = function ()
{
  this._init ();
}

Message.prototype = new Postit ();

/**
 * _init sets all Message attributes to their default value. Make sure to call this
 * method within your class constructor
 */
Message.prototype._init = function ()
{
  /**
   */
  this.m_content = "";
  /**
   */
  this.m_author = "";
  /**
   * In seconds.
   *  
   *  !! Note precision in the client side is 'milisecond' (javascript)
   *  !!   and in server side is often 'secode' ( php, sql )...
   *  !!   take care the conversion between two precision.
   *
   */
  this.m_date = "";
  /**
   * 表現的樣式（先暫訂用在字型上）
   */
  this.m_style = "";
  /**
   * 小圖示
   */
  this.m_icon= "";

  /**Aggregations: */

  /**Compositions: */

}


