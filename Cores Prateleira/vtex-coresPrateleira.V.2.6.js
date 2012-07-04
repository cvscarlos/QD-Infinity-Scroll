/**
* Cores Na Prateleira
* @author Carlos Vinicius
* @version 2.7
* @date 2011-04-17
*/
if("function"!==typeof(String.prototype.trim))String.prototype.trim=function(){ return this.replace(/^\s+|\s+$/g,""); };
jQuery.fn.coresPrateleira=function(opts)
{
	var _console="object"===typeof(console);
	var $e=jQuery("");
	var fn=
	{
		loadSkuJqxhr:null,
		productOriginalInfo:null,
		productOriginalLink:null,
		productOriginalSave:null,
		onHover:false,
		skuList:[],
		skuQueue:[],
		productShelf:null,
		options:
		{
			productsLi:">ul li", // Seletor jQuery para encontrar as "<li>" a partir do que foi definido em "productShelf"
			ajaxCallback:function(){}, // callback chamado ao concluir com sucesso a requisição ajax
			initCallback:function(){}, // callback chamado ao iniciar a função e fazer todas as funções pertencentes a mesma
			messageRequestFail:"Não foi posssível obter as informações deste item.", // mensagem exibida quando existe falha na requisição
			saveText:"Economize: R$ #value", // Texto de "economize"
			speedFade:200, // velocidade da transição das imagens
			thumbsQuantity:4, // Quantidade máxima de thumbs a serem exibidos na vitrine
			restoreOriginalDetails:false, // Define se quando o usuário "tirar" o mouse de cima do elemento o valor atual será mantido ou se retornará ao valor oginal do produto.
			currency:"R$ ", // Define o tipo de moeda que será adicionao junto ao valor do produto.
			// função para manipular a URL do link
			linkAdjust:function(link)
			{
				return (document.location.href.indexOf(".vtexcommerce")>-1)?link:link.replace(".vtexcommerce","").replace(/:\/\/(?!www)|:\/\/(?!www)/i,"://www.");
			},
			forceAvailable:false, // Exibir ou não a informação de produto indisponível. Caso seja definido como "true" serão exibidos os dados de preço/parcelamento mesmo p/ um SKU indisponível
			forceImgList:false, // Força a exibição das miniaturas mesmo quando o produto esta esgotado, esta regra é ignorada quando "forceImgList" esta como "true"
			minSkuQttShow:2, // Quantidade miníma de SKUs necessários para exibir as miniaturas
			productImgId:30, // Id do tamanho da imagem a ser exibida na prateleira
			thumbImgId:3 // Id do thumb a ser exibido abaixo da foto do produto
		},
		init:function(options)
		{
			$.extend(fn.options, options);
			// chamando as funções
			fn.createSkuElementsList();
			fn.options.initCallback();
		},
		createSkuElementsList:function()
		{
			var productShelf=fn.productShelf;
			if(productShelf.length>0)
			{
				productShelf.each(function(){
					var $this=jQuery(this);
					if(!$this.hasClass("vtex-cpIsActivated"))
						fn.exec($this);
				});
			}
		},
		exec:function(productShelf)
		{
			var productsList=productShelf.find(fn.options.productsLi);
			// Reporting Errors
			if(productsList.length<1){if(_console) console.log("[Erro] Prateleira na encontrada \n ("+productsList.selector+")"); return false;}
			
			productShelf.addClass("vtex-cpIsActivated");
			productsList.each(function(){
				var $this=jQuery(this);
				var skuList=$this.find(".vtex-cpSkuList");
				var productField=$this.find(".vtex-cpProductField");
				var skuArray=productField.find("li").text().split("|");
				
				$this.find(".vtex-cpProductImage img").addClass("vtex-cpOriginalImage");
				skuArrayLength=skuArray.length;

				if(fn.options.forceAvailable || fn.options.forceImgList)
					skuList.addClass("vtex-cpShow").removeClass("vtex-cpHide");

				if(!(skuArrayLength==(fn.options.minSkuQttShow-1) && fn.options.linkAdjust(skuArray[0].split(";").pop()).trim()==($this.find(".vtex-cpProductLink:first").attr("href")||"").trim()))
					for(var i=0; i<skuArrayLength; i++)
					{
						var tmp=skuArray[i].split(";");
						var skuId=tmp[0]||"";
						var link=tmp[1]||"";
						if(i>=fn.options.thumbsQuantity)
						{
							$this.find(".vtex-cpViewMore").addClass("vtex-cpShow").removeClass("vtex-cpHide");
							break;
						}
						else if(skuId!="")
							if(!(skuArrayLength>fn.options.thumbsQuantity && i>=(fn.options.thumbsQuantity-1)))
								skuList.append(
									fn.setThumbs($this,skuId,jQuery("<span class='vtex-cpSkuIds vtex-cpIndex_"+i+" vtex-cpSkuId_"+skuId+(i==0?" vtex-cpFirst":"")+"'><span class='vtex-cpInner'></span><span class='vtex-cpInner2'></span></span>"),link)
								);
					}
			});
		},
		setThumbs:function(liElem, skuId, elem, link)
		{
			var overlay=liElem.find(".vtex-cpOverlay");
			elem.addClass("vtex-cpLoadingData");
			fn.loadSku(liElem, skuId, overlay, 2, elem, link);
			return elem;
		},
		mouseActions2:function(liElem, skuId, elem, data, link)
		{
			fn.setImgThumb(elem, data);
			fn.setClass(elem, data);
			elem.bind({
				"mouseenter":function()
				{
					liElem.find(".vtex_cpActiveSku").removeClass("vtex_cpActiveSku");
					elem.addClass("vtex_cpActiveSku");
					fn.productOriginalInfo=liElem.find(".vtex-cpProductInfoWrap").children().clone();
					fn.productOriginalLink=liElem.find(".vtex-cpProductLink:first").attr("href")||"";
					var cpSave=liElem.find(".vtex-cpSave");
					fn.productOriginalSave=[(cpSave.html()||""),(cpSave.attr("class")||"")];
					fn.formatInfo(data, liElem, link);
					fn.onHover=true;
				}
			});
			if(fn.options.restoreOriginalDetails)
				elem.bind({
					"mouseleave":function()
					{
						liElem.find(".vtex_cpActiveSku").removeClass("vtex_cpActiveSku");
						fn.setOriginalElements(liElem);
						fn.onHover=false;
					}
				});
			
			return elem;
		},
		mouseActions:function(parent, skuId, elem)
		{
			elem.bind({
				"mouseenter":function()
				{
					parent.find(".vtex_cpActiveSku").removeClass("vtex_cpActiveSku");
					elem.addClass("vtex_cpActiveSku");
					var overlay=parent.find(".vtex-cpOverlay").show();
					fn.loadSku(parent, skuId, overlay);
					fn.productOriginalInfo=parent.find(".vtex-cpProductInfoWrap").children().clone();
					fn.onHover=true;
				},
				"mouseleave":function()
				{
					parent.find(".vtex_cpActiveSku").removeClass("vtex_cpActiveSku");
					parent.find(".vtex-cpOverlay").hide();
					fn.loadSkuJqxhr.abort();
					fn.setOriginalElements(parent);
					fn.onHover=false;
				}
			});
			
			return elem;
		},
		formatInfo:function(data, liElem, link)
		{
			liElem.addClass("vtex-cpInfoFromSKU");
			var obj=data[0];
			
			if(obj.Availability || fn.options.forceAvailable)
			{
				var pInfo=liElem.find(".vtex-cpProductInfo");
				
				pInfo.addClass("vtex-cpShow").removeClass("vtex-cpHide");
				liElem.find(".vtex-cpProductUnavailable").addClass("vtex-cpHide").removeClass("vtex-cpShow");
				
				pInfo.find(".vtex-cpBestPrice").text(fn.options.currency+fn.numberFormat(obj.Price));
				
				liElem.find(".vtex-cpSave").html(fn.options.saveText.replace("#value",fn.numberFormat(obj.ListPrice-obj.Price)));
				if(obj.Price<obj.ListPrice)
				{
					pInfo.find(".vtex-cpListPriceWrap").addClass("vtex-cpShow").removeClass("vtex-cpHide").find(".vtex-cpListPrice").text(fn.options.currency+fn.numberFormat(obj.ListPrice));
					liElem.find(".vtex-cpSave").addClass("vtex-cpShow").removeClass("vtex-cpHide");
				}
				else
				{
					pInfo.find(".vtex-cpListPriceWrap").addClass("vtex-cpHide").removeClass("vtex-cpShow");
					liElem.find(".vtex-cpSave").addClass("vtex-cpHide").removeClass("vtex-cpShow");
				}
				
				if(obj.BestInstallmentNumber>1)
				{
					var installment=pInfo.find(".vtex-cpInstallment").addClass("vtex-cpShow").removeClass("vtex-cpHide");
					installment.find(".vtex-cpNumbersOfInstallment").text(obj.BestInstallmentNumber);
					installment.find(".vtex-cpInstallmentValue").text(fn.options.currency+fn.numberFormat(obj.BestInstallmentValue));
					pInfo.find(".vtex-cpFullRegularPrice").addClass("vtex-cpHide").removeClass("vtex-cpShow");
				}
				else
				{
					pInfo.find(".vtex-cpInstallment").addClass("vtex-cpHide").removeClass("vtex-cpShow");
					pInfo.find(".vtex-cpFullRegularPrice").addClass("vtex-cpShow").removeClass("vtex-cpHide")
				}
				
			}
			else
			{
				liElem.find(".vtex-cpProductInfo").addClass("vtex-cpHide").removeClass("vtex-cpShow");
				liElem.find(".vtex-cpProductUnavailable").addClass("vtex-cpShow").removeClass("vtex-cpHide");
			}
			
			var imgWrap=liElem.find(".vtex-cpProductImage");
			var imgOverlay=liElem.find(".vtex-cpImgOverlay");
			var originalImage=imgWrap.find(".vtex-cpOriginalImage");
			var _originalImage=originalImage[0];
			var originalImage2=originalImage.clone();
			var imgWidth=(originalImage2.attr("width")||_originalImage.naturalWidth);
			var imgHeight=(originalImage2.attr("height")||_originalImage.naturalHeight);
			var images=fn.getImageUrl(obj, fn.options.productImgId);
			var skuImg=liElem.find("img[src*='"+(images[0]||originalImage.attr("src"))+"']");
			var imageExist=(skuImg.length>0)?true:false;
			var img=jQuery('<img src="'+(images[0]||originalImage.attr("src"))+'" alt="" '+(("undefined"!==typeof imgWidth)?'width="'+imgWidth+'"':"")+' '+(("undefined"!==typeof imgHeight)?'height="'+imgHeight+'"':"")+' class="vtex-cpSkuImage" style="display:none;" />');
			
			if(link!="")
				liElem.find(".vtex-cpProductLink").attr("href",fn.options.linkAdjust(link));
			
			imgOverlay.show();
			if(imageExist)
			{
				originalImage.stop(true).fadeOut(fn.options.speedFade);
				imgOverlay.hide();
				liElem.find(".vtex-cpSkuImage").stop(true).fadeOut(fn.options.speedFade);
				skuImg.stop(true).fadeTo(fn.options.speedFade,1.0);
			}
			else
			{
				img.load(function(){
					if(fn.onHover)
					{
						originalImage.stop(true).fadeOut(fn.options.speedFade);
						imgOverlay.hide();
						liElem.find(".vtex-cpSkuImage").stop(true).fadeOut(fn.options.speedFade);
						img.stop(true).fadeTo(fn.options.speedFade,1.0);
					}
					else
					{
						imgOverlay.hide();
						fn.setOriginalImg(liElem);
					}
				});
				imgWrap.append(img);
			}
		},
		setOriginalElements:function(liElem)
		{
			if(fn.productOriginalInfo!=null && liElem.hasClass("vtex-cpInfoFromSKU"))
			{
				liElem.removeClass("vtex-cpInfoFromSKU").find(".vtex-cpProductInfoWrap").html(fn.productOriginalInfo);
				fn.setOriginalImg(liElem);
				fn.setOriginalLink(liElem);
				fn.setOriginalSaveText(liElem);
			}
		},
		setOriginalImg:function(liElem)
		{
			var imageLink=liElem.find(".vtex-cpProductImage");
			imageLink.find(":not(.vtex-cpOriginalImage)").stop(true).fadeOut(fn.options.speedFade);
			imageLink.find(".vtex-cpOriginalImage").stop(true).fadeTo(fn.options.speedFade,1.0);
		},
		setOriginalLink:function(liElem)
		{
			liElem.find(".vtex-cpProductLink").attr("href", fn.productOriginalLink);
		},
		setOriginalSaveText:function(liElem)
		{
			liElem.find(".vtex-cpSave").html(fn.productOriginalSave[0]).attr("class",fn.productOriginalSave[1]);
		},
		setImgThumb:function(elem, data)
		{
			var img=fn.getImageUrl(data[0],fn.options.thumbImgId);
			elem.removeClass("vtex-cpLoadingData");
			if(img.length>0)
			{
				elem.css("background-image","url('"+img[0]+"')");
				elem.find(".vtex-cpInner").append('<img src="'+img[0]+'" alt="" class="vtex-cpImgsThumb vtex-cpThumb_'+data[0].Id+'" alt=""/>');
			}
		},
		loadSku:function(liElem, skuId, overlay, action, span, link)
		{
			var _overlay=overlay||{};
			action=action||1;
			span=span||$e;
			skuId=skuId.toString().trim();
			
			var skuIdString=skuId.toString();
			if("undefined"!==typeof(fn.skuQueue[skuIdString]))
			{
				fn.skuQueue[skuIdString].push({
					"liElem":liElem,
					"skuId":skuId,
					"span":span,
					"link":link
				});
			}
			else
			{
				fn.skuQueue[skuIdString]=[];

				fn.loadSkuJqxhr = $.ajax({
					"url":"/produto/sku/"+skuId,
					"data":"json",
					"success":function(data, textStatus, jqXHR)
					{
						if("object"!==typeof data)
						{
							if(_console)
								console.log(fn.options.messageRequestFail+"\n skuId: "+skuId+"\n(textStatus:'"+textStatus+"', jqXHR:'"+jqXHR+"')");
							span.hide();
							return false;
						}
						else if(jqXHR.status!=0)
						{
							fn.skuQueue[skuIdString].push({
								"liElem":liElem,
								"skuId":skuId,
								"span":span,
								"link":link
							});
							
							var queueLength=fn.skuQueue[skuIdString].length;
							var queue=fn.skuQueue[skuIdString];
							for(var i=0; i<queueLength; i++)
							{
								switch(action)
								{
									case 1:
										fn.formatInfo(data, queue[i].liElem);
										break;
									case 2:
										fn.mouseActions2(queue[i].liElem, queue[i].skuId, queue[i].span, data, queue[i].link);
										break;
								}
							}

							fn.skuQueue[skuIdString]=undefined;
							fn.options.ajaxCallback();
						}
					},
					"error":function(jqXHR, textStatus, errorThrown)
					{
						if(_console) 
							console.log(fn.options.messageRequestFail+"\n skuId: "+skuId+"\n(textStatus:'"+textStatus+"', jqXHR:'"+jqXHR+"', errorThrown:'"+errorThrown+"')");
						span.hide();
					}
				});
			}
		},
		numberFormat:function(val)
		{
			var out="",_char="", thousandsFormatted="";
			var values=val.toFixed(2).split(".");
			var numbers=values[0].split("");
			var i=0;
			var numLength=numbers.length;
			var thousandsSeparator=".";
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
				if(_console) console.log("[Erro] Não foram encontradas imagens para o SKU: "+obj.Id);
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
		setClass:function(elem, data)
		{
			var name=data[0].Name.replace(/[^a-zA-Z0-9\-\_]/g,"");
			elem.addClass("vtex-cp_"+name);
		}
	};
	
	fn.productShelf=jQuery(this);
	fn.init(opts);
	return jQuery(this);
};