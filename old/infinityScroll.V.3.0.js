/**
* Infinity Scroll
* @author Carlos Vinicius
* @version 3.0
* @date 2012-11-30
*/
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){ return this.replace(/^\s+|\s+$/g,""); };
(function($){
	jQuery.fn.infinityScroll=function(opts)
	{
		var defaults,log,extTitle,options,$this,$empty,$window, $document, toTopE, elemLoading, moreResults, currentPage;
		
		extTitle="Infinity Scroll";
		log=function(msg,type){
			if(typeof console=="object")
				console.log("!\n["+extTitle+" - "+(type||"Erro")+"] "+msg);
		};
		
		defaults=
		{
			// Última prateleira/vitrine na página
			lastShelf:">div:last",
			// Elemento com mensagem de carregando ao iniciar a requisição da página seguinte
			elemLoading:'<div id="scrollLoading">Carregando ... </div>',
			// Opção p/ definir a URL manualmente, ficando automático apenas a paginação. A url deve terminar com "...&PageNumber="
			searchUrl:null,
			// Objeto jQuery com o botão de voltar ao topo
			returnToTop:$('<div id="returnToTop"><a href="#"><span class="text">voltar ao</span><span class="text2">TOPO</span><span class="arrowToTop"></span></a></div>'),
			// Callback quando uma requisição ajax da prateleira é completada
			callback:function(){},
			// Cálculo do tamanho do footer para que uam nova página seja chamada antes do usuário chegar ao "final" do site
			getShelfHeight:function()
			{
				return ($this.scrollTop()+$this.height());
			},
			// Opção para fazer a paginção manualmente, uma nova página só é chamada quando executado o comando dentro desta função
			// Ela recebe como parâmetro: 1 função que chama a próxima página (caso ela exista)
			paginate:null,
			// Esta função é quem controla onde o conteúdo será inserido. Ela recebe como parâmetro: O ùltimo bloco inserido e os dados da nova requisição AJAX
			insertContent:function(currentItems,ajaxData)
			{
				currentItems.after(ajaxData);
			}
		};
		options=jQuery.extend({},defaults, opts);
		$this=jQuery(this);
		$empty=jQuery("");
			
		if($this.length<1)
			return $this;

		// Checando se existe mais de uma prateleira selecionada
		if($this.length>1)
		{
			log("Identifiquei que a seletor informado ("+$this.selector+") retornou "+$this.length+" elementos.\n Como correto, selecionado o primeiro com o id: #"+($this.filter("[id^=ResultItems]:first").attr("id")||"!Not Found"),"Aviso");
			$this=$this.filter("[id^=ResultItems]:first");
		}
		
		// tentando adivinhar se esta pegando o elemento correto da prateleira
		if(!$this.filter("[id^=ResultItems]").length)
			log("Certifique-se que esta selecionando o elemento correto.\n O plugin espera que o elemento seja o que contém o id: #"+jQuery("div[id^=ResultItems]").attr("id")||"!Not Found","Aviso");
		if($this.parent().filter("[id^=ResultItems]").length)
		{
			log("Identifiquei que o seletor pai do elemento que você informou é o #"+(jQuery("div[id^=ResultItems]").attr("id")||"!Not Found")+".\n Como forma de corrigir esse problema de seleção de elemento, assumirei prateleira correta.","Aviso");
			$this=$this.parent();
		}
		
		// Adicionando botão de voltar ao topo
		$("body").append(options.returnToTop);
		
		$window=jQuery(window);
		$document=jQuery(document);
		toTopE=$(options.returnToTop);
		elemLoading=jQuery(options.elemLoading);
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
				
				$window.bind("scroll",function(){
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
					log("Não foi possível localizar a url de busca da página.\n Tente adicionar o .js ao final da página. \n[Método: getSearchUrl]");
					return "";
				}
			},
			infinityScroll:function()
			{
				var elementPages,pages,searchUrl,currentStatus,fn;
				
				elementPages=jQuery(".pager[id*=PagerTop]:first").attr("id")||"";
				if(""===elementPages){log("Não foi possível localizar o div.pages contendo o atributo id*=PagerTop");return "";}
				
				pages=window["pagecount_"+elementPages.split("_").pop()];
				searchUrl=(null!==options.searchUrl)?options.searchUrl:fns.getSearchUrl();
				currentStatus=true;
					
				// Reportando erros
				if("undefined"===typeof pages) log("Não foi possível localizar quantidade de páginas.\n Tente adicionar o .js ao final da página. \n[Método: infinityScroll]");
				
				fn=function()
				{
					if(!currentStatus) return;
					
					var currentItems=$this.find(options.lastShelf);
					if(currentItems.length<1){log("Última Prateleira/Vitrine não encontrada \n ("+currentItems.selector+")"); return false;}
					
					currentItems.after(elemLoading);
					currentStatus=false;
					jQuery.ajax({
						url: searchUrl+currentPage,
						success:function(data)
						{
							if(data.trim().length<1)
							{
								moreResults=false;
								log("Não existem mais resultados a partir da página: "+currentPage,"Aviso");
							}
							else
								options.insertContent(currentItems,data);
							currentStatus=true;
							elemLoading.remove();
						},
						error:function()
						{
							log("Houve um erro na requisição Ajax de uma nova página.");
						},
						complete: function(jqXHR, textStatus)
						{
							options.callback();
						}
					});
					currentPage++;
				};
				
				
				if(typeof options.paginate === "function")
					options.paginate(
						function(){
							if(currentPage<=pages && moreResults)
								fn();
						}
					);
				else
					$window.bind("scroll",function(){
						if(currentPage<=pages && moreResults)
						{
							if(($window.scrollTop()+$window.height())>=(options.getShelfHeight()))
								fn();
						}
						else
							return false;
					});
			}
		};

		fns.scrollToTop();	
		fns.infinityScroll();

		return $this;
	};
})(jQuery);