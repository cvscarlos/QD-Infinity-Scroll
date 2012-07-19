/**
* PopUps
* @author Carlos Vinicius
* @version 1.19
* @date 2012-05-29
*/
if(typeof jQuery.fn.vtexPopUp2!="function")jQuery.fn.vtexPopUp2=function(k){var c=jQuery(this);if(1>c.length)return c;var i=jQuery("body"),d=i.find(".boxPopUp2"),j="object"==typeof console;1>d.length&&(d=jQuery('<div class="boxPopUp2"><div class="boxPopUp2-wrap"><span class="boxPopUp2-close"></span><div class="boxPopUp2-content"></div></div></div>'),i.prepend(d),d.after('<div class="boxPopUp2-overlay"></div>'));var b=jQuery.extend({popupType:null,closeContent:null,popupClass:"",quickViewClass:"",initCallback:function(){},closeCallback:function(){}},
k),k=d.find(".boxPopUp2-close"),e=d.find(".boxPopUp2-content"),m=i.find(".boxPopUp2-close, .boxPopUp2-overlay"),n=i.find(".boxPopUp2-overlay"),h=jQuery(document);null!=b.closeContent&&k.html(b.closeContent);var a={positioning:function(){var a=h.scrollTop(),b=jQuery(window).height(),c=d.outerHeight(true);d.css("top",a+(c>=b?20:(b-c)/2)+"px")},show:function(b){b=b||{};n.fadeTo("fast",0.5,function(){d.show().addClass("popupOpened");"boolean"===typeof b.loading&&b.loading===true?a.showLoading():a.hideLoading();
"function"===typeof b.callback&&b.callback()})},hideLoading:function(){e.filter(":visible").css("background-image","none")},showLoading:function(){e.filter(":visible").css("background-image",'url("/arquivos/ajax-loader.gif")')},close:function(a){var a=a||{},b=function(){n.fadeOut("fast");d.fadeOut("fast",function(){e.empty()});e.attr("class","boxPopUp2-content");d.attr("class","boxPopUp2")};typeof a.closeNow=="boolean"&&a.closeNow==true&&b();if(m.filter(".boxPopUp2-clickActive").length<1){m.addClass("boxPopUp2-clickActive").bind("click",
function(){"function"===typeof a.clickCallback&&a.clickCallback();b()});h.bind("keyup",function(a){(a.keyCode?a.keyCode:a.which)==27&&b()})}if(c.hasClass("autoClose")){var l=(c.attr("class")||"").split("ac_").pop().split(" ").shift();if(isNaN(parseFloat(l))){j&&console.log("[Erro] O tempo informado (em segundos) n\u00e3o \u00e9 um valor num\u00e9rico: \u201c"+l+"\u201d");return false}setTimeout(function(){b()},l*1E3)}},setType:function(){if(c.hasClass("quickViewLink"))a.quickView();else if(c.hasClass("giftListWrap"))a.giftList();
else if(c.hasClass("installmentInfoTpl"))a.paymentForms();else if(c.hasClass("shipping-value"))a.calculateShipping();else if(c.hasClass("freeContent"))a.freeContent();else if(c.hasClass("boxPopUp2"))a.closeNow();else if(c.hasClass("referAFriendTpl"))a.productReferAFriend();else if(c.filter("#btnReferAFriend").length>0)a.giftListReferFriend();else if(c.filter("#lnkPubliqueResenha").length>0)a.postRatingComment();else if(c.filter("#palerta").length>0)a.cartCheckoutAlert();else if(c.hasClass("lnkAddPhoto")){b.popupType=
"minhaContaFoto";a.userAccount()}else return false},checkType:function(){if("cadastroCliente"===b.popupType||"minhaContaFoto"===b.popupType)a.userAccount();else if("newsletter"===b.popupType)a.newsletter();else if("quickview"===b.popupType)a.quickView();else if("giftlist"===b.popupType)a.giftList();else if("paymentforms"===b.popupType)a.paymentForms();else if("shipping"===b.popupType)a.calculateShipping();else if("freecontent"===b.popupType)a.freeContent();else if("closenow"===b.popupType)a.closeNow();
else if("GiftListReferAFriend"===b.popupType)a.giftListReferFriend();else if("postRatingComment"===b.popupType)a.postRatingComment();else return false},exec:function(){null===b.popupType?a.setType():false===a.checkType()&&a.setType();b.initCallback()},userAccount:function(){var f="";"cadastroCliente"===b.popupType?f="signInPopups":"minhaContaFoto"===b.popupType&&(f="profilePhoto");c.unbind().removeAttr("onclick");var g=c.attr("href")||"";c.bind("click",function(){d.addClass(b.popupClass+" "+f+"Main");
""===g&&j&&console.log("N\u00e3o existe URL no atributo href");jQuery('<iframe src="'+g+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(e.addClass(b.popupClass+" "+f));a.show({loading:true});a.positioning();a.close();return false})},newsletter:function(){c.clone().appendTo(e.addClass(b.popupClass+" newsletterPopup"));d.addClass(b.popupClass+" newsletterMain");a.show();a.positioning();a.close()},quickView:function(){var c=i.find(""!==b.quickViewClass?b.quickViewClass:".quickViewLink"),
g=function(){c.filter(":not(.quickViewLinkActivated)").addClass("quickViewLinkActivated").bind("click",function(){jQuery('<iframe src="'+jQuery(this).attr("href")+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(e.addClass(b.popupClass+" productQuickView"));d.addClass(b.popupClass+" quickViewMain");a.show({loading:true});a.positioning();a.close();return false})};g();h.ajaxStop(g)},paymentForms:function(){var f="",g=function(){var a=i.find(".see-other-payment-method-link");if(a.length<
1){j&&console.log("Url das formas de pagamento n\u00e3o encontrado. \n Verifique se o controle esta na p\u00e1gina.\n("+a.selector+")");return false}f=/http:[a-z.\/\?=0-9&]+/i.exec(a[0].onclick.toString())[0]||"#onclickError"};g();c.bind("click",function(){jQuery("<iframe src='"+f+"' frameborder='0' allowtransparency='true'></iframe>").appendTo(e.addClass(b.popupClass+" paymentFormsPopup"));d.addClass(b.popupClass+" paymentFormsMain");a.show({loading:true});a.positioning();a.close();return false});
h.ajaxStop(g)},calculateShipping:function(){h.ajaxStop(function(){var c=i.find("#calculoFrete").children();if(c.length<1)return false;c.find("span.cep-busca a").attr("target","_blank");c.appendTo(e.addClass(b.popupClass+" shippingCalculationPopup"));d.addClass(b.popupClass+" shippingCalculationMain");a.show();a.positioning();a.close()})},giftList:function(){c.appendTo(e.addClass(b.popupClass+" giftListPopup"));d.addClass(b.popupClass+" giftListMain");a.show();a.positioning();a.close({clickCallback:b.closeCallback})},
cartCheckoutAlert:function(){c.appendTo(e.addClass(b.popupClass+" cartCheckoutAlertPopup"));d.addClass(b.popupClass+" cartCheckoutAlertMain");a.show();a.positioning();a.close()},freeContent:function(){c.appendTo(e.addClass(b.popupClass+" freeContentPopup"));d.addClass(b.popupClass+" freeContentMain");a.show();a.positioning();a.close()},closeNow:function(){a.close({closeNow:true})},giftListReferFriend:function(){var f=function(){var c=$(this).attr("href");if("undefined"===typeof c||""===c){j&&console.log("[Erro] Url do popup n\u00e3o encontrada.");
return false}e.addClass(b.popupClass+" freeContentPopup").load(c);d.addClass(b.popupClass+" giftListReferFriendMain");a.show({loading:true});a.positioning();a.close();return false},g=function(){c.unbind().bind("mouseenter",function(){c.unbind().bind("click",f)})};g();h.ajaxStop(g)},productReferAFriend:function(){var f=jQuery('<div class="referAFriendPopUpWrap"></div>');c.bind("click",function(){var c=/\/referAFriend\/Form\/[0-9]+\?/i.exec((jQuery(this).parent().find("#div-referAFriend input").attr("onclick")||
"").toString());if(null===c){alert("Desculpe, n\u00e3o foi poss\u00edvel abrir o formul\u00e1rio.");return false}f.empty().load(c[0],function(){a.positioning()});f.appendTo(e.addClass(b.popupClass+" freeContentPopup"));d.addClass(b.popupClass+" freeContentMain");a.show();a.positioning();a.close();return false});h.ajaxStop(function(){e.find(".referAFriendPopUpWrap #btnFechar").length>0&&setTimeout(a.closeNow,1500)})},postRatingComment:function(){var f=false;if(c.filter(":not(.popUpPublishReviewActivated)").length<
1)return false;c.bind("click",function(){var c=jQuery(this).attr("href")||"";if(""===c){j&&console.log("[Erro] N\u00e3o foi poss\u00edvel obter os dados para abrir o popup de resenha.");return false}c=c.split(")").shift().split("(").pop().split(",");if(3!=c.length){j&&console.log("[Erro] O array com os dados do cliente retornou um valor inesperado.");return false}if(f)return false;f=true;jQuery.ajax({url:"/publishuserreviewcomment",type:"POST",data:{productId:c[1],clientId:c[0],categoryId:c[2]},success:function(c){var g=
jQuery(c);e.addClass(b.popupClass+" userReviewPopup").html(g);d.addClass(b.popupClass+" userReviewPopupMain");a.show({callback:function(){g.find("#txtTituloResenha:hidden").val("titulo_auto");var a=e.find("a#rtAvaliacao_A0"),b=function(){a.attr("title",a.find(".filledRatingStar:last").index()+1||0)};a.find("span").bind("mouseenter",b);a.bind("mouseleave",b)}});a.positioning();a.close();f=false},error:function(){f=false}});return false}).addClass("popUpPublishReviewActivated");jQuery.fn.vtexPopUp2.data.userReviewCount==
0&&h.ajaxStop(function(){e.hasClass("userReviewPopup")&&e.find(".formUserComment").children().length==0&&a.closeNow()});jQuery.fn.vtexPopUp2.data.userReviewCount++}};a.exec();return c};jQuery.fn.vtexPopUp2.data={userReviewCount:0};/**

/* Get Attributes */
(function(b){b.fn.getAttributes=function(){var c={},a=b(this).first();if(!a.length)return this;b.each(a[0].attributes,function(b,a){c[a.name]=a.value});return c}})(jQuery);

/**
* Vtex Smart Cart
* @author Carlos Vinicius
* @version 3.3
* @date 2011-07-19
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
var vtexscCartHideTimeOut=0;
jQuery.fn.smartCart=function(opts)
{
	log=function(msg,type){
		if(logAvaliable)
			console.log("[Smart Cart - "+(type||"Erro")+"] "+msg);
	};

    var defaults=
	{
		method:1,
		htmlFormat:1, // 1 = UL, 2 = Tabela
		skuThumbId:3, // Id da miniatura a ser exibida no popup de seleção do SKU
		cartElem:".vtexsc-cart", // Elemento que mostra os itens existentes no carrinho
		listElem:".vtexsc-productList", // Elemento onde os produtos serão listados
		scrollTop:".vtexsc-arrowTop", // Elemento p/ rolar a lista p/ cima
		scrollDown:".vtexsc-arrowBottom", // Elemento p/ rolar a lista p/ baixo
		btnOverlayElem:".vtexsc-buttonOverlay", // Overlay do botão comprar
		errorElem:".vtexsc-error", // Elemento p/ exibir os erros [nota: não foi totalmente desenvolvido]
		successElem:".vtexsc-success", // Elemento p/ exibir os sucessos [nota: não foi totalmente desenvolvido]
		showCartBtn:".vtexsc-showCart", // Elemento que vai exibir o carrinho quando o mouse estiver sobre
		totalCart:".vtexsc-totalCart", // Elemento que exibe o valor total do carrinho
		buyButton:".vtexsc-buyButton", // Botão comprar no popup de SKU
		asynchronousClass:"btn-add-buy-button-asynchronous", // botão comprar na prateleira
		qttText:"Quantidade ", // rótulo de quantidade
		textRemove:"remover", // rótulo de remover
		textMoreOne:" Mais 1 ", // rótulo de adicionar +1
		textMinusOne:" Menos 1 ", // rótulo de reduzir 1
		ajaxErroMsg:"Houve um erro ao tentar adicionar/alterar seu produto no carrinho.",
		changeQttError:"Provavelmente esta alteração não obteve êxito!",
		skuNotSelected:"Selecione o(a) #groupName",
		skuNotLocated:"Não foi possível obter as informações das variações deste produto.\nVocê será redirecionado para a página de detalhes deste produto.",
		skuUnavailable:"Esta variação de produto não esta disponpível no momento.",
		regularPricePopupHtml:'<div class="regularPrice">De: <span>R$ #regularPrice</span></div>', // Html do "preço de" a ser exibido dentro do popup de seleção do SKU
		newPricePopupHtml:'<div class="newPrice">Por: <span>R$ #newPrice</span></div>', // Html do "preço por" a ser exibido dentro do popup de seleção do SKU
		installmentPricePopupHtml:'<div class="installmentPrice">ou em até <span>#installmentQtt</span>X de <span>R$ #installmentValue</span> sem juros</div>', // Html do "preço parcelado" a ser exibido dentro do popup de seleção do SKU
		fullPricePopupHtml:'<div class="fullPrice">à vista</div>', // Html do "preço a vista" a ser exibido dentro do popup de seleção do SKU
		currency:"R$",
		notAjaxStop:false, // Define se será realizada uma busca por novos botões em todo ebento AjaxStop
		callback:function(){},
		ajaxCallback:function(){},
		succesShow:function(elem)
		{
			elem.show();
		},
		// Animação ao exibir o carrinho. Recebe como parametro o Carrinho e uma função p/ ser executada no callback da animação.
		cartShow:function(elem, callback)
		{
			elem.slideDown(callback);
		},
		// Animação ao esconder o carrinho
		cartHide:function(elem, hideFunction)
		{
			clearTimeout(vtexscCartHideTimeOut);
			vtexscCartHideTimeOut=setTimeout(function(){
				hideFunction(elem);
			},5000);
		},
		// Ação p/ remover a classe do último item adicionado ao carrinho
		resetNewItem:function(elem)
		{
			setTimeout(function(){
				elem.removeClass("vtexsc-newItem");
			},2500);
		},
		// Obtendo os SKU do html da página de produtos
		getSkuHtml:function($productHtml)
		{
			return $productHtml.find("ul.topic");
		},
		// Estrutura do conteúdo do popup. Recebe como parâmetro os SKUs obtidos através do método "getSkuHtml",
		// o elemento jQuery onde será exibido a imagem do produto
		// e o elemento jQuery onde será informado o valor do produto, utilizando o conteúdo do parametro "oldPricePopupHtml","newPricePopupHtml","installmentPricePopupHtml"
		formatSkuPopup:function($skuList,$productImage,$prodPriceElem)
		{
			var wrap,listWrap,btn,prodImg,skusWrap,price;

			wrap=jQuery('<div class="skuWrap_"><div class="selectSkuTitle">Selecione a variação do produto</div></div>');
			listWrap=jQuery('<div class="skuListWrap_"></div>');
			btn=jQuery('<div class="vtexsc-buttonWrap clearfix"><a href="#" class="vtexsc-buyButton"></a></div>');
			skusWrap=jQuery('<div class="vtexsc-skusWrap"></div>');
			price=jQuery('div');

			$skuList.appendTo(listWrap);
			$productImage.appendTo(skusWrap);
			listWrap.appendTo(skusWrap);
			$prodPriceElem.appendTo(skusWrap);
			skusWrap.appendTo(wrap);
			btn.appendTo(wrap);

			return wrap;
		}
	};
    var options=jQuery.extend(defaults, opts),
		$this=jQuery(this),
		$empty=jQuery(""),
		_console="object"===typeof(console),
		cartE=jQuery(options.cartElem),
		checkErrors=true,
		onlyCart=false,
		log;

	log=function(msg,type){
		if(_console)
			console.log("[Smart Cart - "+(type||"Erro")+"] "+msg);
	};
	
	// Exibindo somente o carrinho
	if($this.length<1 && cartE.length>0)
	{
		onlyCart=true;
		checkErrors=false;
	}
	
	// Reportando erros
	if($this.length<1 && checkErrors) return $this;
	if(cartE.length<1 && checkErrors){if(_console) console.log("[Erro] Elemento do carrinho não encontrado \n ("+cartE.selector+")"); return false;}

	var listE=cartE.find(options.listElem);
	// Reportando erros
	if(listE.length<1 && checkErrors){if(_console) console.log("[Erro] Lista de produtos não encontrada \n ("+listE.selector+")"); return false;}

	var errorE=jQuery(options.errorElem)||$empty,
		successE=jQuery(options.successElem)||$empty,
		showCartBtnE=jQuery(options.showCartBtn)||$empty,
		currentQtt={},
		scrollDownE=cartE.find(options.scrollDown)||$empty,
		scrollTopE=cartE.find(options.scrollTop)||$empty,
		totalCartWrap=jQuery(options.totalCart)||$empty,
		cartTextClass="vtexsc-text",
		cartOverlayClass="vtexsc-overlay",
		cartText=jQuery("<span class='"+cartTextClass+"'></span>"),
		cartOverlay=jQuery("<div class='"+cartOverlayClass+"'></div>"),
		buyButtonE=$empty,
		totalCartE,
		tmp;
	
	if(!totalCartWrap.children("."+cartOverlayClass).length)
		totalCartWrap.append(cartOverlay);
	
	tmp=totalCartWrap.children("."+cartTextClass);
	if(tmp.length)
		totalCartE=tmp;
	else
	{
		totalCartWrap.append(cartText);
		totalCartE=cartText;
	}	
	
	var fns=
	{
		buyButtons:function()
		{
			$this.not(".vtexsm_activated").each(function(){
				var btn=jQuery(this);
				if(!btn.hasClass("actionActivated") && fns.buyAsynchronous(btn))
					btn.addClass("actionActivated").bind("click",function(){
						if((btn.attr("href")||"").indexOf("elecione")>-1)
							return true;
							
						var sku=fns.getSku(btn);
						if(sku!=="")
							fns.skuToCart(btn,sku);
						else
							if(_console) console.log("[Erro] O Sku não foi obtido! A execução parou"); 
						return false;
					});
			}).addClass("vtexsm_activated");
		},
		buyAsynchronous:function(btn)
		{
			// Checando se é o botão esta em uma prateleira
			if(!btn.hasClass(options.asynchronousClass)) return true;
			// Removendo antigos eventos e alterando a classe para que o script nativo da Vtex não seja aplicado
			btn.unbind("click").removeClass(options.asynchronousClass).addClass("asynchronousBuyButton");
			// Retorna p/ o script padrão adicionar o evento de click caso o produto tenha apenas um Sku
			if(btn.hasClass("remove-href")) return true;
			// O produto possui mais de 1 Sku
			fns.multiplesSkus(btn);
			return false;
		},
		multiplesSkus:function(btn)
		{
			btn.bind("click",function(){
				var url,btnOverlayE,prodImgElem,prodPriceElem;
				
				url=btn.attr("href")||"";
				// Reportando erros
				if(url==""){if(_console) console.log("[Erro] Não foi possível obter a URL para a página do produto \n método: multiplesSkus"); return false;}
				
				btnOverlayE=btn.siblings(options.btnOverlayElem).show();
				prodImgElem=jQuery('<div class="vtexsc-skuProductImage"></div>');
				prodPriceElem=jQuery('<div class="vtexsc-skuProductPrice"></div>');
				
				fns.skuProductImg(prodImgElem,btn);
				
				jQuery.ajax({
					url:url,
					success:function(data){fns.productSuccess(data,url,btnOverlayE,prodImgElem,prodPriceElem);},
					error:function()
					{
						if(_console) console.log("Erro ao requisitar a página do produto via Ajax");
					}
				});
				
				return false;
			});
		},
		skuProductImg:function(prodImgElem,btn)
		{
			var li=fns.getParent(btn,"li");
			li.find("a[href$='/p']:first img").clone().appendTo(prodImgElem);
		},
		getParent:function(startElem,searchElemStr)
		{
			var p;
			p=startElem.parent();
			
			if(p.is("html"))
				return jQuery("");
			else if(p.is(searchElemStr))
				return p;
			else
				return fns.getParent(p,searchElemStr);
		},
		productSuccess:function(data,url,btnOverlayE,prodImgElem,prodPriceElem)
		{
			$data=jQuery(data);
			var skuOptions=options.getSkuHtml($data);
			var located=false;
			var skuSpecifications=null;

			$data.filter("script:not([src])").each(function(){
				var text=this.innerHTML;
				if(text.indexOf("myJSONSkuSpecification")>-1)
				{
					text=text.replace(":,",':"",').replace(":}",':""}').replace(":]",':""]');
					eval(text);
					skuSpecifications=myJSONSkuSpecification;
					located=true;
					return false;
				}
			});
			
			if(!located)
			{
				log("Não foi possível localizar as especificações do SKU. \n A página será redirecionada!");
				setTimeout(function(){document.location.href=url;},500);
				return false;
			}
			
			options.formatSkuPopup(skuOptions,prodImgElem,prodPriceElem).addClass("freeContent vtexsc-selectSku").vtexPopUp2();
			skuSpecifications=fns.specificationsReorder(skuSpecifications);
			buyButtonE=jQuery(options.buyButton)||$empty;
			
			var chks=skuOptions.find("[type=checkbox]"), tempChks=jQuery("");
			chks.each(function(){
				var $t=jQuery(this),
					attr=$t.getAttributes(),
					newInput=jQuery('<input type="radio" name="'+attr.name+'" specification="'+(attr.specification||"")+'" class="'+(attr["class"]||"")+'" id="'+(attr.id||"")+'" value="'+attr.value+'" />');

				$t.after(newInput);
				$t.remove();
				tempChks=tempChks.add(newInput);
			});
			chks=tempChks;
			
			if(chks.length>0)
			{
				btnOverlayE.hide();

				if(skuSpecifications.specifications>1)
					fns.multipleSkuConfigCheckbox(skuOptions, skuSpecifications, chks, prodImgElem,prodPriceElem);
				else
					fns.skuConfigCheckbox(skuOptions, skuSpecifications, chks, prodImgElem,prodPriceElem);

				fns.buyButtonCheckbox(chks, skuSpecifications, skuOptions, url, btnOverlayE);
			}
			else
				if(_console) console.log("Este plugin ainda não suporta SKU em selectbox");
		},
		buyButtonCheckbox:function(chks, skuSpecifications, skuHtml, url, btnOverlayE)
		{
			buyButtonE.bind("click",function(){
				var fields=chks.filter(":checked");
				
				if(skuSpecifications.specifications<2)
				{
					if(fields.length>0)
					{
						var sku=skuSpecifications.skus[fields.val()];
						if("undefined"===typeof sku)
						{
							alert(options.skuNotLocated);
							document.location.href=url;
						}
						else
						{
							if("False"===sku[1])
								alert(options.skuUnavailable);
							else
							{
								fns.skuToCart($empty,sku[0],undefined,btnOverlayE);
								jQuery(".boxPopUp2").vtexPopUp2();
							}
						}
					}
					else
					{
						var txt=skuHtml.find(".specification").eq(0).text()||" variação do produto";
						alert(options.skuNotSelected.replace("#groupName",txt));
					}
				}
				else
				{
					var stop=false;
					
					skuHtml.each(function(){
						var $t=jQuery(this);
						
						if($t.find("input:checked").length<1)
						{
							var txt=skuHtml.find(".specification").eq($t.index()).text()||" variação do produto";
							alert(options.skuNotSelected.replace("#groupName",txt));
							stop=true;
							return false;
						}
						
						
					});
					
					if(!stop)
					{
						var sku,key=[];

						fields.each(function(){
							key.push(jQuery(this).val());
						});
						
						sku=skuSpecifications.skus[key.join(",")];
						
						if("undefined"===typeof sku)
						{
							alert(options.skuNotLocated);
							document.location.href=url;
						}
						else
						{
							if("False"===sku[1])
								alert(options.skuUnavailable);
							else
							{
								fns.skuToCart($empty,sku[0],undefined,btnOverlayE);
								jQuery(".boxPopUp2").vtexPopUp2();
							}
						}
					}
				}
				
				return false;
			});
		},
		specificationsReorder:function(sku)
		{
			var out={};
			
			// Especificação
			if("undefined"!==typeof sku.specifications)
				out.specifications=sku.specifications;
			else
			{
				if(_console) console.log("[Erro] Não foi localizado o item “specifications” do objeto com as especificações de SKU.");
			}
			
			// Combos / Combinação
			if("undefined"!==typeof sku.combination)
			{
				var q=sku.combination.length;
				out.combination={};
				for(var i=0; i<q; i++)
					for(var k in sku.combination[i])
						if(typeof sku.combination[i][k] === "string")
							out.combination[k]=sku.combination[i][k].split(",");
						else
							for(var l in sku.combination[i][k][0]) // Ainda não esta desenvolvida p/ multiplas opções
							{
								out.combination[k]=sku.combination[i][k][0][l].split(",");
								break; // Ainda não esta desenvolvida p/ multiplas opções
							}
			}
			else
			{
				if(_console) console.log("[Erro] Não foi localizado o item “combination” do objeto com as especificações de SKU.");
			}
			
			// Skus
			if("undefined"!==typeof sku.skus)
			{
				var q=sku.skus.length;
				out.skus={};
				for(var i=0; i<q; i++)
					for(var k in sku.skus[i])
						out.skus[k]=sku.skus[i][k].split(",");
			}
			else
			{
				if(_console) console.log("[Erro] Não foi localizado o item “skus” do objeto com as especificações de SKU.");
			}
			
			return out;
		},
		getSku:function(btn)
		{
			if(btn.hasClass("asynchronousBuyButton"))
				return (btn.attr("id")||"").replace("idprod","");
			else
				return (btn.attr("href")||"").split("dSku=")[1]||"";
		},
		selectUniqueSku:function(skusHtml)
		{
			skusHtml.each(function(){
				var t,input;
				t=$(this);
				input=t.find("input");
				
				if(input.length==1)
				{
					input.attr("checked",true).trigger("change").trigger("click");
					t.hide();
				}
			});
		},
		multipleSkuConfigCheckbox:function(skusHtml, skuSpecifications, chks, prodImgElem, prodPriceElem)
		{
			if(skuSpecifications.specifications>2)
				log("Esta extenão não foi testada com mais de dois tipos de SKUs","Alerta");
			
			// Checando se algum SKU do primeiro grupo esta totalmente indisponível
			skusHtml.filter(":first").find("input").each(function(){
				var $t=jQuery(this),
					val=$t.val(),
					c, cl,
					ua=true;
					
				if(!(typeof val!="undefined" && val!="")) return;
				
				c=skuSpecifications.combination[val];
				if(typeof c=="undefined") return;
				cl=c.length;
				for(var i=0;i<cl;i++)
					if(typeof skuSpecifications.skus[val+","+c[i]] == "object" && skuSpecifications.skus[val+","+c[i]][1]=="True")
						ua=false;
						
				if(ua)
					$t.addClass("item_unavaliable").next("label").addClass("item_unavaliable");
			});
			
			// Ação do usuário
			chks.bind("change",function(){
				var $t,ndx,ndxArray;

				$t=jQuery(this);
				ndxArray=$t.attr("id").split("_");
				// ndx=ndxArray.pop();
				ndx=ndxArray[1]||ndxArray.pop();
				
				skusHtml.not(":eq("+ndx+")").find("input").each(function(){
					var t=jQuery(this),skuNdx;
					
					if(ndx=="0")
						skuNdx=$t.val()+","+t.val();
					else
						skuNdx=t.val()+","+$t.val();

					// Alterando a imagem do SKU e preço
					if(typeof skuSpecifications.skus[skuNdx] == "object" && $t.is(":checked") && t.is(":checked"))
						fns.actionsBySku(skuSpecifications,skuNdx,prodImgElem,prodPriceElem);

					if(typeof skuSpecifications.skus[skuNdx] == "object" && skuSpecifications.skus[skuNdx][1]=="False")
					{
						t.addClass("item_unavaliable").next("label").addClass("item_unavaliable");
						$t.addClass("item_unavaliable").next("label").addClass("item_unavaliable");
					}
				});
			});

			fns.selectUniqueSku(skusHtml);
			
			if(skusHtml.find("input").length<=skusHtml.length)
				log("Deve ser desenvolvida uma função p/ variações de SKUs em que todas tem apenas uma opção","Aviso");
		},
		actionsBySku:function(skuSpecifications,skuNdx,prodImgElem,prodPriceElem)
		{
			var img,skuId,imgs,obj,regularPrice,newPrice,popHtml,installmentPrice,fullPrice;
			
			img=prodImgElem.find("img");
			if(img.length<1)
			{
				img=jQuery('<img src="" alt="" />');
				prodImgElem.append(img);
			}
			
			skuId=skuSpecifications.skus[skuNdx][0];
			
			jQuery.ajax({
				"url":"/produto/sku/"+skuId,
				"data":"json",
				"success":function(data, textStatus, jqXHR)
				{
					if("object"!==typeof data)
						log("[1] Não foi possível obter a imagem p/ o sku “"+skuId+"”.");
					else if(jqXHR.status!=0)
					{
						obj=data[0];
						
						// Imagem do produto
						imgs=fns.getImageUrl(obj,options.skuThumbId);
						if(typeof imgs[0] == "string")
							img.attr("src",imgs[0]);
						else
							log("[2] Não foi possível obter a imagem p/ o sku “"+skuId+"”.");
					
						// Preço do produto
						regularPrice=jQuery(options.regularPricePopupHtml.replace("#regularPrice",fns.numberFormat(obj.ListPrice))).hide();
						newPrice=jQuery(options.newPricePopupHtml.replace("#newPrice",fns.numberFormat(obj.Price)));
						installmentPrice=jQuery(options.installmentPricePopupHtml.replace("#installmentQtt",obj.BestInstallmentNumber).replace("#installmentValue",fns.numberFormat(obj.BestInstallmentValue))).hide();
						fullPrice=jQuery(options.fullPricePopupHtml).hide();
						
						popHtml=jQuery("").add(regularPrice).add(newPrice).add(installmentPrice).add(fullPrice);
						
						if(obj.Price<obj.ListPrice)
							regularPrice.show();
						if(obj.BestInstallmentNumber>1)
							installmentPrice.show();
						else
							fullPrice.show();
						
						prodPriceElem.html(popHtml);
					}
					else
						log("[3] Não foi possível obter a imagem p/ o sku “"+skuId+"”.");
				},
				"error":function()
				{
					log("Não foi possível obter a imagem p/ o sku “"+skuId+"”.");
				}
			});
		},
		numberFormat:function(val)
		{
			var out="",_char="", thousandsFormatted="", values, numbers, i, numLength, thousandsSeparator;
		
			values=val.toFixed(2).split(".");
			numbers=values[0].split("");
			i=0;
			numLength=numbers.length;
			thousandsSeparator=".";
			
			for (var j=values[0].length; j>0 ;j--)
			{
				_char = values[0].substr(j-1,1);
				i++;
				if (i%3==0 && numLength>i)
					_char = thousandsSeparator+_char;
				thousandsFormatted = _char+thousandsFormatted;
			}
			out=thousandsFormatted+","+values[1];
			return out;
		},
		getImageUrl:function(obj, typeId)
		{
			var out=[];
			
			if(obj.Images.length<1)
			{
				log("Não foram encontradas imagens para o SKU: "+obj.Id,"Alerta");
				return out;
			}
			
			for(array in obj.Images)
				for(img in obj.Images[array])
					if(obj.Images[array][img].ArchiveTypeId==typeId)
					{
						out.push(obj.Images[array][img].Path);
						break;
						break;
					}

			return out;
		},
		skuConfigCheckbox:function(skusHtml, skuSpecifications, chks, prodImgElem,prodPriceElem)
		{
			skusHtml.each(function(){
				var skuGroup=jQuery(this);
				var chk=skuGroup.find("[type=radio]");

				for(var sku in skuSpecifications.skus)
					if("False"===skuSpecifications.skus[sku][1])
						chk.filter("[value='"+sku+"']").addClass("item_unavaliable").next("label").addClass("item_unavaliable");

				chk.bind("change",function(){
					var $this,name,skuNdx,specs;
					
					specs=skuSpecifications.specifications>1;
					$this=jQuery(this);
					name=[];
					chk.not($this).attr("checked",false);
					
					// Alterando a imagem do SKU e preço
					skuNdx=$this.val()||"_";
					if(typeof skuSpecifications.skus[skuNdx] == "object" && $this.is(":checked"))
						fns.actionsBySku(skuSpecifications,skuNdx,prodImgElem,prodPriceElem);
					
					if($this.is(":checked"))
					{
						chks.removeClass("sku-picked").next("label").removeClass("sku-picked");
						$this.addClass("sku-picked").next("label").addClass("sku-picked");
						
						if(specs)
						{
							var tmp=[($this.attr("name")||"").replace("espec_",""),($this.val()||"")];
							skusHtml.not(skuGroup).each(function(){
								var tmpArray=[];
								jQuery(this).find("[type=radio]").each(function(){
									var $this=(this);
									tmpArray[tmp[0]]=tmp[1];
									tmpArray[($this.attr("name")||"").replace("espec_","")]=($this.val()||"");
									name.push(tmpArray);
								});
							});
						}
					}
					else
					{
						$this.removeClass("sku-picked").next("label").removeClass("sku-picked");
						if(specs)
							chks.removeClass("item_unavaliable").next("label").removeClass("item_unavaliable");
					}
				});
			});
		},
		skuToCart:function(buyButton,sku,quantity,btnOverlay)
		{
			var qtt=quantity||1;
			
			//Reportando erro
			if(isNaN(parseInt(sku))){if(_console) console.log("[Erro] O SKU não é um número: “"+sku+"”"); return false;}
			if(isNaN(parseInt(qtt))){if(_console) console.log("[Erro] A quantidade deve ser numérica: “"+qtt+"”"); return false;}
			
			var btnOverlayE=btnOverlay||buyButton.siblings(options.btnOverlayElem);
			btnOverlayE.show();

			jQuery.ajax({
				url:"/Site/Carrinho.aspx?idSku="+sku+"&quantidade="+qtt,
				success:function(data){fns.skuToCartAjaxSuccess(btnOverlayE,sku,data); fns.updateCart();},
				error:function(){fns.skuToCartAjaxError(btnOverlayE);}
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
		skuToCartAjaxSuccess:function(btnOverlayE,sku,data,showCart)
		{
			btnOverlayE.hide();

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
		scrollNewItem:function()
		{
			var wrap=listE.parent();
			wrap.stop(true,true).animate({scrollTop:((listE.height()||0))},"fast");
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
			var $data,txt,cart;
			
			$data=jQuery(data);
			txt=$data.find(".total-cart").text();
			totalCartE.text("R$ "+txt.substring(txt.search(/\d/)));
			cart=$data.filter(".cartInfoWrapper");
			
			if(cart.length>0)
				jQuery(".cartInfoWrapper").html(cart.html());
			else
				if(_console) console.log("[Erro] O carrinho não foi atualizado pois “.cartInfoWrapper” não foi encontrado no retorno da requisição.");
			
			cartOverlay.hide();
		},
		displayCart:function()
		{
			options.cartShow(cartE, fns.scrollNewItem);
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
			
			// var item=listE.find("tr:first");
			// item=item.length>0?item:listE.find("li:first");
			
			scrollDownE.unbind("click").bind("click",function(){
				var item=listE.find("tr:first");
				item=item.length>0?item:listE.find("li:first");
				wrap.stop(true,true).animate({scrollTop:"+="+item.outerHeight(true)+"px"},"fast");
			});
			scrollTopE.unbind("click").bind("click",function(){
				var item=listE.find("tr:first");
				item=item.length>0?item:listE.find("li:first");
				wrap.stop(true,true).animate({scrollTop:"-="+item.outerHeight(true)+"px"},"fast");
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
					options.cartShow(cartE,function(){});
				},
				mouseleave:function()
				{
					options.cartHide(cartE,fns.hideCart);
				}
			};
			
			cartE.filter(":not(.mouseActivated)").bind(actions).addClass("mouseActivated");
			showCartBtnE.filter(":not(.mouseActivated)").bind(actions).addClass("mouseActivated");
		},
		onlyCart:function()
		{
			fns.loadCart();
			fns.mouseCartActions();
		}
	};

	if(onlyCart)
		fns.onlyCart();
	else
	{
		switch(options.method)
		{
			case 1:
				fns.buyButtons();
			break;
		}
		
		fns.loadCart();
		fns.mouseCartActions();
		options.callback();
	}
	return $this;
};