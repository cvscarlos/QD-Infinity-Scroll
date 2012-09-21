$(function(){
	$(".prateleira").coresPrateleira();
	$(document).ajaxStop(function(){ $(".prateleira").coresPrateleira(); });
});