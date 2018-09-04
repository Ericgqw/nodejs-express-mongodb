var FormDataList = function(context) {
    this.context = context;
}

FormDataList.prototype = {
    init:function() {
        this.initEvent();
    }
}

FormDataList.prototype.initEvent = function() {
    var formData = this;
    $("#icon-add-form").click(function() {
         var formId = $("#formId").val();
         location.href = formData.context + "/app/"+formId+".form";
    });
    
    $("#icon-edit-form").click(function(){
         var dataId = $('input[type=checkbox]:checked').val();
         if(!dataId) {
            layer.open({
				  title: ['信息提示']
				  ,anim: 'up'
				  ,content: "请选择要更新的数据!"
				  ,btn: ['确认']
			 });
            return;
         }
         
         var formId = $("#formId").val();
         location.href = formData.context + "/form/app/modView.htm?formId="+formId+"&dataId=" + dataId;
    });
    
    $("#icon-query-form").click(function() {
         var dataId = $('input[type=checkbox]:checked').val();
         if(!dataId) {
            layer.open({
				  title: ['信息提示']
				  ,anim: 'up'
				  ,content: "请选择要显示的数据!"
				  ,btn: ['确认']
			 });
            return;
         }
         var formId = $("#formId").val();
         location.href = formData.context + "/form/app/queryForm.htm?formId="+formId+"&dataId=" + dataId;
    });
    
     $("#icon-del-form").click(function() {
    	 var dataIds = new Array();
    	 $('input[type=checkbox]:checked').each(function() {
    		 dataIds.push($(this).val());
    	 });
         var formId = $("#formId").val();
         
         if(dataIds.length == 0) {
            layer.open({
				  title: ['信息提示']
				  ,anim: 'up'
				  ,content: "请选择要删除的数据!"
				  ,btn: ['确认']
			 });
            return;
         }
         
         layer.open({
    	     content: '您确定要删除选中的数据吗?'
    	     ,btn: ['确定', '取消']
    	     ,yes: function(index){
    	    	 $.ajax({
    				   type: "POST",
    				   url: formData.context + "/form/delete.htm",
    				   data: {formId:formId, dataId:dataIds},
    				   dataType : "json",
    				   success: function(suc){
    				      layer.close(index);
    				      if(!suc) {
    				         layer.open({
    							  title: ['信息提示']
    							  ,anim: 'up'
    							  ,content: "数据删除出现错误!"
    							  ,btn: ['确认']
    						 });
    				      } else {
    				         report.loadContentWithParam();
    				      }
    				   },
    				   error:function() {
    					   layer.close(index);
    				       layer.open({
    							title: ['信息提示']
    							,anim: 'up'
    							,content: "数据删除出现错误!"
    							,btn: ['确认']
    					    });
    				   }
    			   });	
    	          
    	      }
    	  });
     });
}