/*
* @version 1.6.5
* @date 2011-01-03
*/
if("function"!=typeof(String.prototype.trim))String.prototype.trim=function(){ return this.replace(/^\s+|\s+$/g,""); };

var vtex_cpFunctions=
{
    loadSkuJqxhr:null,
    productOriginalInfo:null,
    productOriginalLink:null,
    onHover:false,
	skuList:[],
	skuQueue:[],
    options:
    {
        productShelf:null, // seletor jQuery da prateleira onde serão encontrados os "<li>" com produto
        productsLi:">ul li", // Seletor jQuery para encontrar as "<li>" a partir do que foi definido em "productShelf"
        ajaxCallback:function(){}, // callback chamado ao concluir com sucesso a requisição ajax
        initCallback:function(){}, // callback chamado ao iniciar a função e fazer todas as funções pertencentes a mesma
        messageRequestFail:"Não foi posssível obter as informações deste item.", // mensagem exibida quando existe falha na requisição
        speedFade:200, // velocidade da transição das imagens
        thumbsQuantity:4, // Quantidade máxima de thumbs a serem exibidos na vitrine
        restoreOriginalDetails:false, // Define se quando o usuário "tirar" o mouse de cima do elemento o valor atual será mantido ou se retornará ao valor oginal do produto.
        currency:"R$ ", // Define o tipo de moeda que será adicionao junto ao valor do produto.
        linkAdjust:function(link){return link.replace(".vtexcommerce","").replace(/:\/\/(?!www)|:\/\/(?!www)/i,"://www.");}, // função para manipular a URL do link
		forceAvailable:false, // Exibir ou não a informação de produto indisponível. Caso seja definido como "true" serão exibidos os dados de preço/parcelamento mesmo p/ um SKU indisponível
		minSkuQttShow:2 // Quantidade miníma de SKUs necessários para exibir as miniaturas
	},
    elem:
    {
        productShelf:null
    },
    init:function(options)
    {
        $.extend(vtex_cpFunctions.options, options);
        // Definindo os elementos
        vtex_cpFunctions.elem.productShelf=$(vtex_cpFunctions.options.productShelf);
        // chamando as funções
        vtex_cpFunctions.createSkuElementsList();
        vtex_cpFunctions.options.initCallback();
    },
    createSkuElementsList:function()
    {
        var productShelf=vtex_cpFunctions.elem.productShelf;
        if(productShelf.length>0)
        {
			productShelf.each(function(){
				var $this=$(this);
				if(!$this.hasClass("vtex-cpIsActivated"))
					vtex_cpFunctions.exec($this);
			});
        }
    },
	exec:function(productShelf)
	{
		productShelf.addClass("vtex-cpIsActivated");
		productShelf.find(vtex_cpFunctions.options.productsLi).each(function(){
			var $this=$(this);
			var skuList=$this.find(".vtex-cpSkuList");
			var productField=$this.find(".vtex-cpProductField");
			var skuArray=productField.find("li").text().split("|");
			
			$this.find(".vtex-cpProductImage img").addClass("vtex-cpOriginalImage");
			skuArrayLength=skuArray.length;

			if(!(skuArrayLength==(vtex_cpFunctions.options.minSkuQttShow-1) && vtex_cpFunctions.options.linkAdjust(skuArray[0].split(";").pop()).trim()==($this.find(".vtex-cpProductLink:first").attr("href")||"").trim()))
				for(var i=0; i<skuArrayLength; i++)
				{
					var tmp=skuArray[i].split(";");
					var skuId=tmp[0]||"";
					var link=tmp[1]||"";
					if(i>=vtex_cpFunctions.options.thumbsQuantity)
					{
						$this.find(".vtex-cpViewMore").addClass("vtex-cpShow").removeClass("vtex-cpHide");
						break;
					}
					else if(skuId!="")
						if(!(skuArrayLength>vtex_cpFunctions.options.thumbsQuantity && i>=(vtex_cpFunctions.options.thumbsQuantity-1)))
							skuList.append(
								vtex_cpFunctions.setThumbs($this,skuId,$("<span class='vtex-cpSkuIds vtex-cpIndex_"+i+" vtex-cpSkuId_"+skuId+(i==0?" vtex-cpFirst":"")+"'><span class='vtex-cpInner'></span></span>"),link)
							);
				}
		});
	},
    setThumbs:function(liElem, skuId, elem, link)
    {
        var overlay=liElem.find(".vtex-cpOverlay");
        elem.addClass("vtex-cpLoadingData");
        vtex_cpFunctions.loadSku(liElem, skuId, overlay, 2, elem, link);
        return elem;
    },
    mouseActions2:function(liElem, skuId, elem, data, link)
    {
        vtex_cpFunctions.setImgThumb(elem, data);
        vtex_cpFunctions.setClass(elem, data);
        elem.bind({
            "mouseenter":function()
            {
				liElem.find(".vtex_cpActiveSku").removeClass("vtex_cpActiveSku");
				elem.addClass("vtex_cpActiveSku");
                vtex_cpFunctions.productOriginalInfo=liElem.find(".vtex-cpProductInfoWrap").children().clone();
                vtex_cpFunctions.productOriginalLink=liElem.find(".vtex-cpProductLink:first").attr("href")||"";
                vtex_cpFunctions.formatInfo(data, liElem, link);
                vtex_cpFunctions.onHover=true;
            }
        });
        if(vtex_cpFunctions.options.restoreOriginalDetails)
            elem.bind({
                "mouseleave":function()
                {
					liElem.find(".vtex_cpActiveSku").removeClass("vtex_cpActiveSku");
                    vtex_cpFunctions.setOriginalElements(liElem);
                    vtex_cpFunctions.onHover=false;
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
                vtex_cpFunctions.loadSku(parent, skuId, overlay);
                vtex_cpFunctions.productOriginalInfo=parent.find(".vtex-cpProductInfoWrap").children().clone();
                vtex_cpFunctions.onHover=true;
            },
            "mouseleave":function()
            {
				parent.find(".vtex_cpActiveSku").removeClass("vtex_cpActiveSku");
                parent.find(".vtex-cpOverlay").hide();
                vtex_cpFunctions.loadSkuJqxhr.abort();
                vtex_cpFunctions.setOriginalElements(parent);
                vtex_cpFunctions.onHover=false;
            }
        });
        
        return elem;
    },
    formatInfo:function(data, liElem, link)
    {
        liElem.addClass("vtex-cpInfoFromSKU");
        var obj=data[0];
        
		if(obj.Availability || vtex_cpFunctions.options.forceAvailable)
        {
            var pInfo=liElem.find(".vtex-cpProductInfo");
            
            pInfo.addClass("vtex-cpShow").removeClass("vtex-cpHide");
            liElem.find(".vtex-cpProductUnavailable").addClass("vtex-cpHide").removeClass("vtex-cpShow");
            
            pInfo.find(".vtex-cpBestPrice").text(vtex_cpFunctions.options.currency+vtex_cpFunctions.numberFormat(obj.Price));
            
            if(obj.Price<obj.ListPrice)
                pInfo.find(".vtex-cpListPriceWrap").addClass("vtex-cpShow").removeClass("vtex-cpHide").find(".vtex-cpListPrice").text(vtex_cpFunctions.options.currency+vtex_cpFunctions.numberFormat(obj.ListPrice));
            else
                pInfo.find(".vtex-cpListPriceWrap").addClass("vtex-cpHide").removeClass("vtex-cpShow");
            
            if(obj.BestInstallmentNumber>1)
            {
                var installment=pInfo.find(".vtex-cpInstallment").addClass("vtex-cpShow").removeClass("vtex-cpHide");
                installment.find(".vtex-cpNumbersOfInstallment").text(obj.BestInstallmentNumber);
                installment.find(".vtex-cpInstallmentValue").text(vtex_cpFunctions.options.currency+vtex_cpFunctions.numberFormat(obj.BestInstallmentValue));
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
        var images=vtex_cpFunctions.getImageUrl(obj, 30);
        var skuImg=liElem.find("img[src*='"+(images[0]||originalImage.attr("src"))+"']");
        var imageExist=(skuImg.length>0)?true:false;
        var img=$('<img src="'+(images[0]||originalImage.attr("src"))+'" alt="" width="'+(originalImage.attr("width")||"")+'" height="'+(originalImage.attr("height")||"")+'" class="vtex-cpSkuImage" style="display:none;" />');
        
		if(link!="")
			liElem.find(".vtex-cpProductLink").attr("href",vtex_cpFunctions.options.linkAdjust(link));
		
        imgOverlay.show();
        if(imageExist)
        {
            originalImage.stop(true).fadeOut(vtex_cpFunctions.options.speedFade);
            imgOverlay.hide();
            liElem.find(".vtex-cpSkuImage").stop(true).fadeOut(vtex_cpFunctions.options.speedFade);
            skuImg.stop(true).fadeTo(vtex_cpFunctions.options.speedFade,1.0);
        }
        else
        {
            img.load(function(){
                if(vtex_cpFunctions.onHover)
                {
                    originalImage.stop(true).fadeOut(vtex_cpFunctions.options.speedFade);
                    imgOverlay.hide();
                    liElem.find(".vtex-cpSkuImage").stop(true).fadeOut(vtex_cpFunctions.options.speedFade);
                    img.stop(true).fadeTo(vtex_cpFunctions.options.speedFade,1.0);
                }
                else
                {
                    imgOverlay.hide();
                    vtex_cpFunctions.setOriginalImg(liElem);
                }
            });
            imgWrap.append(img);
        }
    },
    setOriginalElements:function(liElem)
    {
        if(vtex_cpFunctions.productOriginalInfo!=null && liElem.hasClass("vtex-cpInfoFromSKU"))
        {
            liElem.removeClass("vtex-cpInfoFromSKU").find(".vtex-cpProductInfoWrap").html(vtex_cpFunctions.productOriginalInfo);
            vtex_cpFunctions.setOriginalImg(liElem);
            vtex_cpFunctions.setOriginalLink(liElem);
        }
    },
    setOriginalImg:function(liElem)
    {
        var imageLink=liElem.find(".vtex-cpProductImage");
        imageLink.find(":not(.vtex-cpOriginalImage)").stop(true).fadeOut(vtex_cpFunctions.options.speedFade);
        imageLink.find(".vtex-cpOriginalImage").stop(true).fadeTo(vtex_cpFunctions.options.speedFade,1.0);
    },
    setOriginalLink:function(liElem)
	{
		liElem.find(".vtex-cpProductLink").attr("href", vtex_cpFunctions.productOriginalLink);
	},
    setImgThumb:function(elem, data)
    {
        var img=vtex_cpFunctions.getImageUrl(data[0],3);
        elem.removeClass("vtex-cpLoadingData");
        elem.css("background-image","url('"+img[0]+"')");
        elem.find("span").append('<img src="'+img[0]+'" alt="" class="vtex-cpImgsThumb vtex-cpThumb_'+data[0].Id+'" alt=""/>');
    },
    loadSku:function(liElem, skuId, overlay, action, span, link)
    {
        var _overlay=overlay||{};
        action=action||1;
        span=span||{};
		skuId=skuId.toString().trim();
		
		var indice=$.inArray(skuId, vtex_cpFunctions.skuList);
		if(indice>-1)
		{
			if(typeof(vtex_cpFunctions.skuQueue[indice])=="undefined")
				vtex_cpFunctions.skuQueue[indice]=[];
			vtex_cpFunctions.skuQueue[indice].push({
				"liElem":liElem,
				"skuId":skuId,
				"span":span,
				"link":link
			});
		}
		else
		{
			vtex_cpFunctions.skuList.push(skuId);

			vtex_cpFunctions.loadSkuJqxhr = $.ajax({
				"url":"/produto/sku/"+skuId,
				"data":"json",
				"success":function(data, textStatus, jqXHR)
				{
					if($.browser.msie && typeof(data)!="object" && "object"==typeof(console))
						console.log(vtex_cpFunctions.options.messageRequestFail+"\n skuId: "+skuId+"\n(textStatus:'"+textStatus+"', jqXHR:'"+jqXHR+"', errorThrown:'"+errorThrown+"')");
					else if(jqXHR.status!=0)
					{
						var indice=$.inArray(skuId, vtex_cpFunctions.skuList);
						
						if(typeof(vtex_cpFunctions.skuQueue[indice])=="undefined")
							vtex_cpFunctions.skuQueue[indice]=[];
						vtex_cpFunctions.skuQueue[indice].push({
							"liElem":liElem,
							"skuId":skuId,
							"span":span,
							"link":link
						});
						
						var queueLength=vtex_cpFunctions.skuQueue[indice].length;
						var queue=vtex_cpFunctions.skuQueue[indice];
						for(var i=0; i<queueLength; i++)
						{
							switch(action)
							{
								case 1:
									vtex_cpFunctions.formatInfo(data, queue[i].liElem);
									break;
								case 2:
									vtex_cpFunctions.mouseActions2(queue[i].liElem, queue[i].skuId, queue[i].span, data, queue[i].link);
									break;
							}
						}

						vtex_cpFunctions.options.ajaxCallback();
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
    },
    getImageUrl:function(obj, typeId)
    {
        var out=[];
        for(array in obj.Images)
            for(img in obj.Images[array])
                if(obj.Images[array][img].ArchiveTypeId==typeId)
                {
                    out.push("/arquivos/ids/"+obj.Images[array][img].IdArchive);
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
}


var coresPrateleira={productShelf:".prateleira"}
//inicialização
$(function(){
    vtex_cpFunctions.init(coresPrateleira);
});
$(document).ajaxStop(function(){
    vtex_cpFunctions.init(coresPrateleira);
});