/**
* Inifinity Scroll
* @author Carlos Vinicius
* @version 2.0
* @date 2011-03-06
*/
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){ return this.replace(/^\s+|\s+$/g,""); };

jQuery.fn.infinitScroll=function(opts)
{
	var defaults=
	{
		toTop:"#returnToTop", // Elemento que contém o botão de voltar ao topo
		lastShelf:".prateleira:last", // Última prateleira/vitrine na página
		elemLoading:'<div id="scrollLoading">Carregando ... </div>', // Elemento com mensagem de carregando ao iniciar a requisição da página seguinte
		searchUrl:null, // Opção p/ definir a URL manualmente, ficando automático apenas a paginação. A url deve terminar com "...&PageNumber="
		callback:function(){},
		// Cálculo do tamanho do footer para que uam nova página seja chamada antes do usuário chegar ao "final" do site
		getShelfHeight:function()
		{
			return ($this.scrollTop()+$this.height());
		}
	};
    var options=jQuery.extend(defaults, opts),
		$this=jQuery(this),
		$empty=jQuery(""),
		_console="object"===typeof(console);
		
	// Reportando erros
	if($this.length<1)return $this;

	var $window=$(window),
		$document=$(document),
		$b=$("body"),
		toTopE=$b.find(options.toTop),
		elemLoading=jQuery(options.elemLoading),
		moreResults=true;
		currentPage=2;
	
	var fns=
	{
		scrollToTop:function()
		{
			var windowH=$window.height();
			
			$window.bind("resize",function(){
				windowH=$window.height();
			});
			
			$document.bind("scroll",function(){
				if($document.scrollTop()>(windowH))
					toTopE.stop(true).fadeTo(300,1,function(){toTopE.show();});
				else
					toTopE.stop(true).fadeTo(300,0,function(){toTopE.hide();});
			});
			
			toTopE.find("a").bind("click",function(){
				jQuery("html,body").animate({scrollTop:0},"slow");
				return false;
			});
		},
		getSearchUrl:function()
		{
			var url, content, preg;
			jQuery("script:not([src])").each(function(){
				content=jQuery(this)[0].innerHTML;
				preg=/\/buscapagina\?.+&PageNumber=/i;
				if(content.search(/\/buscapagina\?/i)>-1)
				{
					url=preg.exec(content);
					return false;
				}
			});

			if(typeof(url)!=="undefined" && typeof(url[0])!=="undefined")
				return url[0];
			else
			{
				if(_console) console.log("[Erro] Não foi possível localizar a url de busca da página.\n Tente adicionar o .js ao final da página. \n[Método: getSearchUrl]");
				return "";
			}
		},
		infinitScroll:function()
		{
			var elementPages=$b.find(".pager:first").attr("id")||"";
				pages=eval("pagecount_"+elementPages.split("_").pop()),
				searchUrl=(null!==options.searchUrl)?options.searchUrl:fns.getSearchUrl(),
				currentStatus=true;
				
			// Reportando erros
			if("undefined"===typeof pages) console.log("[Erro] Não foi possível localizar quantidade de páginas.\n Tente adicionar o .js ao final da página. \n[Método: infinitScroll]");
				
			$window.bind("scroll",function(){
				if(currentPage<=pages && moreResults)
				{
					if(($window.scrollTop()+$window.height())>=(options.getShelfHeight()) && currentStatus)
					{
						var currentItems=$this.find(options.lastShelf);
						if(currentItems.length<1){if(_console) console.log("[Erro] Última Prateleira/Vitrine não encontrada \n ("+currentItems.selector+")"); return false;}
						
						currentItems.after(elemLoading);
						currentStatus=false;
						jQuery.ajax({
							url: searchUrl+currentPage,
							success:function(data)
							{
								if(data.trim().length<1)
								{
									moreResults=false;
									if(_console) console.log("[Aviso] Não existem mais resultados a partir da página: "+currentPage);
								}
								currentItems.after(data);
								currentStatus=true;
								elemLoading.remove();
							},
							error:function()
							{
								if(_console) console.log("[Error] Houve um erro na requisição Ajax de uma nova página.");
							}
						});
						currentPage++;
					}
				}
				else
					return false;
			});
		}
	};

	fns.scrollToTop();
	fns.infinitScroll();
	return $this;
};