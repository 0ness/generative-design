/*==============================================================================

	スニペット用
	
==============================================================================*/




/*２次元配列のソート
dimensionArySort(ソート配列:Array、開始番号:uint、昇順か降順化の指定:boolean)
昇順はtrue,降順はfalse
--------------------------------------------------------------------*/
function dimensionArySort(_ary,_col,_flg){
	var ary = _ary;
	var col = _col;
	var srt = (_flg === true)? 1 : -1;
	ary.sort(function(a , b){ return((a[col] - b[col]) * srt);});
	return(ary);
}
