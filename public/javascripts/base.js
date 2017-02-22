(function(){
$(window).load(function(){
var collection,user,pwd,page=0,limit=5,sort='{"$natura":-1}',noNull=false;
var url="http://192.168.1.175:8080";

setTimeout(function(){
if($.cookie("collection"))
	$("#collection").val($.cookie("collection"));
if($.cookie("user"))
	$("#dbuser").val($.cookie("user"));
if($.cookie("pwd"))
	$("#dbpwd").val($.cookie("pwd"));
},1500)

$("#add").click(function(){
	$(".inquire_0").append($("#template").val());
});

$("#submit").click(function(){
	find();
});

$("#page").change(function(){
	find();
});

$("#insert").click(function(){
	insert();
})

$(".right_con").on("click",".remove",function(){
	$(this).parents(".inquire_1").remove();
});

$(".db_list").on("click","td.value div",function(){
	if($(this).hasClass("unfold")){
		$(this).removeClass("unfold");
	}else{
		$(this).addClass("unfold");
	}
});
$(".left_con .change").click(function(){
	$.cookie("collection",$("#collection").val());
	$.cookie("user",$("#dbuser").val());
	$.cookie("pwd",$("#dbpwd").val());
});

$(".db_list").on("click",".remove_btn",function(){
	var t=$(this).parents(".list");
	var d=t.find(".tid").attr("tid");
	removeDialog(d,t);
});

$(".db_list").on("click",".edit_btn",function(){
	var t=$(this).parents(".list");
	var d=t.find(".tid").attr("tid");

});
$(".db_list").on("click",".empty_btn",function(){
	var t=$(this).parents(".list");
	var d=t.find(".tid").attr("tid");

});
$(".db_list").on("click",".add_btn",function(){
	var t=$(this).parents(".list");
	var d=t.find(".tid").attr("tid");
	addDialog(t,d)
});
$(".db_list").on("click",".empty_btn",function(){
	var t=$(this).parents(".list");
	var d=t.find(".tid").attr("tid");
	var e=$(this).parents("tr");
	var k=e.find(".key").attr("tkey");
	emptyDialog(t,d,e,k)
});
$(".db_list").on("click",".edit_btn",function(){
	var t=$(this).parents(".list");
	var d=t.find(".tid").attr("tid");
	var e=$(this).parents("tr");
	var k=e.find(".key").attr("tkey");
	var v=e.find(".value").attr("tvalue");
	updateDialog(t,d,e,k,v)
});

$(".dialog a").click(function(){
	$(".dialog .key,.dialog .value").val("");
	$(".dialog").hide();
	$(".dialog button").off("click")
});

function removeDialog(d,t){
	$(".dialog").hide();
	$("#removeDialog button").off("click");
	$("#removeDialog").show().one("click","button",function(){
		remove(d,t);
		$(".dialog a").trigger("click");
	});
}

function addDialog(t,d){
	$(".dialog").hide();
	$("#addDialog button").off("click");
	$("#addDialog").show().one("click","button",function(){
		var k=$("#addDialog .key").val(),v=$("#addDialog .value").val();
		var obj={};
		obj[k]=v;
		var s=JSON.stringify(obj);
		update(s,d,"set");
		$(".dialog a").trigger("click");
	});
}
function emptyDialog(t,d,e,k){
	$(".dialog").hide();
	$("#emptyDialog button").off("click");
	$("#emptyDialog .key").html(k);
	$("#emptyDialog").show().one("click","button",function(){
		var obj={};
		obj[k]="";
		var s=JSON.stringify(obj);
		update(s,d,"unset");
		$(".dialog a").trigger("click");
	});
}
function updateDialog(t,d,e,k,v){
	$("#updateDialog .key").val(k);
	$("#updateDialog .value").val(v);
	$(".dialog").hide();
	$("#updateDialog button").off("click");
	$("#updateDialog").show().on("click","button",function(){
		var v=$("#updateDialog .value").val();
		var obj={};
		obj[k]=v;
		var s=JSON.stringify(obj);
		update(s,d,"set");
		$(".dialog a").trigger("click");
	});
}

function insert(){
	collection=$("#collection").val();user=$("#dbuser").val();pwd=$("#dbpwd").val();page=$("#page").val();limit=$("#limit").val();
	if(!(collection!=""&&user!=""&&pwd!=""))
		return false;
	var string='{';
	$(".inquire_1").each(function(index){
		var key=$(this).find(".key").val(),value=$(this).find(".value").val();
		if(key!=""&&value!=""){
			if(index==0){
				string+='"'+key+'":"'+value+'"';
			}
			else
				string+=',"'+key+'":"'+value+'"';
		}
	});
	string+='}';
	$("#showInquire").val(string);
	$.ajax({
		url:url,
		type:"post",
		dataType:"json",
		data:{collection:collection,user:user,pwd:pwd,type:"insert",condition:string},
		success:function(docs){

		}
	})
}

function update(s,d,t){
	$.ajax({
		url:url,
		type:"post",
		dataType:"json",
		data:{collection:collection,user:user,pwd:pwd,type:t,condition:s,id:d},
		success:function(docs){
			if(docs.success)
				$("#submit").trigger("click");
		}

	})
}

function remove(d,t){
	$.ajax({
		url:url,
		type:"post",
		dataType:"json",
		data:{collection:collection,user:user,pwd:pwd,type:"remove",id:d},
		success:function(docs){
			t.remove();
		}	
	})
}

function find(){
	collection=$("#collection").val();user=$("#dbuser").val();pwd=$("#dbpwd").val();page=$("#page").val();limit=$("#limit").val();
	if($("#sortobj").val()!=""){
		sort='{"'+$("#sortobj").val()+'":'+$("#sort").val()+'}'
	}else{
		sort='{"$natura":'+$("#sort").val()+'}';
	}
	if(!(collection!=""&&user!=""&&pwd!=""))
		return false;
	var gtype=$("#type").val();
	if(gtype!=""){
		var string='{"'+gtype+'":[';
		$(".inquire_1").each(function(index){
			var key=$(this).find(".key").val(),value=$(this).find(".value").val(),type=$(this).find(".type").val();
			if(key!=""&&value!=""){
				noNull=true;
				if(index==0){
					if(type==""){
						string+='{"'+key+'":"'+value+'"}';
					}else if(type=="$in"||type=="$nin"||type=="$all"){
						if(Object.prototype.toString.call(JSON.parse(value))=="[object Array]")
							string+='{"'+key+'":{"'+type+'":'+value+'}}'; 
					}else{
						string+='{"'+key+'":{"'+type+'":"'+value+'"}}'; 
					}
				}
				else
					if(type==""){
						string+=',{"'+key+'":"'+value+'"}';
					}else if(type=="$in"||type=="$nin"||type=="$all"){
						if(Object.prototype.toString.call(JSON.parse(value))=="[object Array]")
							string+=',{"'+key+'":{"'+type+'":'+value+'}}'; 
					}else{
						string+=',{"'+key+'":{"'+type+'":"'+value+'"}}'; 
					}
			}
		});
		string+=']}';
		if(noNull)
			data(string);
	}else{
		var string='{';
		$(".inquire_1").each(function(index){
			var key=$(this).find(".key").val(),value=$(this).find(".value").val(),type=$(this).find(".type").val();
			if(key!=""&&value!=""){
				if(index==0){
					if(type==""){
						string+='"'+key+'":"'+value+'"';
					}else if(type=="$in"||type=="$nin"||type=="$all"){
						if(Object.prototype.toString.call(JSON.parse(value))=="[object Array]")
							string+='"'+key+'":{"'+type+'":'+value+'}'; 
					}else{
						string+='"'+key+'":{"'+type+'":"'+value+'"}'; 
					}
				}
				else
					if(type==""){
						string+=',"'+key+'":"'+value+'"';
					}else if(type=="$in"||type=="$nin"||type=="$all"){
						if(Object.prototype.toString.call(JSON.parse(value))=="[object Array]")
							string+=',"'+key+'":{"'+type+'":'+value+'}'; 
					}else{
						string+=',"'+key+'":{"'+type+'":"'+value+'"}'; 
					}
			}
		});
		string+='}';
		data(string);
	}
	$("#showInquire").val(string);
}

function data(s){
	$.ajax({
		url:url,
		type:"post",
		dataType:"json",
		data:{collection:collection,user:user,pwd:pwd,type:"find",condition:s,page:page,limit:limit,sort:sort},
		success:function(docs){
			if(docs.success){
				var string="",options="<option value='"+docs.page+"'>"+(docs.page+1)+"页</option>";
				for(var i=0;i<docs.sumpage;i++){
					if(i!=docs.page)
						options+="<option value='"+i+"'>"+(i+1)+"页</option>"
				}
				$("#page").html(options);
				for(var i=0;i<docs.data.length;i++){
					var substring='',l=0;
					for(var j in docs.data[i]){
						l++;
						if(j!="_id")
							substring+='<tr><td class="key" tkey=\''+j+'\'>'+j+'</td><td class="value" tvalue=\''+docs.data[i][j]+'\'><div>'+docs.data[i][j]+'</div></td><td class="options"><button class="edit_btn">修改</button><button class="empty_btn">清空</button></td></tr>';
						else
							substring+='<tr class="tid" tid=\''+docs.data[i][j]+'\'><td class="key">'+j+'</td><td class="value" colspan=2><div>'+docs.data[i][j]+'</div></td></tr>';
					}
					substring='<table border="1" cellspacing="0" class="list"><tr><td class="num" rowspan='+(l+1)+'>'+(i+1)+'</td><td class="subtitle_key">key</td><td class="subtitle_value" colspan=2>value</td><td rowspan='+(l+1)+' class="remove"><button class="remove_btn">删除</button><button class="add_btn">增加</button></td></tr>'+substring;
					string+=substring+'</table>';
				}
				$(".db_list").html(string);
			}else{
				$(".db_list").html("");
			}
		}
	})
}
})
})()