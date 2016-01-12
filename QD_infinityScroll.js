/**
* Infinity Scroll
* @author Carlos Vinicius [Quatro Digital]
* @version 3.14
* @license MIT
*/
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){ return this.replace(/^\s+|\s+$/g,""); };
(function ($) {
	"use strict";

	if (typeof $.fn.QD_infinityScroll === "function") return;

	// Iniciando as variáveis públicas do infinity scroll
	window._QuatroDigital_InfinityScroll = window._QuatroDigital_InfinityScroll || {};

	$.fn.QD_infinityScroll = function (opts) {
		"use strict";

		// Reduzindo o nome da variável publica
		var $public = window._QuatroDigital_InfinityScroll;

		// Função de log
		var extTitle = "Infinity Scroll";
		var log=function(c,b){if("object"===typeof console&&"undefined"!==typeof console.error&&"undefined"!==typeof console.info&&"undefined"!==typeof console.warn){var a;"object"===typeof c?(c.unshift("["+extTitle+"]\n"),a=c):a=["["+extTitle+"]\n"+c];if("undefined"===typeof b||"alerta"!==b.toLowerCase()&&"aviso"!==b.toLowerCase())if("undefined"!==typeof b&&"info"===b.toLowerCase())try{console.info.apply(console,a)}catch(d){try{console.info(a.join("\n"))}catch(e){}}else try{console.error.apply(console,a)}catch(f){try{console.error(a.join("\n"))}catch(g){}}else try{console.warn.apply(console, a)}catch(h){try{console.warn(a.join("\n"))}catch(k){}}}};

		var defaults = {
			// Última prateleira/vitrine na página
			lastShelf: ">div:last",
			// Elemento com mensagem de carregando ao iniciar a requisição da página seguinte
			elemLoading: '<!-- Infinity Scroll - Loading message --><div id="scrollLoading" class="qd-is-loading">Carregando ... </div>',
			// Opção p/ definir a URL manualmente, ficando automático apenas a paginação. A url deve terminar com "...&PageNumber="
			searchUrl: null,
			// Objeto jQuery com o botão de voltar ao topo
			returnToTop: $('<div id="returnToTop" class="qd-is-return-top"><a href="#"><span class="text">voltar ao</span><span class="text2">TOPO</span><span class="arrowToTop"></span></a></div>'),
			// Define em qual seletor a ação de observar a rolagem será aplicado (ex.: $(window).scroll(...))
			scrollBy: document,
			// Callback quando uma requisição ajax da prateleira é completada
			callback: function () {},
			// Cálculo do tamanho do footer para que uma nova página seja chamada antes do usuário chegar ao "final" do site
			getShelfHeight: function ($this) {
				return ($this.scrollTop() + $this.height());
			},
			// Opção para fazer a paginação manualmente, uma nova página só é chamada quando executado o comando dentro desta função. Útil para ter um botão "Mostrar mais produtos"
			// Ela recebe como parâmetro: 1 função que chama a próxima página (caso ela exista)
			paginate: null,
			// Esta função é quem controla onde o conteúdo será inserido. Ela recebe como parâmetro: O ùltimo bloco inserido e os dados da nova requisição AJAX
			insertContent: function (currentItems, ajaxData) {
				currentItems.after(ajaxData);
			},
			// Função para permitir ou não que a rolagem infinita execute na página esta deve retornar "true" ou "false"
			authorizeScroll: function () {
				return true;
			}
		};
		var options = jQuery.extend({}, defaults, opts);
		var $this = jQuery(this);
		var $empty = jQuery("");

		if ($this.length < 1)
			return $this;

		// Checando se existe mais de uma prateleira selecionada
		if ($this.length > 1) {
			log("Identifiquei que a seletor informado (" + $this.selector + ") retornou " + $this.length + " elementos.\n Para solucionar o problema estou selecionando automáticamente o primeiro com o id: #" + ($this.filter("[id^=ResultItems]:first").attr("id") || "!Not Found"), "Aviso");
			$this = $this.filter("[id^=ResultItems]:first");
		}

		// tentando adivinhar se esta pegando o elemento correto da prateleira
		if (!$this.filter("[id^=ResultItems]").length)
			log(["Certifique-se que esta selecionando o elemento correto.\n O plugin espera que o elemento seja o que contém o id: #" + ($("div[id^=ResultItems]").attr("id") || "!Not Found"), $("div[id^=ResultItems]")], "Info");
		if ($this.parent().filter("[id^=ResultItems]").length) {
			$this = $this.parent();
			log(["Identifiquei que o seletor pai do elemento que você informou é o #" + (jQuery("div[id^=ResultItems]").attr("id") || "!Not Found") + ".\n Como forma de corrigir esse problema de seleção de elemento, assumirei a prateleira correta.", $this], "Aviso");
		}

		// Adicionando botão de voltar ao topo
		$("body").append(options.returnToTop);

		var $window = $(window);
		var $document = $(document);
		var $htmlWrapper = $(options.scrollBy);
		var elemLoading = $(options.elemLoading);
		$public.toTopE = $(options.returnToTop);
		$public.moreResults = true;
		$public.currentPage = 2;

		var scrollToTop = function () {
			"use strict";
			var windowH = $window.height();

			$window.bind("resize.QD_infinityScroll", function () {
				windowH = $window.height();
			});

			var scrollTimeout = 0;
			$htmlWrapper.bind("scroll.QD_infinityScroll", function () {
				clearTimeout(scrollTimeout);
				scrollTimeout = setTimeout(function(){
					if ($document.scrollTop() > windowH) {
						if (!document.body.getAttribute("data-qd-infinity-scroll"))
							document.body.setAttribute("data-qd-infinity-scroll", 1);
					} else if (document.body.getAttribute("data-qd-infinity-scroll"))
					document.body.removeAttribute("data-qd-infinity-scroll");
				}, 20);
			});

			$public.buttonToTop = $public.toTopE.find("a").bind("click.QD_infinityScroll", function () {
				jQuery("html,body").animate({
					scrollTop: 0
				}, "slow");
				return false;
			});
		};

		var getSearchUrl = function () {
			"use strict";
			var url;
			var preg = /\/buscapagina\?.+&PageNumber=/i;
			var pregCollection = /\/paginaprateleira\?.+PageNumber=/i;

			$("script:not([src])").each(function () {
				var content = this.innerHTML;
				if (content.indexOf("buscapagina") > -1) {
					url = preg.exec(content);
					return false;
				}
				else if (content.indexOf("paginaprateleira") > -1) {
					url = pregCollection.exec(content);
					return false;
				}
			});

			if (typeof url === "object" && typeof url[0] !== "undefined")
				return url[0].replace("paginaprateleira", 'buscapagina');
			else {
				log("Não foi possível localizar a url de busca da página.\n Tente adicionar o .js ao final da página. \n[Método: getSearchUrl]");
				return "";
			}
		};

		var infinityScroll = function () {
			"use strict";
			$public.searchUrl = (null !== options.searchUrl) ? options.searchUrl : getSearchUrl();
			$public.currentStatus = true;

			// Quantidade de páginas obtidas na busca
			// Obtendo o elemento no HTML que informa o numero que completa o nome da variável
			var elementPages = $(".pager[id*=PagerTop]:first").attr("id") || "";
			if (elementPages !== "") {
				// Obtendo a quantidade de páginas
				$public.pages = window["pagecount_" + elementPages.split("_").pop()];
				if (typeof $public.pages === "undefined") {
					// Buscando a quantidade de página dentro de "window" caso não tenha encontrado a variável com o ID obtido no elemento de paginação
					for (var i in window)
						if (/pagecount_[0-9]+/.test(i)) {
							$public.pages = window[i];
							break;
						}
				}
			}
			// Caso não seja possível obter uma página, é definido um valor gigantesco para que a parada seja feita automáticamente
			if (typeof $public.pages === "undefined")
				$public.pages = 9999999999999;

			var getShelf = function () {
				if (!$public.currentStatus) return;

				var currentItems = $this.find(options.lastShelf);
				if (currentItems.length < 1) {
					log("Última Prateleira/Vitrine não encontrada \n (" + currentItems.selector + ")");
					return false;
				}

				currentItems.after(elemLoading);
				$public.currentStatus = false;
				var requestedPage = $public.currentPage;
				$.ajax({
					url: $public.searchUrl.replace(/pagenumber\=[0-9]*/i, "PageNumber=" + $public.currentPage),
					dataType: "html",
					success: function (data) {
						if (data.trim().length < 1) {
							$public.moreResults = false;
							log("Não existem mais resultados a partir da página: " + requestedPage, "Aviso");
							$(window).trigger("QuatroDigital.is_noMoreResults");
						} else
							options.insertContent(currentItems, data);
						$public.currentStatus = true;
						elemLoading.remove();
					},
					error: function () {
						log("Houve um erro na requisição Ajax de uma nova página.");
					},
					complete: function (jqXHR, textStatus) {
						options.callback();

						$(window).trigger("QuatroDigital.is_Callback");
					}
				});
				$public.currentPage++;
			};

			if (typeof options.paginate === "function")
				options.paginate(
					function () {
						if ($public.currentPage <= $public.pages && $public.moreResults){
							getShelf();
							return true;
						}
						return false;
					}
				);
			else{
				var scrollTimeout = 0;
				$htmlWrapper.bind("scroll.QD_infinityScroll_paginate", function () {
					clearTimeout(scrollTimeout);
					scrollTimeout = setTimeout(function(){
						if ($public.currentPage <= $public.pages && $public.moreResults && options.authorizeScroll() && ($window.scrollTop() + $window.height()) >= options.getShelfHeight($this))
							getShelf();
					}, 70);
				});
			}
		}

		scrollToTop();
		infinityScroll();

		return $this;
	};

	// Anulando a função de paginação da VTEX
	$(document).ajaxSend(function(e, request, settings) {
		if(settings.url.indexOf("PageNumber") > -1 && settings.url.search(/PageNumber\=[^0-9]+/) > 0)
			request.abort();
	});

	// Anula função da VTEX que faz rolagem na página após paginar
	window.goToTopPage = function() {};
	$(function() {
		window.goToTopPage = function() {};
	});
})(jQuery);