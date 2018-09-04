				function chart_list(){                                       
					$.ajax({ url: "getlist",
                            type:'post'	,data:{sql:"select * from RD_AUTO_Machine.Plan_prd",db_ip:"192.168.110.148",db_name:"RD_AUTO_Machine"},	context: document.body, 
							dateType:"json",
							success: function(data){
                            var length=data.plan_prd.length;
							for(var i=0;i<length-11;i++){
							html+='<tr style="height:40px;" oh="21">';
							for(var j=0;j<5;j++){
							html +='<td id="3_2_'+(i+14)+'_'+j+'"'+' rowspan="1" colspan="1" style="background:#062236;color:#fafafa;vertical-align:middle;text-align:center;">';
							html+="</td>";
							}
							html+="</tr>"
							}
						    var old_html = document.getElementById("body").innerHTML; 
							//再跟你想追加的代码加到一起插入div中 -->
							var new_html= old_html+html;							 
							document.getElementById("body").innerHTML = new_html;
							getdata(data.plan_prd,3,2,0,"mach");			 						 
							getdata(data.plan_prd,3,2,1,"itemno");						 
							getdata(data.plan_prd,3,2,2,"planqty");	 					 
							getdata(data.plan_prd,3,2,3,"qtyok");		   //列表赋值			  
							getdata(data.plan_prd,3,2,4,"remainqty");						  
						},
							error:function(){
							
						}
					});
                 }
				
				function basic_num(){                                                  //基本信息看板赋值
				   $.ajax({ url: "getbasic", 
			       type:'post',data:{sql:"select * from RD_AUTO_Machine.Plan_AutoSum",db_ip:"192.168.110.148",db_name:"RD_AUTO_Machine"},
				   context: document.body, 
				   dateType:"json",
				   success: function(data){
				     var data_json=data.plan_AutoSum
				     console.log(data_json)
				     var now = new Date();
					$("#1_0_0_0").text(data_json[0]["planqty"]);
					$("#1_0_0_3").text(data_json[0]["targetqty"]);
					$("#1_0_3_3").text(data_json[0]["machqty"]);
					$("#1_0_0_6").text(data_json[0]["doneqty"]);
					$("#1_0_3_0").text(data_json[0]["ngqty"]);
					$("#1_0_0_9").text(data_json[0]["remainqty"]);
					$("#1_0_3_6").text(data_json[0]["donerate"]);
					$("#1_0_3_9").text(data_json[0]["remainrate"]); 
					$("#time").text(now.getFullYear() + "-" +((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate());
				},	
		        error:function(){
		         
		        }
		      });
		 }
		 //参数一：json数组长度（data_json），参数二：需要拼接字符字段
		  function getString(data_json,append_string){    
		    var string=" ";			
			var length=data_json.length;
			for(var i=0;i<length;i++){
				string += 'data_json[' +i+ ']["'+append_string+'"]' + ',';
				}
				if (string.length > 0) {
                   string = string.substr(0, string.length - 1);
                }			
			
			  string=string.split(",");
			  for(var i=0;i<length;i++){
			  string[i]="'"+eval(string[i])+"'";
			}
			
			return string;
		  }
		  //参数一：json数组长度（data_json），参数二：起始的id中第1\2\3\4个数，参数三：需要赋值的字段
		  function getdata(data_json,one,two,four,string){
			 var length=data_json.length;
 	                            //当自动机开机数是11时执行该分支
			    for(var i=0;i<length;i++){
			   //$("#3_2_2_0").text(data_json[0]["MACH"]); 
                $("#"+one+"_"+two+"_"+(i+2)+"_"+four).text(data_json[i][string]);
			}
			  }  
		  function draw_chart(sql_sentence,object,type){         //object中定义的值必须跟数据库返回的字段相同
  		       var temp=new Array(); 
	     	  $.ajax({ 		url:type=="bar"?"getbar":"getline",
                            type:'post'	,data:{sql:sql_sentence,type:type},					
							context: document.body, 
							dateType:"json",
							async: false,
							success: function(data){
							console.log(data.chart)
							 var arr = Object.keys(object);
							 var len = arr.length;	                           						 
							 var array=Object.getOwnPropertyNames(object);   //Array[i](取出key)  object[Array[i]](取出value)
							 for(var i=0;i<len;i++){
							   temp[i]=getString(data.chart,object[array[i]]);                          							  
							 }					                      							 
						},				  
							error:function(){                   							
						}
					}); 
                return temp;					
		  }