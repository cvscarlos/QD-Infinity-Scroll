/**
* Countdown.js < http://countdownjs.org/ >
* @license MIT
*/
var module,countdown=function(l){function m(a,b){var c=a.getTime();a.setUTCMonth(a.getUTCMonth()+b);return o((a.getTime()-c)/864E5)}function g(a,b,c){return a+" "+(a===1?b:c)}function i(){}function n(a,b,c,e){a.start=b;a.end=c;a.units=e;a.value=c.getTime()-b.getTime();if(a.value<0)var d=c,c=b,b=d;a.refMonth=new Date(b.getFullYear(),b.getMonth(),15);try{a.millennia=0;a.centuries=0;a.decades=0;a.years=c.getUTCFullYear()-b.getUTCFullYear();a.months=c.getUTCMonth()-b.getUTCMonth();a.weeks=0;a.days=c.getUTCDate()- b.getUTCDate();a.hours=c.getUTCHours()-b.getUTCHours();a.minutes=c.getUTCMinutes()-b.getUTCMinutes();a.seconds=c.getUTCSeconds()-b.getUTCSeconds();a.milliseconds=c.getUTCMilliseconds()-b.getUTCMilliseconds();var f;a.milliseconds<0?(f=j(-a.milliseconds/1E3),a.seconds-=f,a.milliseconds+=f*1E3):a.milliseconds>=1E3&&(a.seconds+=h(a.milliseconds/1E3),a.milliseconds%=1E3);a.seconds<0?(f=j(-a.seconds/60),a.minutes-=f,a.seconds+=f*60):a.seconds>=60&&(a.minutes+=h(a.seconds/60),a.seconds%=60);a.minutes<0? (f=j(-a.minutes/60),a.hours-=f,a.minutes+=f*60):a.minutes>=60&&(a.hours+=h(a.minutes/60),a.minutes%=60);a.hours<0?(f=j(-a.hours/24),a.days-=f,a.hours+=f*24):a.hours>=24&&(a.days+=h(a.hours/24),a.hours%=24);a.days<0&&(f=j(-a.days/28),a.months-=f,a.days+=m(a.refMonth,f));a.days>=7&&(a.weeks+=h(a.days/7),a.days%=7);a.months<0?(f=j(-a.months/12),a.years-=f,a.months+=f*12):a.months>=12&&(a.years+=h(a.months/12),a.months%=12);a.years>=10&&(a.decades+=h(a.years/10),a.years%=10,a.decades>=10&&(a.centuries+= h(a.decades/10),a.decades%=10,a.centuries>=10&&(a.millennia+=h(a.centuries/10),a.centuries%=10)));e&1024||(a.centuries+=a.millennia*10,delete a.millennia);e&512||(a.decades+=a.centuries*10,delete a.centuries);e&256||(a.years+=a.decades*10,delete a.decades);e&128||(a.months+=a.years*12,delete a.years);!(e&64)&&a.months&&(a.days+=m(a.refMonth,a.months),delete a.months,a.days>=7&&(a.weeks+=h(a.days/7),a.days%=7));e&32||(a.days+=a.weeks*7,delete a.weeks);e&16||(a.hours+=a.days*24,delete a.days);e&8|| (a.minutes+=a.hours*60,delete a.hours);e&4||(a.seconds+=a.minutes*60,delete a.minutes);e&2||(a.milliseconds+=a.seconds*1E3,delete a.seconds);e&1||delete a.milliseconds}finally{delete a.refMonth}return a}function d(a,b,c){var e,c=c||222;"function"===typeof a?(e=a,a=null):a instanceof Date||(a=a!==null&&isFinite(a)?new Date(a):null);"function"===typeof b?(e=b,b=null):b instanceof Date||(b=b!==null&&isFinite(b)?new Date(b):null);if(!a&&!b)return new i;if(!e)return n(new i,a||new Date,b||new Date,c); var d;d=c&1?1E3/30:c&2?1E3:c&4?6E4:c&8?36E5:c&16?864E5:6048E5;var f=function(){e(n(new i,a||new Date,b||new Date,c))};f();return setInterval(f,d)}var j=Math.ceil,h=Math.floor,o=Math.round,k;i.prototype.toString=function(a){var b=k(this);b.length>a&&(b=b.slice(0,a));a=b.length;if(!a)return"";a>1&&(b[a-1]="and "+b[a-1]);return b.join(", ")};i.prototype.toHTML=function(a,b){var a=a||"span",c=k(this);c.length>b&&(c=c.slice(0,b));var e=c.length;if(!e)return"";for(var d=0;d<e;d++)c[d]="<"+a+">"+c[d]+"</"+ a+">";--e&&(c[e]="and "+c[e]);return c.join(", ")};i.prototype.toShort=function(a){var b=k(this),a=a>0?a:1;b.length>a&&(b=b.slice(0,a));a=b.length;if(!a)return"";a>1&&(b[a-1]="and "+b[a-1]);return b.join(", ")};k=function(a){var b=[];a.millennia&&b.push(g(a.millennia,"millennium","millennia"));a.centuries&&b.push(g(a.centuries,"century","centuries"));a.decades&&b.push(g(a.decades,"decade","decades"));a.years&&b.push(g(a.years,"year","years"));a.months&&b.push(g(a.months,"month","months"));a.weeks&& b.push(g(a.weeks,"week","weeks"));a.days&&b.push(g(a.days,"day","days"));a.hours&&b.push(g(a.hours,"hour","hours"));a.minutes&&b.push(g(a.minutes,"minute","minutes"));a.seconds&&b.push(g(a.seconds,"second","seconds"));a.milliseconds&&b.push(g(a.milliseconds,"millisecond","milliseconds"));return b};d.MILLISECONDS=1;d.SECONDS=2;d.MINUTES=4;d.HOURS=8;d.DAYS=16;d.WEEKS=32;d.MONTHS=64;d.YEARS=128;d.DECADES=256;d.CENTURIES=512;d.MILLENNIA=1024;d.DEFAULTS=222;d.ALL=2047;if(l&&l.exports)l.exports=d;return d}(module);

/**
* Vtex CountDown
* @author Carlos Vinicius
* @version 1.1
* @date 2011-02-28
*/
if("function"!==typeof(String.prototype.trim))String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};
jQuery.fn.vtexCountdown=function(opts)
{
    var defaults=
	{
		element:"p[class*=|]",
		separator:"|",
		dateSeparator:"/",
		hourSeparator:":",
		outputFormat:1, // [1] Dias, hrs, min., seg. - [2] hrs, min., seg.
		htmlFormat:'<span class="hours">%hours% <span class="vtex-cd_p">horas</span><span class="vtex-cd_s">hora</span> </span><span class="minutes">%minutes% <span class="vtex-cd_p">minutos</span><span class="vtex-cd_s">minuto</span> </span><span class="seconds">%seconds% <span class="vtex-cd_p">segundos</span><span class="vtex-cd_s">segundo</span> </span>',
		updatInterval:1000,
		callback:function(){},
		updateCallback:function(){},
		removeDateText:true
	};
    var options=jQuery.extend(defaults, opts);
	var $this=$(this);
	var elem=jQuery(options.element).first();
	var _console="object"==typeof(console);
	
	// Reporting Errors
	if(elem.length<1){if(_console) console.log("[Erro] Elemento com o nome da promoção não encontrado \n ("+elem.selector+")"); return $this;}

	var promoText=elem.text()||"";
	// Reporting Errors
	if(promoText.indexOf(options.separator)<0){if(_console) console.log("[Erro] Separador “"+options.separator+"” não encontrado."); return $this;}
	
	// Get Date / Hour
	var promoDateText=promoText.split(options.separator).pop().trim();
	var promoTimeStamp=promoDateText.split(" ");
	var promoDate=(promoTimeStamp[0]||"").split(options.dateSeparator);
	var promoHour=(promoTimeStamp[1]||"").split(options.hourSeparator);
	var finalDate=new Date(promoDate[2],(promoDate[1]-1),promoDate[0],promoHour[0],promoHour[1]);
	// Reporting Errors
	if(promoDate.length<3 || promoHour.length<2 || isNaN(finalDate.getTime())){if(_console) console.log("[Erro] Data Inválida “"+promoDateText+"”, \n utilize o padrão: DD/MM/AAAA HH:MM"); return $this;}
	
	var currentDate=new Date();
	var days,hours,minutes,seconds="";
	var daysElem,hoursElem,minutesElem,secondsElem=jQuery("");
	var daysElemP,hoursElemP,minutesElemP,secondsElemP=jQuery("");
	var daysElemS,hoursElemS,minutesElemS,secondsElemS=jQuery("");
	var updateIntreval=0;
	var k=0;
	var milliseconds=0;
	
	var functions=
	{
		removeDateText:function()
		{
			if(options.removeDateText)
				elem.text(elem.text().replace(options.separator+promoDateText,""));
		},
		getTimeRemaining:function()
		{
			currentDate.setMilliseconds(currentDate.getMilliseconds()+options.updatInterval);
			var cd=countdown(finalDate,currentDate);
			days=cd.days;
			hours=cd.hours;
			minutes=cd.minutes;
			seconds=cd.seconds;
			if(options.outputFormat==2)
			{
				hours=24*days+hours;
				days="";
			}
			
			functions.updateHtml();
		},
		toDate:function(dotNetDate)
		{
			var monthsList={jan:0,fev:1,mar:2,abr:3,mai:4,jun:5,jul:6,ago:7,set:8,out:9,nov:10,dez:11};
			var dateArray=dotNetDate
				.replace(/[a-z]{3}/,function(a){return monthsList[a]||"";})
				.replace(",","").split(" ");
			var horary=dateArray[3].split(":");
			currentDate=new Date(dateArray[2],dateArray[0],dateArray[1],horary[0],horary[1],horary[2]);
			// Reporting Errors
			if(isNaN(currentDate.getTime()))
			{
				if(_console) console.log("Erro ao processar a data retornada via Ajax \n “"+dotNetDate+"”");
				currentDate=new Date();
			}
		},
		updateHtml:function()
		{
			secondsElem.text(seconds);
			minutesElem.text(minutes);
			hoursElem.text(hours);
			daysElem.text(days);
			
			if(seconds==1)
			{
				secondsElemP.hide();
				secondsElemS.show();
			}
			else
			{
				secondsElemS.hide();
				secondsElemP.show();
			}
			if(minutes==1)
			{
				minutesElemP.hide();
				minutesElemS.show();
			}
			else
			{
				minutesElemS.hide();
				minutesElemP.show();
			}
			if(hours==1)
			{
				hoursElemP.hide();
				hoursElemS.show();
			}
			else
			{
				hoursElemS.hide();
				hoursElemP.show();
			}
			if(days==1)
			{
				daysElemP.hide();
				daysElemS.show();
			}
			else
			{
				daysElemS.hide();
				daysElemP.show();
			}

			if(k==0)
			{
				$this.removeClass("vtex-cd_loading");
				functions.updateCounter();
				options.callback();
			}
			else
				options.updateCallback();
				
			k++;
		},
		formatHtml:function()
		{
			var html=options.htmlFormat
				.replace("%days%",'<span class="vtex-cd_days"></span>')
				.replace("%hours%",'<span class="vtex-cd_hours"></span>')
				.replace("%minutes%",'<span class="vtex-cd_minutes"></span>')
				.replace("%seconds%",'<span class="vtex-cd_seconds"></span>');
			var jHtml=jQuery(html);

			daysElem=jHtml.find(".vtex-cd_days");
			hoursElem=jHtml.find(".vtex-cd_hours");
			minutesElem=jHtml.find(".vtex-cd_minutes");
			secondsElem=jHtml.find(".vtex-cd_seconds");
			daysElemP=daysElem.siblings(".vtex-cd_p");
			hoursElemP=hoursElem.siblings(".vtex-cd_p");
			minutesElemP=minutesElem.siblings(".vtex-cd_p");
			secondsElemP=secondsElem.siblings(".vtex-cd_p");
			daysElemS=daysElem.siblings(".vtex-cd_s");
			hoursElemS=hoursElem.siblings(".vtex-cd_s");
			minutesElemS=minutesElem.siblings(".vtex-cd_s");
			secondsElemS=secondsElem.siblings(".vtex-cd_s");
			
			$this.addClass("vtex-cd_loading").append(jHtml);
		},
		updateCounter:function()
		{
			updateIntreval=setInterval(functions.getTimeRemaining,options.updatInterval);
		}
	};
	
	$.ajax({
		"url":"/no-cache/HoraAtualServidor.aspx",
		"data":"html",
		"success":function(data, textStatus, jqXHR)
		{
			functions.toDate(data.toLowerCase().trim());
			functions.getTimeRemaining();
		},
		"error":function(jqXHR, textStatus, errorThrown)
		{
			if(_console) console.log("Erro na requisição Ajax");
			functions.getTimeRemaining();
		}
	});
	
	functions.removeDateText();
	functions.formatHtml();
};