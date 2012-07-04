// Inicialização
$(function(){
	/* Carrinho Inteligente [INI] */
	$("#topBar").prepend('\
		<div class="vtexsc-cart">\
			<div class="vtexsc-bt"></div>\
			<div class="vtexsc-center">\
				<div class="vtexsc-arrowTop"></div>\
				<div class="vtexsc-wrap"><table class="vtexsc-productList"></table></div>\
				<div class="vtexsc-arrowBottom"></div>\
				<div class="cartFooter clearfix">\
					<div class="cartTotal">Total <span class="vtexsc-totalCart"></span></div>\
					<a href="/Site/Endereco.aspx?FinalizaCompra=1" class="cartCheckout"></a>\
					<a href="/Site/Carrinho.aspx" class="viewCart"></a>\
				</div>\
			</div>\
			<div class="vtexsc-bb"></div>\
		</div>\
	');
	$("a.linkCart").addClass("vtexsc-showCart");
	var btn=$(".buy-button");
	btn.wrap('<div class="vtexsc-wrapBtn"></div>');
	btn.after('<div class="vtexsc-buttonOverlay"></div>');
	var scOptions={htmlFormat:2, qttText:"", textRemove:"", textMoreOne:"", textMinusOne:""};
	btn.smartCart(scOptions);
	$(".btn-add-buy-button-asynchronous").smartCart(scOptions).after('<div class="vtexsc-buttonOverlay"></div>');
	/* Carrinho Inteligente [FIM] */
	
	var floatingBar=$(".floatingTopBar");
	var smartCart=$(".vtexsc-cart");
	$(window).bind("scroll",function(){
		var $this=$(this);
		if($this.scrollTop()>140)
		{
			floatingBar.fadeTo(300,1);
			smartCart.addClass("floatingCart").css("left",(floatingBar.find(".cartInfo").offset().left-296));
		}
		else
		{
			floatingBar.stop(true).fadeTo(200,0,function(){floatingBar.hide();});
			smartCart.removeClass("floatingCart").css("left","auto");
		}
	});
});