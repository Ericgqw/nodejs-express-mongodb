				function chart_list(){                                       
					$.ajax({ 
							url: "getdatas",
                            type:'post'	,data:{db_name:db_name,db_table:db_list_table},
							context: document.body, 
							dateType:"json",
							success: function(data){
						     console.log(data)
								//var data_json=JSON.parse(data);
							var length=data.data.length;
                                console.log(length)
							for(var i=0;i<length;i++){
							html+='<tr style="height:40px;" oh="21">';
							for(var j=0;j<5;j++){
							html +='<td id="3_2_'+(i+2)+'_'+j+'"'+' rowspan="1" colspan="1" style=" background:#062236;color:#fafafa;vertical-align:middle;text-align:center;">';
							html+="</td>";
							}
							html+="</tr>"
							}
							 //先保存div中原来的html
						 var old_html = document.getElementById("body").innerHTML; 
						 //再跟你想追加的代码加到一起插入div中 -->
						 var new_html= old_html+html;							 
						 document.getElementById("body").innerHTML = new_html;		   
							//$('#pbox').prepend(html);								
						  getdatas(data.data,3,2,0,"MACH");
						  getdatas(data.data,3,2,1,"ITEMNO");
						  getdatas(data.data,3,2,2,"PLANqty");
						  getdatas(data.data,3,2,3,"qtyOK");		   //列表赋值
						  getdatas(data.data,3,2,4,"Remainqty");
						},
							error:function(){
							
						}
					});
     }
				
				function basic_num(){                                                  //基本信息看板赋值
				   $.ajax({ 
				   url: "getdatas",
			       type:'post',data:{db_name:db_name,db_table:db_basic_table},
				   context: document.body, 
				   dateType:"json",
				   success: function(data){

				     var now = new Date();
					$("#1_0_0_0").text(data.data[0]["PLANqty"]);
					$("#1_0_0_3").text(data.data[0]["TARGETqty"]);
					$("#1_0_3_3").text(data.data[0]["MACHqty"]);
					$("#1_0_0_6").text(data.data[0]["DONEqty"]);
					$("#1_0_3_0").text(data.data[0]["NGqty"]);
					$("#1_0_0_9").text(data.data[0]["Remainqty"]);
					$("#1_0_3_6").text(data.data[0]["DoneRate"]);
					$("#1_0_3_9").text(data.data[0]["RemainRate"]);
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
 	                            //当自动机开机数是11时执行该分支
			    for(var i=0;i<length;i++){
			   //$("#3_2_2_0").text(data_json[0]["MACH"]); 
                $("#"+one+"_"+two+"_"+(i+2)+"_"+four).text(data_json[i][string]);			
			}
			  }  
		  		  
		  function draw_chart(object,db_table,db_name){         //object中定义的值必须跟数据库返回的字段相同
  		       var temp=new Array(); 
	     	  $.ajax({ 		url:"getdatas",
                            type:'post'	,data:{db_table:db_table,db_name:db_name},
							context: document.body, 
							dateType:"json",
							async: false,
							success: function(data){
							 var arr = Object.keys(object);
							 var len = arr.length;	                           						 
							 var array=Object.getOwnPropertyNames(object);   //Array[i](取出key)  object[Array[i]](取出value)
							 for(var i=0;i<len;i++){
							   temp[i]=getString(data.data,object[array[i]]);
							 }					                      							 
						},				  
							error:function(){

						}
					}); 
                return temp;					
		  }