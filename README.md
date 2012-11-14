#VTEX - Infinity Scroll
>*Extensões da plataforma VTEX são plugins criados por desenvolvedores de interface ou pelo VTEX Lab (Laboratório de Inovações da VTEX) que podem ser inseridas em sua loja. Existem extensões gratuitas com código aberto -  Open Source - e extensões pagas.  Indicamos que a instalação seja realizada pelos profissionais e empresas certificados pela VTEX. Vale ressaltar que qualquer profissional de CSS, JavaScript e HTML pode também executar esta tarefa.*

----------

Veja este componente na [VTEX Store](http://conversionstore.com.br/index.php/extensoes/busca/carregamento-inteligente-de-imagens)

##Instalação
Faça o upload para o "Gerenciador do portal" no "Vtex Admin" dos seguintes arquivos:
* img/ajax-loader2.gif
* img/returnToTop.png
* infinityScroll.min.js
* infinityScroll.css

Faça a chamada do arquivo javascript na página:

```html
<link rel="stylesheet" type="text/css" href="/arquivos/infinityScroll.css" />
<script type="text/javascript" src="/arquivos/infinityScroll.min.js"></script>
```

Execute o plugin:

```javascript
$(".prateleira[id*=ResultItems]").infinityScroll();
```

###Avançado

Configurações completas do plugin (lista atualizada em 14/11/2012):
```javascript
$(".prateleira[id*=ResultItems]").infinityScroll({
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
	}
});
```