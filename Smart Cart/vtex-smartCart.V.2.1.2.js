/**
* PopUps
* @author Carlos Vinicius
* @version 1.9
* @date 2012-03-14
*/
jQuery.fn.vtexPopUp2=function(h){var f=jQuery("body"),c=jQuery(this),d=f.find(".boxPopUp2"),j="object"==typeof console;if(1>c.length)return c;1>d.length&&(d=jQuery('<div class="boxPopUp2"><div class="boxPopUp2-wrap"><span class="boxPopUp2-close"></span><div class="boxPopUp2-content"></div></div></div>'),f.prepend(d),d.after('<div class="boxPopUp2-overlay"></div>'));var b=jQuery.extend({popupType:null,closeContent:null,popupClass:"",initCallback:function(){},closeCallback:function(){}},h),h=d.find(".boxPopUp2-close"),
e=d.find(".boxPopUp2-content"),k=f.find(".boxPopUp2-close, .boxPopUp2-overlay"),l=f.find(".boxPopUp2-overlay"),i=jQuery(document);null!=b.closeContent&&h.html(b.closeContent);var a={positioning:function(){var a=i.scrollTop(),b=jQuery(window).height(),c=d.outerHeight(true);d.css("top",a+(c>=b?20:(b-c)/2)+"px")},show:function(b){b=b||{};l.fadeTo("fast",0.5,function(){d.show().addClass("popupOpened");"boolean"===typeof b.loading&&b.loading===true?a.showLoading():a.hideLoading()})},hideLoading:function(){e.filter(":visible").css("background-image",
"none")},showLoading:function(){e.filter(":visible").css("background-image",'url("/arquivos/ajax-loader.gif")')},close:function(a){var a=a||{},b=function(){l.fadeOut("fast");d.fadeOut("fast",function(){e.empty()});e.attr("class","boxPopUp2-content");d.attr("class","boxPopUp2")};typeof a.closeNow=="boolean"&&a.closeNow==true&&b();if(k.filter(".boxPopUp2-clickActive").length<1){k.addClass("boxPopUp2-clickActive").bind("click",function(){"function"===typeof a.clickCallback&&a.clickCallback();b()});i.bind("keyup",
function(a){(a.keyCode?a.keyCode:a.which)==27&&b()})}},setType:function(){if(c.hasClass("quickViewLink"))a.quickView();else if(c.hasClass("giftListWrap"))a.giftList();else if(c.hasClass("installmentInfoTpl"))a.paymentForms();else if(c.hasClass("shipping-value"))a.calculateShipping();else if(c.hasClass("freeContent"))a.freeContent();else if(c.hasClass("boxPopUp2"))a.closeNow();else return true},checkType:function(){"cadastroCliente"===b.popupType||"minhaContaFoto"===b.popupType?a.userAccount():"newsletter"===
b.popupType?a.newsletter():"quickview"===b.popupType?a.quickView():"giftlist"===b.popupType?a.giftList():"paymentforms"===b.popupType?a.paymentForms():"shipping"===b.popupType?a.calculateShipping():"freecontent"===b.popupType?a.freeContent():"closenow"===b.popupType&&a.closeNow()},exec:function(){if(a.setType()){b.initCallback();return true}a.checkType();b.initCallback()},userAccount:function(){var g="";"cadastroCliente"===b.popupType?g="signInPopups":"minhaContaFoto"===b.popupType&&(g="profilePhoto");
c.unbind().removeAttr("onclick");var f=c.attr("href")||"";c.bind("click",function(){d.addClass(g+"Main");""===f&&j&&console.log("N\u00e3o existe URL no atributo href");jQuery('<iframe src="'+f+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(e.addClass(b.popupClass+" "+g));a.show({loading:true});a.positioning();a.close();return false})},newsletter:function(){c.clone().appendTo(e.addClass(b.popupClass+" newsletterPopup"));d.addClass("newsletterMain");a.show();a.positioning();a.close()},
quickView:function(){i.ajaxStop(function(){c.filter(":not(.quickViewLinkActivated)").addClass("quickViewLinkActivated").bind("click",function(){jQuery('<iframe src="'+jQuery(this).attr("href")+'" frameborder="0" allowtransparency="true"></iframe>').appendTo(e.addClass(b.popupClass+" productQuickView"));d.addClass("quickViewMain");a.show({loading:true});a.positioning();a.close();return false})})},paymentForms:function(){var g="",h=function(){var a=f.find(".see-other-payment-method-link");if(a.length<
1){j&&console.log("Url das formas de pagamento n\u00e3o encontrado. \n Verifique se o controle esta na p\u00e1gina.\n("+a.selector+")");return false}g=(a[0].onclick||"#onclickError").toString().split('"')[1]||"#onclickError"};h();c.bind("click",function(){jQuery("<iframe src='"+g+"' frameborder='0' allowtransparency='true'></iframe>").appendTo(e.addClass(b.popupClass+" paymentFormsPopup"));d.addClass("paymentFormsMain");a.show({loading:true});a.positioning();a.close();return false});i.ajaxStop(h)},
calculateShipping:function(){i.ajaxStop(function(){var c=f.find("#calculoFrete").children();if(c.length<1)return false;c.find("span.cep-busca a").attr("target","_blank");c.appendTo(e.addClass(b.popupClass+" shippingCalculationPopup"));d.addClass("shippingCalculationMain");a.show();a.positioning();a.close()})},giftList:function(){c.appendTo(e.addClass(b.popupClass+" giftListPopup"));d.addClass("giftListMain");a.show();a.positioning();a.close({clickCallback:b.closeCallback})},freeContent:function(){c.appendTo(e.addClass(b.popupClass+
" freeContentPopup"));d.addClass("freeContentMain");a.show();a.positioning();a.close()},closeNow:function(){a.close({closeNow:true})}};a.exec();return c};
/**
* Vtex Smart Cart
* @author Carlos Vinicius
* @version 2.1.2
* @date 2011-06-27
*/
"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});
var vtexscCartHideTimeOut=0;
jQuery.fn.smartCart=function(opts)
{
    var defaults=
	{
		method:1,
		htmlFormat:1, // 1 = UL, 2= Tabela
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
		// Estrutura do conteúdo do popup. Recebe como parâmetro os SKUs obtidos através do método "getSkuHtml"
		formatSkuPopup:function($skuList)
		{
			var wrap=jQuery('<div class="skuWrap_"><div class="selectSkuTitle">Selecione a variação do produto</div></div>');
			var listWrap=jQuery('<div class="skuListWrap_"></div>');
			var btn=jQuery('<div class="vtexsc-buttonWrap clearfix"><a href="#" class="vtexsc-buyButton"></a></div>');
			$skuList.appendTo(listWrap);
			listWrap.appendTo(wrap);
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
		onlyCart=false;
	
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
		totalCartE=jQuery(options.totalCart)||$empty,
		cartText=jQuery("<span class='vtexsc-text'></span>"),
		cartOverlay=jQuery("<div class='vtexsc-overlay'></div>"),
		buyButtonE=$empty;
	
	totalCartE.html(cartText).append(cartOverlay);
	// totalCartE=cartText;
	
	var fns=
	{
		buyButtons:function()
		{
			$this.each(function(){
				var btn=jQuery(this);
				if(!btn.hasClass("actionActivated") && fns.buyAsynchronous(btn))
					btn.addClass("actionActivated").bind("click",function(){
						var sku=fns.getSku(btn);
						if(sku.indexOf("javascript:alert(")>-1)
							return true;
						else if(sku!=="")
							fns.skuToCart(btn,sku);
						else
							if(_console) console.log("[Erro] O Sku não foi obtido! A execução parou"); 
						return false;
					});
			});
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
				var url=btn.attr("href")||"";
				// Reportando erros
				if(url==""){if(_console) console.log("[Erro] Não foi possível obter a URL para a página do produto \n método: multiplesSkus"); return false;}
				
				var btnOverlayE=btn.siblings(options.btnOverlayElem).show();
				
				jQuery.ajax({
					url:url,
					success:function(data){fns.productSuccess(data,url,btnOverlayE);},
					error:function()
					{
						if(_console) console.log("Erro ao requisitar a página do produto via Ajax");
					}
				});
				
				return false;
			});
		},
		productSuccess:function(data,url,btnOverlayE)
		{
			$data=jQuery(data);
			var skuOptions=options.getSkuHtml($data);
			var located=false;
			var skuSpecifications=null;

			$data.filter("script:not([src])").each(function(){
				var text=$(this).text();
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
				if(_console) console.log("[ERRO] Não foi possível localizar as especificações do SKU. \n A página será redirecionada!");
				setTimeout(function(){document.location.href=url;},500);
				return false;
			}
			
			options.formatSkuPopup(skuOptions).addClass("freeContent").vtexPopUp2();
			skuSpecifications=fns.specificationsReorder(skuSpecifications);
			buyButtonE=jQuery(options.buyButton)||$empty;
			
			var chks=skuOptions.find("[type=checkbox]");
			if(chks.length>0)
			{
				btnOverlayE.hide();
				fns.skuConfigCheckbox(skuOptions, skuSpecifications, chks);
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
					if(_console) console.log("Este plugin ainda não suporta mais de uma opção SKU");
					fields.each(function(){
						// console.log($(this));
					});
				}
				
				return false;
			});
		},
		specificationsReorder:function(sku)
		{
			var out={};
			
			// Specifications
			if("undefined"!==typeof sku.specifications)
				out.specifications=sku.specifications;
			else
				if(_console) console.log("[Erro] Não foi localizado o item “specifications” do objeto com as especificações de SKU.");
			// Combination
			if("undefined"!==typeof sku.combination)
			{
				var q=sku.combination.length;
				out.combination={};
				for(var i=0; i<q; i++)
					for(var k in sku.combination[i])
						out.combination[k]=sku.combination[i][k].split(",");
			}
			else
				if(_console) console.log("[Erro] Não foi localizado o item “combination” do objeto com as especificações de SKU.");
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
				if(_console) console.log("[Erro] Não foi localizado o item “skus” do objeto com as especificações de SKU.");
		
			return out;
		},
		getSku:function(btn)
		{
			if(btn.hasClass("asynchronousBuyButton"))
				return (btn.attr("id")||"").replace("idprod","");
			else
				return (btn.attr("href")||"").split("ku=").pop().split("&").shift();
		},
		skuConfigCheckbox:function(skusHtml, skuSpecifications, chks)
		{
			skusHtml.each(function(){
				var skuGroup=$(this);
				var chk=skuGroup.find("[type=checkbox]");
				var specs=skuSpecifications.specifications>1;

				if(!specs)
				{
					for(var sku in skuSpecifications.skus)
						if("False"===skuSpecifications.skus[sku][1])
							chk.filter("[value='"+sku+"']").addClass("item_unavaliable").next("label").addClass("item_unavaliable");
				}
				else
					if(_console) console.log("Este plugin ainda não suporta mais de uma opção SKU");
						
				chk.bind("change",function(){
					var $this=$(this);
					var name=[];
					chk.not($this).attr("checked",false);
					
					if($this.is(":checked"))
					{
						chks.removeClass("sku-picked").next("label").removeClass("sku-picked");
						$this.addClass("sku-picked").next("label").addClass("sku-picked");
						
						if(specs)
						{
							var tmp=[($this.attr("name")||"").replace("espec_",""),($this.val()||"")];
							skusHtml.not(skuGroup).each(function(){
								var tmpArray=[];
								$(this).find("[type=checkbox]").each(function(){
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
			var $data=jQuery(data);
			totalCartE.text($data.find(".total-cart").text());
			console.log(totalCartE);
			var cart=$data.filter(".cartInfoWrapper");
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
			
			var item=listE.find("tr:first");
			item=item.length>0?item:listE.find("li:first");
			
			scrollDownE.unbind("click").bind("click",function(){
				wrap.stop(true,true).animate({scrollTop:"+="+item.outerHeight(true)+"px"},"fast");
			});
			scrollTopE.unbind("click").bind("click",function(){
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
	var scOptions={htmlFormat:2, qttText:"", textRemove:"", textMoreOne:"", textMinusOne:"", cartHide:function(elem, hideFunction){clearTimeout(vtexscCartHideTimeOut);vtexscCartHideTimeOut=setTimeout(function(){hideFunction(elem);},2000);}};
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