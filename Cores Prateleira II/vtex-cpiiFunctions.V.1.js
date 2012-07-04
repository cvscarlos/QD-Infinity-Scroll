/*
* @author Carlos Vinicius
* @version 1.2
* @date 2011-01-31
*/
if("function"!=typeof(String.prototype.trim))String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};
jQuery.fn.vtexCpII=function(opts)
{
    var defaults=
	{
		productsLi:">ul li", // Seletor jQuery para encontrar as "<li>" a partir do que foi definido em "productShelf" ($(this))
		skuList:".vtex-cpiiSkuList",
		thumbsList:".vtex-cpiiThumbsList",
		thumbsListOverlay:".vtex-cpiiThumbsListOverlay",
		buyButton:".vtex-cpiiBuyButton",
		productImage:".vtex-cpiiProductImage",
		productImageOverlay:".vtex-cpiiProductImageOverlay",
		textOverlay:".vtex-cpiiTextOverlay",
		currency:"R$ ", // Define o tipo de moeda que será adicionao junto ao valor do produto.
		forceAvailable:false, // Exibir ou não a informação de produto indisponível. Caso seja definido como "true" serão exibidos os dados de preço/parcelamento mesmo p/ um SKU indisponível
		ajaxCallback:function(){}, // callback chamado ao concluir com sucesso a requisição ajax
		linkAdjust:function(link){return link.replace(".vtexcommerce","").replace(/:\/\/(?!www)|:\/\/(?!www)/i,"://www.");} // função para manipular a URL do link
	};
    var options=jQuery.extend(defaults, opts);
	var productShelf=$(this);
	var skuQueue={};
	var loadSkuJqxhr=null;
	var imgCount={};
	
	if(productShelf.length<1) return productShelf;
	
	var functions=
	{
		exec:function(productShelf, elems)
		{
			productShelf.addClass("vtex-cpiiIsActivated");
			productShelf.find(options.productsLi).each(function(){
				var $this=$(this);
				var productField=$this.find(".vtex-cpiiProductField");
				var skuArray=productField.find("li").text().split("|");
				var skuArrayLength=skuArray.length;
				for(var i=0; i<skuArrayLength; i++)
				{
					var tmp=skuArray[i].split(";");
					var skuId=tmp[0]||"";
					var link=tmp[1]||"";

					if(skuId!="")
						elems.skuList.append(
							functions.setThumbs($this,skuId,jQuery("<span class='vtex-cpiiSkuIds vtex-cpiiIndex_"+i+" vtex-cpiiSkuId_"+skuId+(i==0?" vtex-cpiiFirst":"")+"'><span class='vtex-cpiiInner'><div class='vtex-cpiiInnerOverlay'></div></span></span>"),link, elems)
						);
				}
			});
		},
		setThumbs:function(liElem, skuId, elem, link, elems)
		{
			elem.addClass("vtex-cpiiLoadingData");
			functions.loadSku(liElem, skuId, elem, link, elems);
			return elem;
		},
		mouseActions:function(liElem, skuId, span, data, link, elems)
		{
			var images=functions.setImgThumb(span, data);
			functions.setClass(span, data);
			span.bind("click",function(){
				span.find(".vtex-cpiiInnerOverlay").show();
				elems.skuList.find(".vtex-cpiiSkuIdsSelected").removeClass("vtex-cpiiSkuIdsSelected");
				span.addClass("vtex-cpiiSkuIdsSelected");
				functions.setBuyLink(data,1,elems);
				functions.setThumbsList(images, data, elems, span);
				functions.formatInfo(data, liElem, link);
			});
			
			return span;
		},
		setBuyLink:function(data,method,elems)
		{
			switch(method)
			{
				case 1:
					elems.buyButton.find(">div").attr("id",data[0].Id);
					elems.buyButton.find("a").attr("href","/Site/Carrinho.aspx?idSku="+data[0].Id);
				break;
			}
		},
		setThumbsList:function(imgs, data, elems, span)
		{
			var imgsQtt=imgs.length;
			var list=elems.thumbsList.find(".vtex-cpiiThumbsList_"+data[0].Id);
			if(list.length<1)
				list=jQuery('<ul class="vtex-cpiiThumbsUl vtex-cpiiThumbsList_'+data[0].Id+'"></ul>');
			list.hide();
			if(!list.hasClass("vtex-cpiiThumbsPopulated"))
			{
				elems.thumbsListOverlay.show();
				var skuId=data[0].Id.toString();
				imgCount[skuId]=0;
				for(var i=0; i<imgsQtt; i++)
					functions.thumbsHtml(imgs[i], data, list, imgsQtt, skuId, i, elems, span);
				list.appendTo(elems.thumbsList);
			}
			else
			{
				elems.thumbsList.find(".vtex-cpiiThumbsUl").hide();
				list.show();
				span.find(".vtex-cpiiInnerOverlay").hide();
			}
		},
		thumbsHtml:function(image, data, list, imgsQtt, skuId, i, elems, span)
		{
			list.addClass("vtex-cpiiThumbsPopulated");
			var img=jQuery('<img src="'+image[0]+'" alt="'+image[2]+'" class="vtex-cpiiThumbsImg vtex-cpiiThumbsImg_'+image[1]+'" />');
			var li=jQuery('<li class="vtex-cpiiThumbsLi'+imgCount[skuId]+'"></li>');
			var a=jQuery('<a href="javascript:void(0);"></a>');
			img.appendTo(a);
			img.load(function(){
				imgCount[skuId]++;
				if(imgCount[skuId]>=imgsQtt)
				{
					elems.thumbsList.find(".vtex-cpiiThumbsUl").hide();
					list.show();
					elems.thumbsListOverlay.hide();
					span.find(".vtex-cpiiInnerOverlay").hide();
				}
			});
			img.bind("click",function(){
				var imgs=functions.getImageUrl(data[0],30);
				elems.productImageOverlay.show();
				elems.productImage.find("img").load(function(){
					elems.productImageOverlay.hide();
				}).attr("src",imgs[i][0]);
			});
			a.appendTo(li);
			li.appendTo(list);
		},
		setImgThumb:function(elem, data)
		{
			var imgs=functions.getImageUrl(data[0],3);
			elem.removeClass("vtex-cpiiLoadingData");
			elem.css("background-image","url('"+imgs[0][0]+"')");
			elem.find(".vtex-cpiiInner").append('<img src="'+imgs[0][0]+'" alt="" class="vtex-cpiiImgsThumb vtex-cpiiThumb_'+data[0].Id+'" alt=""/>');
			return imgs;
		},
		setClass:function(elem, data)
		{
			var name=(data[0].Name||"").replace(/[^a-zA-Z0-9\-\_]/g,"");
			elem.addClass("vtex-cpii_"+name);
		},
		getImageUrl:function(obj, typeId)
		{
			var out=[];
			for(array in obj.Images)
				for(img in obj.Images[array])
					if(obj.Images[array][img].ArchiveTypeId==typeId)
					{
						out.push(["/arquivos/ids/"+obj.Images[array][img].IdArchive, obj.Images[array][img].IdArchive, obj.Images[array][img].Name]);
						break;
						break;
					}

			return out;
		},
		formatInfo:function(data, liElem, link)
		{
			liElem.addClass("vtex-cpiiInfoFromSKU");
			var obj=data[0];
			
			if(obj.Availability || options.forceAvailable)
			{
				var pInfo=liElem.find(".vtex-cpiiProductInfo");
				
				pInfo.addClass("vtex-cpiiShow").removeClass("vtex-cpiiHide");
				liElem.find(".vtex-cpiiProductUnavailable").addClass("vtex-cpiiHide").removeClass("vtex-cpiiShow");
				
				pInfo.find(".vtex-cpiiBestPrice").text(options.currency+functions.numberFormat(obj.Price));
				
				if(obj.Price<obj.ListPrice)
					pInfo.find(".vtex-cpiiListPriceWrap").addClass("vtex-cpiiShow").removeClass("vtex-cpiiHide").find(".vtex-cpiiListPrice").text(options.currency+functions.numberFormat(obj.ListPrice));
				else
					pInfo.find(".vtex-cpiiListPriceWrap").addClass("vtex-cpiiHide").removeClass("vtex-cpiiShow");
				
				if(obj.BestInstallmentNumber>1)
				{
					var installment=pInfo.find(".vtex-cpiiInstallment").addClass("vtex-cpiiShow").removeClass("vtex-cpiiHide");
					installment.find(".vtex-cpiiNumbersOfInstallment").text(obj.BestInstallmentNumber);
					installment.find(".vtex-cpiiInstallmentValue").text(options.currency+functions.numberFormat(obj.BestInstallmentValue));
					pInfo.find(".vtex-cpiiFullRegularPrice").addClass("vtex-cpiiHide").removeClass("vtex-cpiiShow");
				}
				else
				{
					pInfo.find(".vtex-cpiiInstallment").addClass("vtex-cpiiHide").removeClass("vtex-cpiiShow");
					pInfo.find(".vtex-cpiiFullRegularPrice").addClass("vtex-cpiiShow").removeClass("vtex-cpiiHide")
				}
			}
			else
			{
				liElem.find(".vtex-cpiiProductInfo").addClass("vtex-cpiiHide").removeClass("vtex-cpiiShow");
				liElem.find(".vtex-cpiiProductUnavailable").addClass("vtex-cpiiShow").removeClass("vtex-cpiiHide");
			}
			
			if(link!="")
				liElem.find(".vtex-cpiiProductLink").attr("href",options.linkAdjust(link));
		},
		loadSku:function(liElem, skuId, span, link, elems)
		{
			span=span||jQuery("");
			skuId=skuId.toString().trim();
			
			var skuIdString=skuId.toString();
			if("undefined"!=typeof(skuQueue[skuIdString]))
			{
				skuQueue[skuIdString].push({
					"liElem":liElem,
					"skuId":skuId,
					"span":span,
					"link":link
				});
			}
			else
			{
				skuQueue[skuIdString]=[];

				loadSkuJqxhr = $.ajax({
					"url":"/produto/sku/"+skuId,
					"data":"json",
					"success":function(data, textStatus, jqXHR)
					{
						if($.browser.msie && typeof(data)!="object" && "object"==typeof(console))
							console.log(vtex_cpFunctions.options.messageRequestFail+"\n skuId: "+skuId+"\n(textStatus:'"+textStatus+"', jqXHR:'"+jqXHR+"', errorThrown:'"+errorThrown+"')");
						else if(jqXHR.status!=0)
						{
							skuQueue[skuIdString].push({
								"liElem":liElem,
								"skuId":skuId,
								"span":span,
								"link":link
							});
							
							var queueLength=skuQueue[skuIdString].length;
							var queue=skuQueue[skuIdString];
							for(var i=0; i<queueLength; i++)
								functions.mouseActions(queue[i].liElem, queue[i].skuId, queue[i].span, data, queue[i].link, elems);

							skuQueue[skuIdString]=undefined;
							options.ajaxCallback();
						}
					},
					"error":function(jqXHR, textStatus, errorThrown)
					{
						if(!$.browser.msie && "object"==typeof(console)) 
							console.log(vtex_cpFunctions.options.messageRequestFail+"\n skuId: "+skuId+"\n(textStatus:'"+textStatus+"', jqXHR:'"+jqXHR+"', errorThrown:'"+errorThrown+"')");
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
		}
	};
	
	productShelf.each(function(){
		
		var $this=$(this);
		if(!$this.hasClass("vtex-cpiiIsActivated"))
		{
			functions.exec($this, {
				skuList:$this.find(options.skuList),
				thumbsList:$this.find(options.thumbsList),
				thumbsListOverlay:$this.find(options.thumbsListOverlay),
				buyButton:$this.find(options.buyButton),
				productImage:$this.find(options.productImage),
				productImageOverlay:$this.find(options.productImageOverlay),
				textOverlay:$this.find(options.textOverlay)
			});
		}
	});

	return productShelf;
};