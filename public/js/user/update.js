	window.flag = 0;
	window.html=" ";
     function change(table){
	  var css_style="background:#062236;color:#fafafa;vertical-align:middle;text-align:center;";
		var row = table.insertRow(table.rows.length);//在table的最后增加一行,table.rows.length是表格的总行数
		table.style=css_style;
		for(j=0;j<table.rows[0].cells.length;j++){//循环第一行的所有单元格的数据，让其加到最后新加的一行数据中（注意下标是从0开始的）			
			var cell = row.insertCell(j);//给新插入的行中添加单元格
			cell.height = "40px";//一个单元格的高度，跟css样式中的line-height高度一样
			cell.style.cssText=css_style;
			cell.innerHTML = table.rows[0].cells[j].innerHTML;//设置新单元格的内容，这个根据需要，自己设置	
		}
		table.deleteRow(0);//删除table的第一行
	};
	  function tableInterval(){
		var table = document.getElementById("body");//获得表格
		change(table);//执行表格change函数，删除第一行，最后增加一行，类似行滚动
	};
	setInterval(tableInterval,2000);//每隔2秒执行一次change函数，相当于table在向上滚动一样
		$(document).ready(function(){
			 basic_num();
			});	
         $(function(){		
 		//setInterval(chart_bar,5000);
		setInterval(updatedata,120000);   //120s
 		function updatedata(){
		   basic_num();	     //信息基本信息更新  
		   chart_list();     //列表更新
		 }
		})
	  $(window).resize(function() {
	 	setTimeout( window.location.reload(),700)//5s浏览器窗口改变700m后强制刷新页面
	   });
