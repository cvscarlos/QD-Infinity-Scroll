/**
* Infinity Scroll
* @author Carlos Vinicius [Quatro Digital]
* @version 3.9
* @license MIT
*/
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){ return this.replace(/^\s+|\s+$/g,""); };
(function ($) {
	"use strict";

	if (typeof $.fn.QD_infinityScroll === "function") return;

	// Iniciando as variáveis públicas do infinity scroll
	window._QuatroDigital_InfinityScroll = window._QuatroDigital_InfinityScroll || {};

	$.fn.QD_infinityScroll = function (opts) {
		var defaults, log, extTitle, options, $this, $empty, $window, $document, toTopE, elemLoading, $public, $htmlWrapper;

		// Reduzindo o nome da variável publica
		$public = window._QuatroDigital_InfinityScroll;

		// Função de log
		extTitle = "Infinity Scroll";
		var log = function (a, b) {if ("object" === typeof console) {var c = "object" === typeof a; "undefined" === typeof b || "alerta" !== b.toLowerCase() && "aviso" !== b.toLowerCase() ? "undefined" !== typeof b && "info" === b.toLowerCase() ? c ? console.info("[" + extTitle + "]\n", a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]) : console.info("[" + extTitle + "]\n" + a) : c ? console.error("[" + extTitle + "]\n", a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]) : console.error("[" + extTitle + "]\n" + a) : c ? console.warn("[" + extTitle + "]\n", a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]) : console.warn("[" + extTitle + "]\n" + a) } };

		defaults = {
			// Última prateleira/vitrine na página
			lastShelf: ">div:last",
			// Elemento com mensagem de carregando ao iniciar a requisição da página seguinte
			elemLoading: '<div id="scrollLoading">Carregando ... </div>',
			// Opção p/ definir a URL manualmente, ficando automático apenas a paginação. A url deve terminar com "...&PageNumber="
			searchUrl: null,
			// Objeto jQuery com o botão de voltar ao topo
			returnToTop: $('<div id="returnToTop"><a href="#"><span class="text">voltar ao</span><span class="text2">TOPO</span><span class="arrowToTop"></span></a></div>'),
			// Define em qual seletor a ação de observar a rolagem será aplicado (ex.: $(window).scroll(...))
			scrollBy: document,
			// Callback quando uma requisição ajax da prateleira é completada
			callback: function () {},
			// Cálculo do tamanho do footer para que uam nova página seja chamada antes do usuário chegar ao "final" do site
			getShelfHeight: function () {
				return ($this.scrollTop() + $this.height());
			},
			// Opção para fazer a paginação manualmente, uma nova página só é chamada quando executado o comando dentro desta função
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
		options = jQuery.extend({}, defaults, opts);
		$this = jQuery(this);
		$empty = jQuery("");

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

		$window = $(window);
		$document = $(document);
		$htmlWrapper = $(options.scrollBy);
		$public.toTopE = $(options.returnToTop);
		elemLoading = $(options.elemLoading);
		$public.moreResults = true;
		$public.currentPage = 2;

		var fns = {
			scrollToTop: function () {
				var windowH, scrollTimeout, scrollHandler;
				windowH = $window.height();

				$window.bind("resize.QD_infinityScroll", function () {
					windowH = $window.height();
				});

				scrollTimeout = null;
				scrollHandler = function(){
					if ($document.scrollTop() > windowH) {
						if (!document.body.getAttribute("data-qd-infinity-scroll"))
							document.body.setAttribute("data-qd-infinity-scroll", 1);
					} else if (document.body.getAttribute("data-qd-infinity-scroll"))
						document.body.removeAttribute("data-qd-infinity-scroll");
				};

				$htmlWrapper.bind("scroll.QD_infinityScroll", function () {
					clearTimeout(scrollTimeout);
					scrollTimeout = setTimeout(scrollHandler, 20);
				});

				$public.buttonToTop = $public.toTopE.find("a").bind("click.QD_infinityScroll", function () {
					jQuery("html,body").animate({
						scrollTop: 0
					}, "slow");
					return false;
				});
			},
			getSearchUrl: function () {
				var url, content, preg, pregCollection;
				jQuery("script:not([src])").each(function () {
					content = jQuery(this)[0].innerHTML;
					preg = /\/buscapagina\?.+&PageNumber=/i;
					pregCollection = /\/paginaprateleira\?.+PageNumber=/i;
					if (content.indexOf("buscapagina") > -1) {
						url = preg.exec(content);
						return false;
					} else if (content.indexOf("paginaprateleira") > -1) {
						url = pregCollection.exec(content);
						return false;
					}
				});

				if (typeof url !== "undefined" && typeof url[0] !== "undefined")
					return url[0].replace("paginaprateleira", 'buscapagina');
				else {
					log("Não foi possível localizar a url de busca da página.\n Tente adicionar o .js ao final da página. \n[Método: getSearchUrl]");
					return "";
				}
			},
			infinityScroll: function () {
				var elementPages, fn, i, scrollTimeout, scrollHandler;

				$public.searchUrl = (null !== options.searchUrl) ? options.searchUrl : fns.getSearchUrl();
				$public.currentStatus = true;

				// Quantidade de páginas obtidas na busca
				// Obtendo o elemento no HTML que informa o numero que completa o nome da variável
				elementPages = $(".pager[id*=PagerTop]:first").attr("id") || "";
				if (elementPages !== "") {
					// Obtendo a quantidade de páginas
					$public.pages = window["pagecount_" + elementPages.split("_").pop()];
					if (typeof $public.pages === "undefined") {
						// Buscando a quantidade de página dentro de "window" caso não tenha encontrado a variável com o ID obtido no elemento de paginação
						for (i in window)
							if (/pagecount_[0-9]+/.test(i)) {
								$public.pages = window[i];
								break;
							}
					}
				}
				// Caso não seja possível obter uma página, é definido um valor gigantesco para que a parada seja feita automáticamente
				if (typeof $public.pages === "undefined")
					$public.pages = 9999999999999;

				fn = function () {
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
							if ($public.currentPage <= $public.pages && $public.moreResults)
								fn();
						}
					);
				else{
					scrollTimeout = null;
					scrollHandler = function(){
						if ($public.currentPage <= $public.pages && $public.moreResults && ($window.scrollTop() + $window.height()) >= options.getShelfHeight() && options.authorizeScroll())
							fn();
					};
					$htmlWrapper.bind("scroll.QD_infinityScroll_paginate", function () {
						clearTimeout(scrollTimeout);
						scrollTimeout = setTimeout(scrollHandler, 70);
					});
				}
			}
		};

		fns.scrollToTop();
		fns.infinityScroll();

		return $this;
	};
})(jQuery);