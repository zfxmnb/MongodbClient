(function(){
$(window).load(function(){
var collection,user,pwd,page=0,limit=5,sort='{"$natura":-1}',noNull=false;

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
	collection=$("#collection").val();user=$("#dbuser").val();pwd=$("#dbpwd").val();page=$("#page").val();limit=$("#limit").val();
	if($("#sortobj").val()!=""){
		sort='{"'+$("#sortobj").val()+'":'+$("#sort").val()+'}'
	}else{
		sort='{"$natura":'+$("#sort").val()+'}';
	}
	console.log(sort);
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
		var string="";
		var key=$(".inquire_1").eq(0).find(".key").val(),value=$(".inquire_1").eq(0).find(".value").val(),type=$(".inquire_1").eq(0).find(".type").val();
		if(key!=""&&value!=""){
			if(type==""){
				string+='{"'+key+'":"'+value+'"}';
			}else if(type=="$in"||type=="$nin"||type=="$all"){
				if(typeof JSON.parse(value)=="object")
					string+='{"'+key+'":{"'+type+'":'+value+'}}'; 
			}else{
				string+='{"'+key+'":{"'+type+'":"'+value+'"}}';
			}
		}
		data(string);
	}
	$("#showInquire").val(string);
	
});
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



function data(s){
	$.ajax({
		url:"http://192.168.1.175:8080",
		type:"post",
		dataType:"json",
		data:{collection:collection,user:user,pwd:pwd,condition:s,page:page,limit:limit,sort:sort},
		success:function(docs){
			if(docs.success){
				var string="",options="<option value='"+docs.page+"'>"+(docs.page+1)+"页</option>";
				for(var i=0;i<docs.sumpage;i++){
					if(i!=docs.page)
						options+="<option value='"+i+"'>"+(i+1)+"页</option>"
				}
				$("#page").html(options);
				for(var i=0;i<docs.data.length;i++){
					var substring="",l=0;
					for(var j in docs.data[i]){
						l++;
						if(j!="_id")
							substring+='<tr><td class="key">'+j+'</td><td class="value"><div>'+docs.data[i][j]+'</div></td><td class="options"><button class="edit_btn">修改</button><button class="empty_btn">清空</button></td></tr>';
						else
							substring+='<tr><td class="key">'+j+'</td><td class="value" colspan=2><div>'+docs.data[i][j]+'</div></td></tr>';
					}
					substring='<tr><td class="num" rowspan='+(l+1)+'>'+(i+1)+'</td><td class="subtitle_key">key</td><td class="subtitle_value" colspan=2>value</td><td rowspan='+(l+1)+' class="remove"><button class="remove_btn">修改</button></td></tr>'+substring;
					string+=substring;
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