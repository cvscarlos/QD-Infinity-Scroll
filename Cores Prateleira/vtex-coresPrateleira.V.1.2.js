/*
* @version 1.2.3
*/
if("function"!=typeof(String.prototype.trim))String.prototype.trim=function(){ return this.replace(/^\s+|\s+$/g,""); };

var vtex_cpFunctions=
{
    loadSkuJqxhr:null,
    productOriginalInfo:null,
    onHover:false,
    options:
    {
        productShelf:null, // seletor jQuery da prateleira onde serão encontrados os "<li>" com produto
        productsLi:">ul li", // Seletor jQuery para encontrar as "<li>" a partir do que foi definido em "productShelf"
        ajaxCallback:function(){}, // callback chamado ao concluir com sucesso a requisição ajax
        initCallback:function(){}, // callback chamado ao iniciar a função e fazer todas as funções pertencentes a mesma
        messageRequestFail:"Não foi posssível obter as informações deste item.", // mensagem exibida quando existe falha na requisição
        speedFade:200 // velocidade da transição das imagens
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
            productShelf.find(vtex_cpFunctions.options.productsLi).each(function(){
                var $this=$(this);
                var skuList=$this.find(".vtex-cpSkuList");
                var productField=$this.find(".vtex-cpProductField");
                var skuArray=productField.find("li").text().split("|");
                
                $this.find(".vtex-cpProductImage img").addClass("vtex-cpOriginalImage");
                skuArrayLength=skuArray.length;
                for(var i=0; i<skuArrayLength; i++)
                {
                    if(skuArray[i]!="")
                        skuList.append(
                            vtex_cpFunctions.setThumbs($this,skuArray[i], $("<span class='vtex-cpSkuIds vtex-cpSkuId_"+skuArray[i]+(i==0?" vtex-cpFirst":"")+"'><span class='vtex-cpInner'></span></span>"))
                        );
                }
            });
        }
    },
    setThumbs:function(liElem, skuId, elem)
    {
        var overlay=liElem.find(".vtex-cpOverlay");
        elem.addClass("vtex-cpLoadingData");
        vtex_cpFunctions.loadSku(liElem, skuId, overlay, 2, elem);
        return elem;
    },
    mouseActions2:function(liElem, skuId, elem, data)
    {
        vtex_cpFunctions.setImgThumb(elem, data);
        vtex_cpFunctions.setClass(elem, data);
        elem.bind({
            "mouseenter":function()
            {
                vtex_cpFunctions.productOriginalInfo=liElem.find(".vtex-cpProductInfoWrap").children().clone();
                vtex_cpFunctions.formatInfo(data, liElem);
                vtex_cpFunctions.onHover=true;
            },
            "mouseleave":function()
            {
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
                var overlay=parent.find(".vtex-cpOverlay").show();
                vtex_cpFunctions.loadSku(parent, skuId, overlay);
                vtex_cpFunctions.productOriginalInfo=parent.find(".vtex-cpProductInfoWrap").children().clone();
                vtex_cpFunctions.onHover=true;
            },
            "mouseleave":function()
            {
                parent.find(".vtex-cpOverlay").hide();
                vtex_cpFunctions.loadSkuJqxhr.abort();
                vtex_cpFunctions.setOriginalElements(parent);
                vtex_cpFunctions.onHover=false;
            }
        });
        
        return elem;
    },
    formatInfo:function(data, liElem)
    {
        liElem.addClass("vtex-cpInfoFromSKU");
        var obj=data[0];
        if(obj.Availability)
        {
            var pInfo=liElem.find(".vtex-cpProductInfo");
            
            pInfo.addClass("vtex-cpShow").removeClass("vtex-cpHide");
            liElem.find(".vtex-cpProductUnavailable").addClass("vtex-cpHide").removeClass("vtex-cpShow");
            
            pInfo.find(".vtex-cpBestPrice").text(vtex_cpFunctions.numberFormat(obj.Price));
            
            if(obj.Price<obj.ListPrice)
                pInfo.find(".vtex-cpListPriceWrap").addClass("vtex-cpShow").removeClass("vtex-cpHide").find(".vtex-cpListPrice").text(vtex_cpFunctions.numberFormat(obj.ListPrice));
            else
                pInfo.find(".vtex-cpListPriceWrap").addClass("vtex-cpHide").removeClass("vtex-cpShow");
            
            if(pInfo.BestInstallmentNumber>1)
            {
                var installment=pInfo.find(".vtex-cpInstallment").addClass("vtex-cpShow").removeClass("vtex-cpHide");
                installment.find(".vtex-cpNumbersOfInstallment").text(obj.BestInstallmentNumber);
                installment.find(".vtex-cpInstallmentValue").text(vtex_cpFunctions.numberFormat(obj.BestInstallmentValue));
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
        
        imgOverlay.show();
        if(imageExist)
        {
            originalImage.stop(true).fadeOut(vtex_cpFunctions.options.speedFade);
            imgOverlay.hide();
            skuImg.stop(true).fadeTo(vtex_cpFunctions.options.speedFade,1.0);
        }
        else
        {
            img.load(function(){
                if(vtex_cpFunctions.onHover)
                {
                    originalImage.stop(true).fadeOut(vtex_cpFunctions.options.speedFade);
                    imgOverlay.hide();
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
        }
    },
    setOriginalImg:function(liElem)
    {
        var imageLink=liElem.find(".vtex-cpProductImage");
        imageLink.find(":not(.vtex-cpOriginalImage)").stop(true).fadeOut(vtex_cpFunctions.options.speedFade);
        imageLink.find(".vtex-cpOriginalImage").stop(true).fadeTo(vtex_cpFunctions.options.speedFade,1.0);
    },
    setImgThumb:function(elem, data)
    {
        var img=vtex_cpFunctions.getImageUrl(data[0],3);
        elem.removeClass("vtex-cpLoadingData");
        elem.css("background-image","url('"+img[0]+"')");
        elem.find("span").append('<img src="'+img[0]+'" alt="" class="vtex-cpImgsThumb vtex-cpThumb_'+data[0].Id+'" alt=""/>');
    },
    loadSku:function(liElem, skuId, overlay, action, span)
    {
        var _overlay=overlay||{};
        action=action||1;
        span=span||{};

        vtex_cpFunctions.loadSkuJqxhr = $.ajax({
            "url":"/produto/sku/"+skuId.toString().trim(),
            "data":"json",
            "success":function(data, textStatus, jqXHR)
            {
                _overlay.hide();
                if($.browser.msie && typeof(data)!="object" && console)
                    console.log(vtex_cpFunctions.options.messageRequestFail);
                else if(jqXHR.status!=0)
                {
                    switch(action)
                    {
                        case 1:
                            vtex_cpFunctions.formatInfo(data, liElem);
                            break;
                        case 2:
                            vtex_cpFunctions.mouseActions2(liElem, skuId, span, data);
                            break;
                    }
                    vtex_cpFunctions.options.ajaxCallback();
                }
            },
            "error":function(jqXHR, textStatus, errorThrown)
            {
                if(!$.browser.msie && console) 
                    console.log(vtex_cpFunctions.options.messageRequestFail);
            }
        });
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



//inicialização
$(function(){
    vtex_cpFunctions.init({
        productShelf:".prateleira"
    });
});