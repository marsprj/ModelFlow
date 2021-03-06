var TextureDialog = function(){
	this._funName = "Texture";
	FunDialog.apply(this, arguments);
}

extend(TextureDialog, FunDialog);


TextureDialog.prototype.create = function(){
	var html =   '<div class="func_dialog dialog">'
			+'<div class="titlebar">'
			+'	<div class="dialog_title">灰度共生矩阵</div>'
			+'	<div class="dialog_exit"></div>'
			+'</div>'
			+'<div class="dialog_main">'
			+'	<div class="dialog_item">'
			+'		<div class="f-left item-title">输入影像:</div>'
			+'		<div class="f-left item-content">'
			+'			<div class="f-left item-input">'
			+'				<input type="text" class="dialog-input">'
			+'			</div>'
			+'			<div class="f-left open-file" title="选择文件">'
			+'				……'
			+'			</div>'
			+'		</div>'
			+'	</div>'
			+'	<div class="dialog_item">'
			+'		<div class="f-left item-title">输出影像:</div>'
			+'		<div class="f-left item-content">'
			+'			<div class="f-left item-input">'
			+'				<input type="text" class="dialog-output f-left">'
			+'			</div>'
			+'			<div class="f-left open-file">'
			+'				……'
			+'			</div>'
			+'		</div>'
			+'	</div>'
			+'	<div class="dialog_item">'
			+'		<div class="f-left item-title">半径:</div>'
			+'		<div class="f-left item-content">'
			+'			<div class="f-left radius-div">'
			+'				<input type="text" class="f-left parms input-60" parm="radius">'
			+'			</div>'
			+'		</div>'
			+'	</div>'
			+'	<div class="dialog_item">'
			+'		<div class="f-left item-title">X向偏移:</div>'
			+'		<div class="f-left item-content">'
			+'			<div class="f-left xoffset-div">'
			+'				<input type="text" class="f-left parms input-60" parm="xoffset">'
			+'			</div>'
			+'		</div>'
			+'	</div>'
			+'	<div class="dialog_item">'
			+'		<div class="f-left item-title">Y向偏移:</div>'
			+'		<div class="f-left item-content">'
			+'			<div class="f-left yoffset-div">'
			+'				<input type="text" class="f-left parms input-60" parm="yoffset">'
			+'			</div>'
			+'		</div>'
			+'	</div>'
			+'</div>'
			+'<div class="dialog_bottom">'
			+'	<ul>'
			+'		<li>'
			+'			<a href="javascript:void(0)" id="dlg_btn_ok">确定</a>'
			+'		</li>'
			+'		<li>'
			+'			<a href="javascript:void(0)" id="dlg_btn_exit">取消</a>'
			+'		</li>'
			+'	</ul>'
			+'</div>';
	$(".func_dialog").remove();
	var dlg = $(html);
	$('body').append(dlg);

	return dlg;
}

TextureDialog.prototype.verify = function(){

	this._win.find("input").removeClass("error");
	var valueReg =  /^[0-9.]*$/;
	var value = this._win.find(".radius-div input");
	if(!valueReg.test(value.val())){
		var tooltip = new Tooltip({
			target : ".func_dialog .radius-div input",
			text : "请输入有效的半径值"
		});
		value.addClass('error');
		return false;
	}

	var value = this._win.find(".xoffset-div input");
	if(!valueReg.test(value.val())){
		var tooltip = new Tooltip({
			target : ".func_dialog .xoffset-div input",
			text : "请输入有效的X向偏移"
		});
		value.addClass('error');
		return false;
	}


	var value = this._win.find(".yoffset-div input");
	if(!valueReg.test(value.val())){
		var tooltip = new Tooltip({
			target : ".func_dialog .yoffset-div input",
			text : "请输入有效的Y向偏移"
		});
		value.addClass('error');
		return false;
	}	

	return true;
};