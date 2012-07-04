/**
* Vtex Smart Cart
* @author Carlos Vinicius
* @version 1.1
* @date 2011-03-06
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});

var vtexscCartHideTimeOut=0;
jQuery.fn.smartCart=function(opts)
{
    var defaults=
	{
		method:1,
		htmlFormat:1, // 1 = UL, 2= Tabela
		cartElem:".vtexsc-cart",
		listElem:".vtexsc-productList",
		scrollTop:".vtexsc-arrowTop",
		scrollDown:".vtexsc-arrowBottom",
		bntOverlayElem:".vtexsc-buttonOverlay",
		errorElem:".vtexsc-error",
		successElem:".vtexsc-success",
		showCartBtn:".vtexsc-showCart",
		totalCart:".vtexsc-totalCart",
		qttText:"Quantidade ",
		textRemove:"remover",
		textMoreOne:" Mais 1 ",
		textMinusOne:" Menos 1 ",
		ajaxErroMsg:"Houve um erro ao tentar adicionar/alterar seu produto no carrinho.",
		changeQttError:"Provavelmente esta alteração não obteve êxito!",
		callback:function(){},
		ajaxCallback:function(){},
		succesShow:function(elem)
		{
			elem.show();
		},
		cartShow:function(elem)
		{
			elem.slideDown();
		},
		cartHide:function(elem, hideFunction)
		{
			clearTimeout(vtexscCartHideTimeOut);
			vtexscCartHideTimeOut=setTimeout(function(){
				hideFunction(elem);
			},5500);
		},
		resetNewItem:function(elem)
		{
			setTimeout(function(){
				elem.removeClass("vtexsc-newItem");
			},2500);
		}
	};
    var options=jQuery.extend(defaults, opts),
		$this=jQuery(this),
		$empty=jQuery(""),
		_console="object"===typeof(console),
		cartE=jQuery(options.cartElem);
	
	// Reportando erros
	if($this.length<1) return false;
	if(cartE.length<1){if(_console) console.log("[Erro] Elemento do carrinho não encontrado \n ("+cartE.selector+")"); return false;}

	var listE=jQuery(options.listElem);
	// Reportando erros
	if(listE.length<1){if(_console) console.log("[Erro] Lista de produtos não encontrada \n ("+listE.selector+")"); return false;}

	var errorE=jQuery(options.errorElem)||$empty,
		successE=jQuery(options.successElem)||$empty,
		showCartBtnE=jQuery(options.showCartBtn)||$empty,
		currentQtt={},
		scrollDownE=jQuery(options.scrollDown)||$empty,
		scrollTopE=jQuery(options.scrollTop)||$empty,
		totalCartE=jQuery(options.totalCart)||$empty,
		cartText=jQuery("<span class='vtexsc-text'></span>"),
		cartOverlay=jQuery("<div class='vtexsc-overlay'></div>");
	
	totalCartE.append(cartText).append(cartOverlay);
	totalCartE=cartText;
	
	var fns=
	{
		buyButtons:function()
		{
			$this.each(function(){
				var bnt=jQuery(this);
				bnt.bind("click",function(){
					var sku=(bnt.attr("href")||"").split("idSku=")[1]||"";
					if(sku!=="")
						fns.skuToCart(bnt,sku);
					else
						if(_console) console.log("[Erro] O Sku não foi obtido! A execução parou"); 
					return false;
				});
			});
		},
		skuToCart:function(buyButton,sku,quantity)
		{
			var qtt=quantity||1;
			
			//Reportando erro
			if(isNaN(parseInt(sku))){if(_console) console.log("[Erro] O SKU não é um número: “"+sku+"”"); return false;}
			if(isNaN(parseInt(qtt))){if(_console) console.log("[Erro] A quantidade deve ser numérica: “"+qtt+"”"); return false;}
			
			var bntOverlayE=buyButton.siblings(options.bntOverlayElem).show();

			jQuery.ajax({
				url:"/Site/Carrinho.aspx?idSku="+sku+"&quantidade="+qtt,
				success:function(data){fns.skuToCartAjaxSuccess(bntOverlayE,sku,data); fns.updateCart();},
				error:function(){fns.skuToCartAjaxError(bntOverlayE);}
			});
		},
		loadCart:function(forceLoad)
		{
			if((forceLoad||false) || !cartE.hasClass("preLoaded"))
				jQuery.ajax({
					url:"/Site/Carrinho.aspx",
					success:function(data)
					{
						fns.skuToCartAjaxSuccess($empty,0,data,false);
						cartE.addClass("preLoaded");
						fns.scrollAction();
					},
					error:function(){fns.skuToCartAjaxError($empty);}
				});
		},
		skuToCartAjaxSuccess:function(bntOverlayE,sku,data,showCart)
		{
			bntOverlayE.hide();

			if(data.indexOf("Ocorreu um erro")>-1) return fns.skuToCartAjaxError();
			
			var $data=jQuery(data);
			options.succesShow(successE);
			switch(options.htmlFormat)
			{
				case 1:
					fns.formatCartItens($data,sku);
				break;
				case 2:
					fns.formatCartItens2($data,sku);
				break;
			}
			if("undefined"!==typeof showCart?showCart:true)fns.displayCart();
			options.ajaxCallback();
		},
		skuToCartAjaxError:function(overlayElem)
		{
			overlayElem.hide();
			if(_console) console.log("[Erro] A requisição Ajax para adicionar/alterar o SKU no carrinho \n não obteve a resposta esperada. \n Foi retornado um texto contendo o termo “Ocorreu um erro”.");
			alert(options.ajaxErroMsg);
			return false;
		},
		formatCartItens:function($data,sku)
		{
			var cartTable=$data.find(".carrinhoTable");
			var i=0;
			if(cartTable.length<1) return false;

			cartTable.find("tbody tr").each(function(){
				var li=jQuery("<li></li>");
				var tr=jQuery(this);
				
				// Imagem
				var wrap=jQuery('<div class="cartSkuImage"></div>');
				tr.find(".sku-imagem").appendTo(wrap);
				wrap.appendTo(li);
				// Informações
				var wrap=jQuery('<div class="cartSkuInfo"></div>');
				var qttInput=tr.find(".boxQuantidade");
				var currentSku=qttInput.attr("title")||"";
				currentQtt=parseInt(qttInput.val());
				tr.find("h4").appendTo(wrap);
				wrap.append('<div class="cartSkuUnitPrice">'+(tr.find(".preco-unitario").html()||"").toString()+'</div>');
				var cartSkuQtt=jQuery('<div class="cartSkuQtt"><span class="cartSkuQttTxt">'+options.qttText+'<span class="vtexsc-skuQtt">'+(currentQtt||"")+'</span>'+'</span></div>');
				var skuQtt=cartSkuQtt.find(".vtexsc-skuQtt");
				wrap.append(cartSkuQtt);
				wrap.appendTo(li);
				/* Ações */
				var wrap=jQuery('<div class="cartSkuActions"></div>');
				var remove=jQuery('<span class="cartSkuRemove">'+options.textRemove+'</span>').bind("click",function(){
					fns.removeSku(li,(tr.find("a.excluir").attr("href")||"").split("IdSkuRm=").pop());
				});
				remove.appendTo(wrap);
				var moreOne=jQuery('<span class="cartSkuMoreOne">'+options.textMoreOne+'</span>').bind("click",function(){
					var out=fns.changeQantity([li,skuQtt],currentSku,currentQtt);
					if(!isNaN(out)) currentQtt=out;
				});
				var minusOne=jQuery('<span class="cartSkuMinusOne">'+options.textMinusOne+'</span>').bind("click",function(){
					var out=fns.changeQantity([li,skuQtt],currentSku,currentQtt,-1);
					if(!isNaN(out)) currentQtt=out;
				});
				var changeQttWrap=jQuery('<span class="cartSkuChangeQttWrap"></span>');
				changeQttWrap.append(moreOne).append(minusOne);
				cartSkuQtt.append(changeQttWrap);
				wrap.append(changeQttWrap.clone());
				wrap.appendTo(li);
				
				if(typeof sku!=="undefined" && currentSku==sku)
					options.resetNewItem(li.addClass("vtexsc-newItem"));
				
				if(i===0)
					listE.empty();
					
				li.append("<div class='vtexsc-overlay'></div>");
				li.appendTo(listE);
				i++;
			});
		},
		formatCartItens2:function($data,sku)
		{
			var cartTable=$data.find(".carrinhoTable");
			var i=0;
			if(cartTable.length<1) return false;

			cartTable.find("tbody tr").each(function(){
				var wrap=null;
				var tr=jQuery(this);
				var _tr=jQuery("<tr></tr>");
				_tr.addClass((tr.attr("class")||""));
				
				// Imagem
				wrap=jQuery('<td class="cartSkuImage"></td>');
				tr.find(".sku-imagem").appendTo(wrap);
				wrap.appendTo(_tr);

				// Título Produto
				wrap=jQuery('<td class="cartSkuName"></td>');
				tr.find("h4").appendTo(wrap);
				wrap.appendTo(_tr);
				
				// Preço
				wrap=jQuery('<td class="cartSkuPrice"></td>');
				wrap.append('<div class="cartSkuUnitPrice">'+(tr.find(".preco-unitario").html()||"").toString()+'</div>');
				wrap.appendTo(_tr);
				
				// Quantidade
				wrap=jQuery('<td class="cartSkuQunatity"></td>');
				var qttInput=tr.find(".boxQuantidade");
				var currentSku=qttInput.attr("title")||"";
				curQtt=parseInt(qttInput.val());
				var cartSkuQtt=jQuery('<div class="cartSkuQtt"><span class="cartSkuQttTxt">'+options.qttText+'<span class="vtexsc-skuQtt">'+(curQtt||"")+'</span>'+'</span></div>');
				var skuQtt=cartSkuQtt.find(".vtexsc-skuQtt");
				wrap.append(cartSkuQtt);
				wrap.appendTo(_tr);
				
				currentQtt["_"+currentSku]=curQtt;
				
				// Ações
				var wrap=jQuery('<td class="cartSkuActions"></td>');
				remove=jQuery('<span class="cartSkuRemove">'+options.textRemove+'</span>').bind("click",function(){
					fns.removeSku(_tr,(tr.find("a.excluir").attr("href")||"").split("IdSkuRm=").pop());
				}).appendTo(wrap);
				var moreOne=jQuery('<span class="cartSkuMoreOne">'+options.textMoreOne+'</span>').bind("click",function(){
					var out=fns.changeQantity([_tr,skuQtt],currentSku,currentQtt["_"+currentSku]);
					if(!isNaN(out)) currentQtt["_"+currentSku]=out;
				});
				var minusOne=jQuery('<span class="cartSkuMinusOne">'+options.textMinusOne+'</span>').bind("click",function(){
					var out=fns.changeQantity([_tr,skuQtt],currentSku,currentQtt["_"+currentSku],-1);
					if(!isNaN(out)) currentQtt["_"+currentSku]=out;
				});
				var changeQttWrap=jQuery('<span class="cartSkuChangeQttWrap"></span>');
				changeQttWrap.append(moreOne).append(minusOne);
				cartSkuQtt.append(changeQttWrap);
				wrap.append(changeQttWrap.clone());
				wrap.appendTo(_tr);
				
				if(typeof sku!=="undefined" && currentSku==sku)
				{
					options.resetNewItem(_tr.addClass("vtexsc-newItem"));
					fns.scrollNewItem();
				}
				
				if(i===0)
					listE.empty();
					
				_tr.find(">td").append("<div class='vtexsc-overlay'></div>");
				_tr.appendTo(listE);
				i++;
			});
			
			fns.totalCartFormat(cartTable);
		},
		totalCartFormat:function(cartTable)
		{
			totalCartE.html(cartTable.find("tfoot .subtotal .preco-total").text());
		},
		scrollNewItem:function(cartTable)
		{
			var wrap=listE.parent();
			wrap.stop(true,true).animate({scrollTop:((wrap.height()||0)+100)},"fast");
		},
		updateCart:function()
		{
			cartOverlay.show();
			jQuery.ajax({
				url:"/no-cache/QuantidadeItensCarrinho.aspx",
				success:fns.upCartAjaxSuccess,
				error:fns.upCartAjaxError
			});
		},
		upCartAjaxError:function()
		{
			if(_console) console.log("Erro ao tentar atualizar o carrinho!");
		},
		upCartAjaxSuccess:function(data)
		{
			var $data=jQuery(data);
			totalCartE.text($data.find(".total-cart").text());
			var cart=$data.filter(".cartInfoWrapper");
			if(cart.length>0)
				jQuery(".cartInfoWrapper").html(cart.html());
			else
				if(_console) console.log("[Erro] O carrinho não foi atualizado pois “.cartInfoWrapper” não foi encontrado no retorno da requisição.");
			
			cartOverlay.hide();
		},
		displayCart:function()
		{
			options.cartShow(cartE);
			options.cartHide(cartE,fns.hideCart);
		},
		removeSku:function(itemElem,skuRmId)
		{
			var sku=skuRmId||""
			
			if(isNaN(parseInt(sku))){if(_console) console.log("[Erro] O SKU deve ser numérico: “"+sku+"”"); return false;}
			
			var overlay=itemElem.find(".vtexsc-overlay").show()||$empty;
			jQuery.ajax({
				url:"/no-cache/CarrinhoRemove.aspx?IdSkuRm="+sku,
				success:function(){
					if(options.htmlFormat===2) itemElem.hide(function(){fns.scrollAction();}).remove();
					else itemElem.slideUp(function(){fns.scrollAction(); jQuery(this).remove();});
					overlay.hide();
					fns.updateCart();
				}
			});
		},
		scrollAction:function()
		{
			cartE.filter(":hidden").addClass("calculatingTheHeight").css("visibility","hidden").show();

			var wrap=listE.parent();
			if(options.htmlFormat===2)
				var h=(wrap.height()||0)/listE.find("tr:visible").length;
			else
				var h=(wrap.height()||0)/listE.children().filter(":visible").length;
			
			cartE.filter(".calculatingTheHeight").removeClass("calculatingTheHeight").hide().css("visibility","visible");
			
			scrollDownE.unbind("click").bind("click",function(){
				wrap.stop(true,true).animate({scrollTop:"+="+h+"px"},"fast");
			});
			scrollTopE.unbind("click").bind("click",function(){
				wrap.stop(true,true).animate({scrollTop:"-="+h+"px"},"fast");
			});
		},
		changeQantity:function(elems,sku,curQtt,quantity)
		{
			var qtt=quantity||1;
			if(curQtt<2 && qtt<0) return curQtt; 

			var overlay=elems[0].find(".vtexsc-overlay").show()||$empty;
			curQtt=curQtt+qtt;
			jQuery.ajax({
				url:"/no-cache/CarrinhoUpdate.aspx?IdSku="+sku+"&quantidade="+curQtt,
				success:function(data){
					overlay.hide();
					if(data.indexOf("Ocorreu um erro")>-1) return fns.skuToCartAjaxError($empty);
					
					if(jQuery(data).filter(".cart-items-detail").length>0)
					{
						alert(options.changeQttError);
						currentQtt["_"+sku]=curQtt-qtt;
					}
					else
						elems[1].text(curQtt);
					
					fns.updateCart();
				},
				error:function()
				{
					fns.skuToCartAjaxError($empty);
				}
			});
			return curQtt;
		},
		hideCart:function(elem)
		{
			elem.slideUp();
		},
		mouseCartActions:function()
		{
			var actions=
			{
				mouseenter:function()
				{
					clearTimeout(vtexscCartHideTimeOut);
					options.cartShow(cartE);
				},
				mouseleave:function()
				{
					options.cartHide(cartE,fns.hideCart);
				}
			};
			
			cartE.bind(actions);
			showCartBtnE.bind(actions);
		}
	};
	
	switch(options.method)
	{
		case 1:
			fns.buyButtons();
		break;
	}
	
	fns.loadCart();
	fns.mouseCartActions();
	options.callback();
	return $this;
};