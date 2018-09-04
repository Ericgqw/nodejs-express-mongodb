var closableTab = {
	frameLoad:function(frame){
		if(closableTab.ldIndex != undefined) {
			layer.close(closableTab.ldIndex);
		}
	},

	addTab:function(tabItem) {
		var id = "tab_seed_" + tabItem.id;
		var container ="tab_container_" + tabItem.id;

		$("li[id^=tab_seed_]").removeClass("active");
		$("div[id^=tab_container_]").removeClass("active");
		
		var newTab = false;

		if(!$('#'+id)[0]){
			newTab = true;
			var li_tab = '<li role="presentation" class="" id="'+id+'"><a href="#'+container+'" class="taba" role="tab" data-toggle="tab" style="position: relative;padding:2px 20px 2px 15px">'+tabItem.name;
			if(tabItem.closable){
				li_tab = li_tab + '<i class="icon iconfont icon-delete fa-lg" tabclose="'+id+'" style="position: absolute;right:4px;top: 4px;font-size:12px;"  onclick="closableTab.closeTab(this)"></i></a></li> ';
			}else{
				li_tab = li_tab + '</a></li>';
			}
		
		 	var tabpanel = '<div role="tabpanel" class="tab-pane" id="'+container+'" style="width: 100%;height:100%;">'+
	    					  '<iframe src="'+tabItem.url+'" id="tab_frame_2" frameborder="0" style="overflow-x: hidden; overflow-y: hidden;width:100%;height: 100%"  onload="closableTab.frameLoad(this)"></iframe>'+
	    				   '</div>';


			$('.nav-tabss').append(li_tab);
			$('.tab-content').append(tabpanel);
			
			this.moveMenu($('.nav-tabss').parent());
		}
		$("#"+id).addClass("active");
		$("#"+container).addClass("active");
		
		if(!newTab) {
			this.refresh(tabItem.url);
		}
		
		closableTab.ldIndex = layer.load(2);
	},

	closeTab:function(item) {
		var val = $(item).attr('tabclose');
		var containerId = "tab_container_" + val.substring(9);
   	    
   	    if($('#'+containerId).hasClass('active')){
   	    	$('#'+val).prev().addClass('active');
   	    	$('#'+containerId).prev().addClass('active');
   	    }
   	    
   	    var removeW = $("#"+val).width();

		$("#"+val).remove();
		$("#"+containerId).remove();
		
		this.rmMoveMenu(removeW);
	},
	
	refresh:function(url) {
		var ifrDiv = $(".tab-content").find("div.active");
		var ifr = ifrDiv.find("iframe");
		ifr.attr("src", url);
	},
	
	refreshNoUrl:function() {
		var ifrDiv = $(".tab-content").find("div.active");
		var ifr = ifrDiv.find("iframe");
		ifr.attr("src", ifr.attr("src"));
	},
	
	moveMenu:function(tabUl) {
		var width = tabUl.width();
		var navTabss = tabUl.find(".nav-tabss");
		var tabWidth = 0;
		navTabss.find("li").each(function() {
			tabWidth += $(this).width();
		});
		if(tabWidth > width) {
			if($('.nav-my-tab .leftArrow').is(":hidden")) {
				$('.nav-my-tab .leftArrow').show();
			    $('.nav-my-tab .rightArrow').show();
			    var tabW = $(window).width() - 310;
			    $("ul.nav-my-tab").find("li.middletab").width(tabW);
			}
			navTabss.animate({left:(width-tabWidth) + 'px'}, 200);
		}
	},
	
	rmMoveMenu:function(width) {
		var navTabss = $(".middletab .nav-tabss");
        var strLeft = navTabss.css('left');
        var iLeft = parseInt(strLeft.replace('px', ''));
        iLeft = iLeft + width  < 0 ? iLeft + width : 0;
        navTabss.animate({left:iLeft + 'px'});
        var tabWidth = 0;
		navTabss.find("li").each(function() {
			tabWidth += $(this).width();
		});
		var tabW = $("li.middletab").width();
		if(tabWidth < tabW) {
			if(!$('.nav-my-tab .leftArrow').is(":hidden")) {
				$('.nav-my-tab .leftArrow').hide();
			    $('.nav-my-tab .rightArrow').hide();
			    var tabW = $(window).width() - 240;
			    $("ul.nav-my-tab").find("li.middletab").width(tabW);
			}
		}
	}
}

$(function(){
    $(".full-screen-btn").click(function() {
    	var ifrDiv = $(".tab-content").find("div.active");
 	    var ifr = ifrDiv.find("iframe")[0];
 	    if (ifr.requestFullscreen) {
 		   ifr.requestFullscreen();
        } else if (ifr.msRequestFullscreen) {
    	   ifr.msRequestFullscreen();
        } else if (ifr.mozRequestFullScreen) {
    	   ifr.mozRequestFullScreen();
        } else if (ifr.webkitRequestFullScreen) {
    	   ifr.webkitRequestFullScreen();
        }
    });
    
    var tabW = $(window).width() - 240;
    $("ul.nav-my-tab").find("li.middletab").width(tabW);
    
    $('.nav-my-tab .leftArrow').click(function(){
 	   var navTabss = $(".middletab .nav-tabss");
 	   var strLeft = navTabss.css('left');
        var iLeft = parseInt(strLeft.replace('px', ''));
        
 	   var totalWidth = 0;
 	   navTabss.find("li").each(function() {
         	totalWidth += $(this).width();
 	   });
 	   var tabsWidth = $(".nav-my-tab .middletab").width();
        if(totalWidth + iLeft > tabsWidth) {
     	   iLeft = totalWidth + iLeft - 200 > tabsWidth ? iLeft - 200 : (tabsWidth - totalWidth);
     	   navTabss.animate({left:iLeft + 'px'}, 200);
        }
    });
    
    $('.nav-my-tab .rightArrow').click(function(){
 	    var navTabss = $(".middletab .nav-tabss");
         var strLeft = navTabss.css('left');
         var iLeft = parseInt(strLeft.replace('px', ''));
         var totalWidth=0;
         navTabss.find("li").each(function() {
         	totalWidth += $(this).width();
 		});
         var tabsWidth = $(".nav-my-tab .middletab").width();
         if(totalWidth > tabsWidth) {
             if(iLeft >= 0){
                 return;
             }
             iLeft = iLeft + 200 < 0 ? iLeft + 200 : 0;
             navTabss.animate({left:iLeft + 'px'}, 200);
         }
     });
    
    $('.nav-my-tab .leftArrow').hide();
    $('.nav-my-tab .rightArrow').hide();
});