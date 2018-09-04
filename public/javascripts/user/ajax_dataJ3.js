				function chart_list(){                                       
					$.ajax({ url: "php/getdatas.php",
                            type:'post'	,data:{sql:"select * from Plan_J3prd",db_ip:"192.168.168.239",db_name:"KOIDE"},					
							context: document.body, 
							dateType:"json",
							success: function(data){
							var data_json=JSON.parse(data); 
                            var length=data_json.length;
							var html =" ";
							for(var i=0;i<length-11;i++){
							html+='<tr style="height:40px;" oh="21">';
							for(var j=0;j<5;j++){
							html +='<td id="3_2_'+(i+14)+'_'+j+'"'+' rowspan="1" colspan="1" style="display:none; background:#062236;color:#fafafa;vertical-align:middle;text-align:center;">';
							html+="</td>";
							}
							html+="</tr>"
							}
							$('#pbox').prepend(html);							
						  getdatas(data_json,3,2,0,"MACH");			 						 
						  getdatas(data_json,3,2,1,"ITEMNO");
						  getdatas(data_json,3,2,2,"PLANqty");	 					 
						  getdatas(data_json,3,2,3,"qtyOK");		   //列表赋值			  
						  getdatas(data_json,3,2,4,"Remainqty");
                          						  
						},
							error:function(){
							
						}
					});
     }
				
				function basic_num(){                                                  //基本信息看板赋值
				   $.ajax({ url: "php/getdatas.php", 
			       type:'post',data:{sql:"select * from Plan_J3Sum",db_ip:"192.168.168.239",db_name:"KOIDE"},
				   context: document.body, 
				   dateType:"json",
				   success: function(data){
				     var data_json=JSON.parse(data);
				     var now = new Date();
					$("#1_0_0_0").text(data_json[0]["PLANqty"]);
					$("#1_0_0_3").text(data_json[0]["TARGETqty"]);
					$("#1_0_3_3").text(data_json[0]["MACHqty"]);
					$("#1_0_0_6").text(data_json[0]["DONEqty"]);
					$("#1_0_3_0").text(data_json[0]["NGqty"]);
					$("#1_0_0_9").text(data_json[0]["Remainqty"]);
					$("#1_0_3_6").text(data_json[0]["DoneRate"]);
					$("#1_0_3_9").text(data_json[0]["RemainRate"]); 
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
		  function getdatas(data_json,one,two,four,string){
			 var length=data_json.length;
	                             
			    for(var i=0;i<length;i++){
			   //$("#3_2_2_0").text(data_json[0]["MACH"]); 
                $("#"+one+"_"+two+"_"+(i+2)+"_"+four).text(data_json[i][string]);					 
			}			  		  
		  }
		  
		  function draw_chart(sql_sentence,object,db_ip,db_name){         //object中定义的值必须跟数据库返回的字段相同
  		       var temp=new Array(); 
	     	  $.ajax({ url:"php/getdatas.php",
                            type:'post'	,data:{sql:sql_sentence,db_ip:db_ip,db_name:db_name},					
							context: document.body, 
							dateType:"json",
							async: false,
							success: function(data){
							 var data_json=JSON.parse(data);
							 var arr = Object.keys(object);
							 var len = arr.length;	                           						 
							 var array=Object.getOwnPropertyNames(object);   //Array[i](取出key)  object[Array[i]](取出value)
							 for(var i=0;i<len;i++){
							   temp[i]=getString(data_json,object[array[i]]);                          							  
							 }					                      							 
						},
						  
							error:function(){
                              alert("出错")								
						}
					}); 
                return temp;					
		  }