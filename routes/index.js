var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var DBNAME = "weex";
router.get('/', function(req, res, next) {
  res.render('index', {title:DBNAME});
});

//var port=mongo.Connection.DEFAULT_PORT;
var host="localhost";
var server=new mongo.Server(host,27017,{auto_reconnect:true});//创建数据库所在的服务器
var db=new mongo.Db(DBNAME,server,{safe:true});//创建数据库对象
/* GET home page. */
router.post('/', function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin","*");
	res.setHeader("Content-Type","text/plain;utf-8");
	var collection=req.body.collection,inquire,user=req.body.user,pwd=req.body.pwd,condition=req.body.condition,limit=parseInt(req.body.limit),page=parseInt(req.body.page),sort=req.body.sort;
	console.log(condition);
	if(collection!=undefined&&user!=undefined&&pwd!=undefined)
		db.open(function (err,db) {
		    db.authenticate(user,pwd,function(err,result){
		    	if(err){
		    		res.end(JSON.stringify({err:err}));
		    		db.close();
		    		console.log("err:"+err);
		    	}else{
				  	console.log("链接成功"+result);
					db.collection(collection,function(err,collection){
						if(err) throw err;
			        	else{
			        		if(condition!=""){
			        			inquire=JSON.parse(condition);
			        		}else{
			        			inquire={xxxxxxxxxxxxxxx:{$exists:false}};
			        		}

			        		collection.find(inquire).count(function(err,count){
			        			if(err) throw err;
			        			else{
			        				sort=JSON.parse(sort);
			        				var sumpage=Math.ceil(count/limit)
			        				if(page>sumpage-1)
			        					page=sumpage-1;
			        				var skip=page*limit;
				        			collection.find(inquire).sort(sort).skip(skip).limit(limit).toArray(function(err,docs){
					        			if(err) throw err;
					        			else{
						        			res.end(JSON.stringify({success:true,count:count,page:page,sumpage:sumpage,data:docs}));
						        			db.close();
						        		}
					        		})
				        		}
			        		})
			        	}
			        });
			    }
		    });
		});
});
module.exports=router;