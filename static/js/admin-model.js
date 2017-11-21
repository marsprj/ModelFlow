function showModelsStatus (status) {
	$("#model_panel .count-div #count span").html('0');
	$("#model_table .row:not(.header)").remove();

	getModelsStatusCount(status,onGetModelsStatusCount);
}

// 获取状态
function getModelsStatusCount(status,callback){
	if(!status){
		if(callback){
			callback("");
		}
		return;
	}
	var url = "/model/models/" + status + "/status/count/" ;
	$.ajax({
		type:"GET",
		url:url,
		contentType: "text/plain",
		dataType : "text",
		success:function(json){
			var result = JSON.parse(json);
			if(callback){
				callback(result);
			}
		},
	 	error:function(xhr){
            console.log(xhr);
        }
	});
}


function onGetModelsStatusCount(result){
	if(result.status == "error"){
		alert(result.message);
		return;
	}

	$("#model_panel .count-div #count span").html(result.count);


	var pageCount = Math.ceil(result.count/g_modelMaxCount);
	g_modelPageCount = pageCount;

	initModelPageControl(1, g_modelPageCount);
}

// 初始化模型页码
function initModelPageControl(currentPage,pageCount){
	if(currentPage <=0 || currentPage > pageCount){
		return;
	}
	var html = "";
	// 前一页
	if(currentPage == 1){
		html += '<li class="disabled">'
			+ '		<a href="javascript:void(0)" aria-label="Previous">'
			+ '			<span aria-hidden="true">«</span>'
			+ '		</a>'
			+ '	</li>';
	}else{
		html += '<li>'
			+ '		<a href="javascript:void(0)" aria-label="Previous">'
			+ '			<span aria-hidden="true">«</span>'
			+ '		</a>'
			+ '	</li>';
	}
	// 如果页码总数小于要展示的页码，则每个都显示
	if(pageCount <= g_pageNumber){
		for(var i = 1; i <= pageCount; ++i){
			if(i == currentPage){
				html += '<li class="active">'
				+ 	'	<a href="javascript:void(0)">' + currentPage.toString() 
				// + 	'		<span class="sr-only">(current)</span>'
				// + 	'		<span class="sr-only">(' + currentPage + ')</span>'
				+	'</a>'
				+ 	'</li>';
			}else{
				html += "<li>"
					+ "<a href='javascript:void(0)'>" + i + "</a>"
					+ "</li>";	
			}
		}	
	}else{
		// 开始不变化的页码
		var beginEndPage = pageCount - g_pageNumber + 1;
		if(currentPage <= beginEndPage){
			for(var i = currentPage; i < currentPage + g_pageNumber;++i){
				if(i == currentPage){
					html += '<li class="active">'
					+ 	'	<a href="javascript:void(0)">' + currentPage
					// + 	'		<span class="sr-only">(current)</span>'
					+	'</a>'
					+ 	'</li>';
				}else{
					html += "<li>"
						+ "<a href='javascript:void(0)'>" + i + "</a>"
						+ "</li>";	
				}					
			}
		}else{
			for(var i = beginEndPage; i <= pageCount; ++i){
				if(i == currentPage){
					html += '<li class="active">'
					+ 	'	<a href="javascript:void(0)">' + currentPage
					// + 	'		<span class="sr-only">(current)</span>'
					+	'</a>'
					+ 	'</li>';
				}else{
					html += "<li>"
						+ "<a href='javascript:void(0)'>" + i + "</a>"
						+ "</li>";	
				}
			}
		}
	}
	
	// 最后一页
	if(currentPage == pageCount){
		html += '<li class="disabled">'
			+ '		<a href="javascript:void(0)" aria-label="Next">'
			+ '			<span aria-hidden="true">»</span>'
			+ '		</a>'
			+ '	</li>';
	}else{
		html += '<li>'
			+ '		<a href="javascript:void(0)" aria-label="Next">'
			+ '			<span aria-hidden="true">»</span>'
			+ '		</a>'
			+ '	</li>';
	}

	$("#model_panel .pagination").html(html);

	registerModelPageEvent();

	getModelPage(currentPage);
}

function registerModelPageEvent(){
	$("#model_panel .pagination li a").click(function(){
		var active = $(".pagination li.active a").html();
		var currentPage = parseInt(active);

		var label = $(this).attr("aria-label");
		if(label == "Previous"){
			currentPage = currentPage - 1;
		}else if(label == "Next"){
			currentPage = currentPage + 1;
		}else{
			currentPage = parseInt($(this).html());
		}
		
		initModelPageControl(currentPage,g_modelPageCount);
	});
}

// 按照页码获取
function getModelPage(page){
	if(page <= 0  || page > g_modelPageCount){
		return;
	}

	var offset = (page -1) * g_modelMaxCount;

	$("#model_table .row:not(.header)").remove();
	$("#model .panel-content").addClass("loading");



	getModelsStatus(g_model_state,g_modelMaxCount,offset,function(result){

		$("#model_panel .panel-content").removeClass("loading");
		if(result.status == "error"){
			alert(result.message);
			return;
		}

		var html = '';
		for(var i = 0; i < result.length;++i){
			var model = result[i];
			var status = model.status;
			if(status == "on"){
				checked = "checked";
			}else if (status == "off") {
				checked = ""
			}

			var showStatus = (model.monitor_status == "ok")?(status == "on"?'开启':'关闭') : "异常"; 
			var rowClass = "";
			if(model.monitor_status == "error"){
				rowClass = "failed-row";
			}
			html += '<div class="row ' + rowClass + '" uuid="' + model.uuid +'">'
	            +'    <div class="cell">' + (i +1) + '</div>'
	            +'    <div class="cell">' + model.name  + '</div>'
	            +'    <div class="cell">' + model.user  + '</div>'
	            +'    <div class="cell">' + model.create_time + '</div>'
	            +'    <div class="cell">'
	            +'        <label class="switch">'
	            +'            <input type="checkbox" ' + checked + '>'
	            +'            <span class="slider round"></span>'
	            +'        </label>'
	            +'    </div>'
	            // +'    <div class="cell">' + (status == "on"?'开启':'关闭') + '</div>'
	            +'    <div class="cell">' + showStatus + '</div>'
	            +'</div>';
		}
		$("#model_table .row:not(.header)").remove();
	 	$("#model_table .header").after(html);	

	 	$("#model_table .row input[type='checkbox']").change(function(event) {
	 		changeModelMonitorStatus(this);
	 	});
	});
}

// 获取模型列表
function getModelsStatus(status,count,offset,callback){
	if(!status || count == null || offset == null){
		if(callback){
			callback("")
		}
		return;
	}
	var url = "/model/models/" + status + "/status/" + count + "/" + offset + "/";
	$.ajax({
		url : url,
		dataType : "text",
		async : true,
		success : function(json,textStatus){
			var result = JSON.parse(json);
			if(callback){
				callback(result);
			}
		},
		error : function(xhr){
			console.log(xhr)
		}
	});
}
