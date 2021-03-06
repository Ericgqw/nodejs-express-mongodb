window.lCalendar = (function() {
	var MobileCalendar = function() {
		this.gearDate;
		this.minY = 1900;
		this.minM = 1,
			this.minD = 1,
			this.maxY = 2099,
			this.maxM = 12,
			this.maxD = 31
	}
	MobileCalendar.prototype = {
		init: function(params) {
            this.format = params.format;
			this.trigger = params.trigger;
			if (this.trigger.getAttribute("data-lcalendar") != null) {
				var arr = this.trigger.getAttribute("data-lcalendar").split(',');
				var minArr = arr[0].split('-');
				this.minY = ~~minArr[0];
				this.minM = ~~minArr[1];
				this.minD = ~~minArr[2];
				var maxArr = arr[1].split('-');
				this.maxY = ~~maxArr[0];
				this.maxM = ~~maxArr[1];
				this.maxD = ~~maxArr[2];
			}
			this.bindEvent(this.type);
		},
		bindEvent: function(type) {
			var _self = this;
            //1=yyyy,2=MM,3=dd
            function getDateLevel(format){
                var level = 0;
                if(format == null || format == "") {
                    return level;
                }
                if(format.indexOf("yyyy") != -1) {
                    level = 1;
                }
                if(format.indexOf("MM") != -1) {
                    level = 2;
                }
                if(format.indexOf("dd") != -1) {
                    level = 3;
                }
                return level;
            }
            //1=HH,2=mm,3=ss
            function getTimeLevel(format) {
                var level = 0;
                if(format == null || format == "") {
                    return level;
                }
                if(format.indexOf("HH") != -1) {
                    level = 1;
                }
                if(format.indexOf("mm") != -1) {
                    level = 2;
                }
                if(format.indexOf("ss") != -1) {
                    level = 3;
                }
                return level;
            }
            function getYearView(){
                var html = '<div class="date_yy_id">' +
					'<div class="gear date_yy" data-datetype="date_yy"></div>' +
					'<div class="date_grid">' +
					'<div>年</div>' +
					'</div>' +
                    '</div>';
                return html;
            }
            function getMonthView(){
                var html = '<div class="date_mm_id">' +
					'<div class="gear date_mm" data-datetype="date_mm"></div>' +
					'<div class="date_grid">' +
					'<div>月</div>' +
					'</div>' +
					'</div>';
                return html;
            }
            function getDayView(){
                var html = '<div class="date_dd_id">' +
					'<div class="gear date_dd" data-datetype="date_dd"></div>' +
					'<div class="date_grid">' +
					'<div>日</div>' +
					'</div>' +
					'</div>';
                return html;
            }
            function getHourView(){
                var html = '<div class="time_hh_id">' +
					'<div class="gear time_hh" data-datetype="time_hh"></div>' +
					'<div class="date_grid">' +
					'<div>时</div>' +
					'</div>' +
					'</div>';
                return html;
            }
            function getMinuteView() {
                 var html = '<div class="time_mm_id">' +
					'<div class="gear time_mm" data-datetype="time_mm"></div>' +
					'<div class="date_grid">' +
					'<div>分</div>' +
					'</div>' +
					'</div>';
                return html;
            }
            function getSecondView() {
                 var html = '<div class="time_ss_id">' +
					'<div class="gear time_ss" data-datetype="time_ss"></div>' +
					'<div class="date_grid">' +
					'<div>秒</div>' +
					'</div>' +
					'</div>';
                return html;
            }
            function popupDateView(e) {
                _self.gearDate = document.createElement("div");
				_self.gearDate.className = "gearDate";
				var innerHTML = '<div class="date_ctrl slideInUp">' +
                    '<div class="date_btn_box">' +
					'<div class="date_btn lcalendar_cancel">取消</div>' +
					'<div class="date_btn lcalendar_finish">确定</div>' +
					'</div>';
                 innerHTML += '<div class="date_roll_mask">' +
					'<div class="date_roll">';
                var dateLevel = getDateLevel(_self.format);
                var timeLevel = getTimeLevel(_self.format);
                if(dateLevel == 1) {
                    innerHTML += getYearView();
                } else if(dateLevel == 2) {
                    innerHTML += getYearView() + getMonthView();
                } else if(dateLevel == 3 && timeLevel == 0) {
                     innerHTML += getYearView() + getMonthView() + getDayView();
                } else if(dateLevel == 3 && timeLevel == 1) {
                    innerHTML += getYearView() + getMonthView() + getDayView() + getHourView();
                } else if(dateLevel == 3 && timeLevel == 2) {
                    innerHTML += getYearView() + getMonthView() + getDayView() + getHourView() + getMinuteView();
                } else if(dateLevel == 3 && timeLevel == 3) {
                    innerHTML += getYearView() + getMonthView() + getDayView() + getHourView() + getMinuteView() + getSecondView();
                } else if(dateLevel == 0 && timeLevel == 1) {
                    innerHTML += getHourView();
                } else if(dateLevel == 0 && timeLevel == 2) {
                    innerHTML += getHourView() + getMinuteView();
                } else if(dateLevel == 0 && timeLevel == 3) {
                    innerHTML += getHourView() + getMinuteView() + getSecondView();
                } else {
                    innerHTML += getYearView() + getMonthView() + getDayView();
                }
                innerHTML += '</div></div></div>';
                _self.gearDate.innerHTML = innerHTML;
                document.body.appendChild(_self.gearDate);
                dateTimeCtrlInit();
                var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
				lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
				var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
				lcalendar_finish.addEventListener('touchstart', finishMobileDateTime);
                lcalendar_finish.addEventListener('click', finishMobileDateTime);
                
                var date_yy = _self.gearDate.querySelector(".date_yy_id");
                var date_mm = _self.gearDate.querySelector(".date_mm_id");
                var date_dd = _self.gearDate.querySelector(".date_dd_id");
                var time_hh = _self.gearDate.querySelector(".time_hh_id");
                var time_mm = _self.gearDate.querySelector(".time_mm_id");
                var time_ss = _self.gearDate.querySelector(".time_ss_id");
                if(date_yy) {
                    date_yy.addEventListener('touchstart', gearTouchStart);
				    date_yy.addEventListener('touchmove', gearTouchMove);
				    date_yy.addEventListener('touchend', gearTouchEnd);
                }
                if(date_mm) {
                    date_mm.addEventListener('touchstart', gearTouchStart);
                    date_mm.addEventListener('touchmove', gearTouchMove);
                    date_mm.addEventListener('touchend', gearTouchEnd);
                }
                if(date_dd) {
                    date_dd.addEventListener('touchstart', gearTouchStart);
                    date_dd.addEventListener('touchmove', gearTouchMove);
                    date_dd.addEventListener('touchend', gearTouchEnd);
                }
                if(time_hh) {
                    time_hh.addEventListener('touchstart', gearTouchStart);
                    time_hh.addEventListener('touchmove', gearTouchMove);
                    time_hh.addEventListener('touchend', gearTouchEnd);
                }
                if(time_mm) {
                    time_mm.addEventListener('touchstart', gearTouchStart);
                    time_mm.addEventListener('touchmove', gearTouchMove);
                    time_mm.addEventListener('touchend', gearTouchEnd);
                }
                if(time_ss) {
                    time_ss.addEventListener('touchstart', gearTouchStart);
                    time_ss.addEventListener('touchmove', gearTouchMove);
                    time_ss.addEventListener('touchend', gearTouchEnd);
                }
              
            }
			//初始化年月日时分插件默认值
			function dateTimeCtrlInit() {
				var date = new Date();
                //default date value
                var dateValue = _self.trigger.value;
                if(dateValue) {
                    date = parseDate(dateValue, _self.format);
                }
				var dateArr = {
					yy: date.getYear(),
					mm: date.getMonth(),
					dd: date.getDate() - 1,
					hh: date.getHours(),
					mi: date.getMinutes(),
                    ss: date.getSeconds()
				};
				if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}$/.test(_self.trigger.value)) {
					rs = _self.trigger.value.match(/(^|-|\s|:)\d{1,4}/g);
					dateArr.yy = rs[0] - _self.minY;
					dateArr.mm = rs[1].replace(/-/g, "") - 1;
					dateArr.dd = rs[2].replace(/-/g, "") - 1;
					dateArr.hh = parseInt(rs[3].replace(/\s0?/g, ""));
					dateArr.mi = parseInt(rs[4].replace(/:0?/g, ""));
				} else {
					dateArr.yy = dateArr.yy + 1900 - _self.minY;
				}
                
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var date_mm = _self.gearDate.querySelector(".date_mm");
                var date_dd = _self.gearDate.querySelector(".date_dd");
                var time_hh = _self.gearDate.querySelector(".time_hh");
                var time_mm = _self.gearDate.querySelector(".time_mm");
                var time_ss = _self.gearDate.querySelector(".time_ss");
                if(date_yy) {
                    date_yy.setAttribute("val", dateArr.yy);
                }
                if(date_mm) {
                    date_mm.setAttribute("val", dateArr.mm);
                }
                if(date_dd) {
                    date_dd.setAttribute("val", dateArr.dd);
                }
                setDateGearTooth();
                
                if(time_hh) {
                    time_hh.setAttribute("val", dateArr.hh);
                }
                if(time_mm) {
                    time_mm.setAttribute("val", dateArr.mi);
                }
                if(time_ss) {
                    time_ss.setAttribute("val", dateArr.ss);
                }
				setTimeGearTooth();
			}
            function parseDate(value, pattern) {
		        var mask = "",
		            temp = "",
		            dateString = "",
		            monthString = "",
		            yearString = "",
		            hourString = "",
		            minuteString = "",
		            secondString = "";
				var j = 0;
				var n = pattern.length;
				for (var i = 0; i < n; i++,j++){
					temp = "" + value.charAt(j);
					mask = "" + pattern.charAt(i);
					
					if (mask == "M"){
						if (isNaN(parseInt(temp)) || temp == " ")
							j--;
						else
							monthString += temp;
					} else if (mask == "d") {
						if (isNaN(parseInt(temp)) || temp == " ")
							j--;
						else
							dateString += temp;
					} else if (mask == "y") {
						yearString += temp;
					} else if(mask=="H") {
						if (isNaN(parseInt(temp)) || temp == " ")
							j--;
						else
							hourString += temp;
					} else if(mask=="m") {
						if (isNaN(parseInt(temp)) || temp == " ")
							j--;
						else
							minuteString += temp;
					} else if(mask=="s") {
						if (isNaN(parseInt(temp)) || temp == " ")
							j--;
						else
							secondString += temp;
					} else if (!isNaN(parseInt(temp)) && temp != " ") {
						return null;
					}
				}
				
				temp = "" + value.charAt(pattern.length - i + j);
				if (!(temp == "") && (temp != " ")) {
					return null;
				}
				
				var monthNum = (monthString == "") ? 0 : parseInt(monthString) - 1;
				var dayNum = (dateString== "") ? 1 : parseInt(dateString);
				var yearNum = parseInt(yearString);
				var hourNum = (hourString == "") ? 0 : parseInt(hourString);
				var minuteNum = (minuteString == "") ? 0 : parseInt(minuteString);
				var secondNum = (secondString == "") ? 0 : parseInt(secondString);
				
				if(isNaN(yearNum)) {
					return null;
				}
				
				if (yearString.length == 2) {
					yearNum+=2000;
				}
				return new Date(yearNum, monthNum, dayNum,hourNum,minuteNum,secondNum);
		    }
			
			//重置日期节点个数
			function setDateGearTooth() {
				var passY = _self.maxY - _self.minY + 1;
				var date_yy = _self.gearDate.querySelector(".date_yy");
				var itemStr = "";
				if (date_yy && date_yy.getAttribute("val")) {
					//得到年份的值
					var yyVal = parseInt(date_yy.getAttribute("val"));
					//p 当前节点前后需要展示的节点个数
					for (var p = 0; p <= passY - 1; p++) {
						itemStr += "<div class='tooth'>" + (_self.minY + p) + "</div>";
					}
					date_yy.innerHTML = itemStr;
					var top = Math.floor(parseFloat(date_yy.getAttribute('top')));
					if (!isNaN(top)) {
						top % 2 == 0 ? (top = top) : (top = top + 1);
						top > 8 && (top = 8);
						var minTop = 8 - (passY - 1) * 2;
						top < minTop && (top = minTop);
						date_yy.style["-webkit-transform"] = 'translate3d(0,' + top + 'em,0)';
						date_yy.setAttribute('top', top + 'em');
						yyVal = Math.abs(top - 8) / 2;
						date_yy.setAttribute("val", yyVal);
					} else {
						date_yy.style["-webkit-transform"] = 'translate3d(0,' + (8 - yyVal * 2) + 'em,0)';
						date_yy.setAttribute('top', 8 - yyVal * 2 + 'em');
					}
				} else {
					return;
				}
				var date_mm = _self.gearDate.querySelector(".date_mm");
				if (date_mm && date_mm.getAttribute("val")) {
					itemStr = "";
					//得到月份的值
					var mmVal = parseInt(date_mm.getAttribute("val"));
					var maxM = 11;
					var minM = 0;
					//当年份到达最大值
					if (yyVal == passY - 1) {
						maxM = _self.maxM - 1;
					}
					//当年份到达最小值
					if (yyVal == 0) {
						minM = _self.minM - 1;
					}
					//p 当前节点前后需要展示的节点个数
					for (var p = 0; p < maxM - minM + 1; p++) {
						itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
					}
					date_mm.innerHTML = itemStr;
					if (mmVal > maxM) {
						mmVal = maxM;
						date_mm.setAttribute("val", mmVal);
					} else if (mmVal < minM) {
						mmVal = maxM;
						date_mm.setAttribute("val", mmVal);
					}
					date_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - (mmVal - minM) * 2) + 'em,0)';
					date_mm.setAttribute('top', 8 - (mmVal - minM) * 2 + 'em');
				} else {
					return;
				}
				var date_dd = _self.gearDate.querySelector(".date_dd");
				if (date_dd && date_dd.getAttribute("val")) {
					itemStr = "";
					//得到日期的值
					var ddVal = parseInt(date_dd.getAttribute("val"));
					//返回月份的天数
					var maxMonthDays = calcDays(yyVal, mmVal);
					//p 当前节点前后需要展示的节点个数
					var maxD = maxMonthDays - 1;
					var minD = 0;
					//当年份月份到达最大值
					if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
						maxD = _self.maxD - 1;
					}
					//当年、月到达最小值
					if (yyVal == 0 && _self.minM == mmVal + 1) {
						minD = _self.minD - 1;
					}
					for (var p = 0; p < maxD - minD + 1; p++) {
						itemStr += "<div class='tooth'>" + (minD + p + 1) + "</div>";
					}
					date_dd.innerHTML = itemStr;
					if (ddVal > maxD) {
						ddVal = maxD;
						date_dd.setAttribute("val", ddVal);
					} else if (ddVal < minD) {
						ddVal = minD;
						date_dd.setAttribute("val", ddVal);
					}
					date_dd.style["-webkit-transform"] = 'translate3d(0,' + (8 - (ddVal - minD) * 2) + 'em,0)';
					date_dd.setAttribute('top', 8 - (ddVal - minD) * 2 + 'em');
				} else {
					return;
				}
			}
			function setTimeGearTooth() {
				var time_hh = _self.gearDate.querySelector(".time_hh");
				if (time_hh && time_hh.getAttribute("val")) {
					var i = "";
					var hhVal = parseInt(time_hh.getAttribute("val"));
					for (var g = 0; g <= 23; g++) {
						i += "<div class='tooth'>" + g + "</div>";
					}
					time_hh.innerHTML = i;
					time_hh.style["-webkit-transform"] = 'translate3d(0,' + (8 - hhVal * 2) + 'em,0)';
					time_hh.setAttribute('top', 8 - hhVal * 2 + 'em');
				} else {
					return
				}
				var time_mm = _self.gearDate.querySelector(".time_mm");
				if (time_mm && time_mm.getAttribute("val")) {
					var i = "";
					var mmVal = parseInt(time_mm.getAttribute("val"));
					for (var g = 0; g <= 59; g++) {
						i += "<div class='tooth'>" + g + "</div>";
					}
					time_mm.innerHTML = i;
					time_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - mmVal * 2) + 'em,0)';
					time_mm.setAttribute('top', 8 - mmVal * 2 + 'em');
				} else {
					return
				}
				
				var time_ss = _self.gearDate.querySelector(".time_ss");
				if (time_ss && time_ss.getAttribute("val")) {
					var i = "";
					var mmVal = parseInt(time_ss.getAttribute("val"));
					for (var g = 0; g <= 59; g++) {
						i += "<div class='tooth'>" + g + "</div>";
					}
					time_ss.innerHTML = i;
					time_ss.style["-webkit-transform"] = 'translate3d(0,' + (8 - mmVal * 2) + 'em,0)';
					time_ss.setAttribute('top', 8 - mmVal * 2 + 'em');
				} else {
					return
				}
			}
			function calcDays(year, month) {
				if (month == 1) {
					year += _self.minY;
					if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 4000 != 0)) {
						return 29;
					} else {
						return 28;
					}
				} else {
					if (month == 3 || month == 5 || month == 8 || month == 10) {
						return 30;
					} else {
						return 31;
					}
				}
			}
			function gearTouchStart(e) {
				e.preventDefault();
				var target = e.target;
				while (true) {
					if (!target.classList.contains("gear")) {
						target = target.parentElement;
					} else {
						break
					}
				}
				clearInterval(target["int_" + target.id]);
				target["old_" + target.id] = e.targetTouches[0].screenY;
				target["o_t_" + target.id] = (new Date()).getTime();
				var top = target.getAttribute('top');
				if (top) {
					target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
				} else {
					target["o_d_" + target.id] = 0;
				}
			}
			function gearTouchMove(e) {
				e.preventDefault();
				var target = e.target;
				while (true) {
					if (!target.classList.contains("gear")) {
						target = target.parentElement;
					} else {
						break
					}
				}
				target["new_" + target.id] = e.targetTouches[0].screenY;
				target["n_t_" + target.id] = (new Date()).getTime();
				//var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / target.clientHeight;
				var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / 370;
				target["pos_" + target.id] = target["o_d_" + target.id] + f;
				target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
				target.setAttribute('top', target["pos_" + target.id] + 'em');
			}
			function gearTouchEnd(e) {
				e.preventDefault();
				var target = e.target;
				while (true) {
					if (!target.classList.contains("gear")) {
						target = target.parentElement;
					} else {
						break;
					}
				}
				var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
				if (Math.abs(flag) <= 0.2) {
					target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
				} else {
					if (Math.abs(flag) <= 0.5) {
						target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
					} else {
						target["spd_" + target.id] = flag / 2;
					}
				}
				if (!target["pos_" + target.id]) {
					target["pos_" + target.id] = 0;
				}
				rollGear(target);
			}
			//缓动效果
			function rollGear(target) {
				var d = 0;
				var stopGear = false;
				var passY = _self.maxY - _self.minY + 1;
				clearInterval(target["int_" + target.id]);
				target["int_" + target.id] = setInterval(function() {
					var pos = target["pos_" + target.id];
					var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
					pos += speed;
					if (Math.abs(speed) > 0.1) {} else {
						speed = 0.1;
						var b = Math.round(pos / 2) * 2;
						if (Math.abs(pos - b) < 0.02) {
							stopGear = true;
						} else {
							if (pos > b) {
								pos -= speed
							} else {
								pos += speed
							}
						}
					}
					if (pos > 8) {
						pos = 8;
						stopGear = true;
					}
					switch (target.dataset.datetype) {
						case "date_yy":
							var minTop = 8 - (passY - 1) * 2;
							if (pos < minTop) {
								pos = minTop;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "date_mm":
							var date_yy = _self.gearDate.querySelector(".date_yy");
							//得到年份的值
							var yyVal = parseInt(date_yy.getAttribute("val"));
							var maxM = 11;
							var minM = 0;
							//当年份到达最大值
							if (yyVal == passY - 1) {
								maxM = _self.maxM - 1;
							}
							//当年份到达最小值
							if (yyVal == 0) {
								minM = _self.minM - 1;
							}
							var minTop = 8 - (maxM - minM) * 2;
							if (pos < minTop) {
								pos = minTop;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2 + minM;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "date_dd":
							var date_yy = _self.gearDate.querySelector(".date_yy");
							var date_mm = _self.gearDate.querySelector(".date_mm");
							//得到年份的值
							var yyVal = parseInt(date_yy.getAttribute("val"));
							//得到月份的值
							var mmVal = parseInt(date_mm.getAttribute("val"));
							//返回月份的天数
							var maxMonthDays = calcDays(yyVal, mmVal);
							var maxD = maxMonthDays - 1;
							var minD = 0;
							//当年份月份到达最大值
							if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
								maxD = _self.maxD - 1;
							}
							//当年、月到达最小值
							if (yyVal == 0 && _self.minM == mmVal + 1) {
								minD = _self.minD - 1;
							}
							var minTop = 8 - (maxD - minD) * 2;
							if (pos < minTop) {
								pos = minTop;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2 + minD;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "time_hh":
							if (pos < -38) {
								pos = -38;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "time_mm":
							if (pos < -110) {
								pos = -110;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "time_ss":
							if (pos < -110) {
								pos = -110;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 8) / 2;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						default:
					}
					target["pos_" + target.id] = pos;
					target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
					target.setAttribute('top', pos + 'em');
					d++;
				}, 30);
			}
			function setGear(target, val) {
				val = Math.round(val);
				target.setAttribute("val", val);
				if (/date/.test(target.dataset.datetype)) {
					setDateGearTooth();
				} else {
					setTimeGearTooth();
				}
			}
			function closeMobileCalendar(e) {
				e.preventDefault();
				var evt = new CustomEvent('input');
				_self.trigger.dispatchEvent(evt);
				document.body.removeChild(_self.gearDate);
			}
			function finishMobileDate(e) {
				var passY = _self.maxY - _self.minY + 1;
				var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
				var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
				date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
				var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
				date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
				_self.trigger.value = (date_yy % passY + _self.minY) + "-" + date_mm + "-" + date_dd;
				$(_self.trigger).trigger("change");
				closeMobileCalendar(e);
			}
			function finishMobileDateTime(e) {
				var passY = _self.maxY - _self.minY + 1;
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var date_mm = _self.gearDate.querySelector(".date_mm");
                var date_dd = _self.gearDate.querySelector(".date_dd");
                var time_hh = _self.gearDate.querySelector(".time_hh");
                var time_mm = _self.gearDate.querySelector(".time_mm");
                var time_ss = _self.gearDate.querySelector(".time_ss"); 
                var yy = 0,mm = 0,dd = 0,hh = 0, mi = 0, ss = 0;
                if(date_yy) {
                    yy = parseInt(Math.round(date_yy.getAttribute("val")));
                }
                if(date_mm) {
                    mm = parseInt(Math.round(date_mm.getAttribute("val"))) + 1;
                    mm = mm > 9 ? mm : '0' + mm;
                }
                if(date_dd) {
                    dd = parseInt(Math.round(date_dd.getAttribute("val"))) + 1;
                    dd = dd > 9 ? dd : '0' + dd;
                }
                if(time_hh) {
                    hh = parseInt(Math.round(time_hh.getAttribute("val")));
                    hh = hh > 9 ? hh : '0' + hh;
                }
                if(time_mm) {
                    mi = parseInt(Math.round(time_mm.getAttribute("val")));
                    mi = mi > 9 ? mi : '0' + mi;
                    
                }
                if(time_ss) {
                    ss = parseInt(Math.round(time_ss.getAttribute("val")));
                    ss = ss > 9 ? ss : '0' + ss;
                }
                
                var dateFormat = _self.format;
                if(dateFormat) {
                    var dateValue = dateFormat.replace("yyyy", (yy % passY + _self.minY)).replace("MM", mm).replace("dd", dd).replace("HH", hh).replace("mm", mi).replace("ss", ss);
                    _self.trigger.value = dateValue;
                } else {
                    _self.trigger.value = (yy % passY + _self.minY) + "-" + mm + "-" + dd;
                }
                $(_self.trigger).trigger("change");
                closeMobileCalendar(e);
			}
			function finishMobileTime(e) {
				var time_hh = parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));
				time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
				var time_mm = parseInt(Math.round(_self.gearDate.querySelector(".time_mm").getAttribute("val")));
				time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
				
				var time_ss = parseInt(Math.round(_self.gearDate.querySelector(".time_ss").getAttribute("val")));
				time_ss = time_ss > 9 ? time_ss : '0' + time_ss;
				
				
				_self.trigger.value = (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm+ (time_ss.length < 2 ? ":0" : ":") + time_ss;
				$(_self.trigger).trigger("change");
				closeMobileCalendar(e);
			}
			_self.trigger.addEventListener('click', function(e){
                popupDateView(e);
            });
		}
	}
	return MobileCalendar;
})()