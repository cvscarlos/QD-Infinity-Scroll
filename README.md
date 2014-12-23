#QD - Infinity Scroll
>*Extensões da plataforma VTEX são plugins criados por desenvolvedores de interface ou pelo VTEX Lab (Laboratório de Inovações da VTEX) que podem ser inseridas em sua loja. Existem extensões gratuitas com código aberto -  Open Source - e extensões pagas.  Indicamos que a instalação seja realizada pelos profissionais e empresas certificados pela VTEX. Vale ressaltar que qualquer profissional de CSS, JavaScript e HTML pode também executar esta tarefa.*

----------
###Atenção
> Esta extensão é mantida por [Quatro Digital](http://www.quatrodigital.com.br) e não possui suporte gratuito.  
> O código fonte deste componente não pode ser vendido ou comercializado, ele esta livre para uso comercial mas só podem haver cobranças com relação à mão de obra necessária a sua instalação e não por sua utilização.  
> O correto funcionamento deste script não é de responsabilidade de seu desenvolvedor, mantenedor ou constribuidores.  
> Caso queira contribuir com o desenvolvimento fique a vontade para fazer um `Fork` e posteriormente um `pull request`.

**O uso desta extensão esta sob as regras da lincença: [MIT](http://pt.wikipedia.org/wiki/Licen%C3%A7a_MIT)**

----------
##Instalação
Faça o upload para o "Gerenciador do portal" no "Vtex Admin" dos seguintes arquivos:
* img/ajax-loader2.gif *(sugestão)*
* img/returnToTop.png *(sugestão)*
* QD_infinityScroll.min.js
* infinityScroll.css *(sugestão)*

Faça a chamada do arquivo javascript na página:

```html
<link rel="stylesheet" type="text/css" href="/arquivos/infinityScroll.css" />
<script type="text/javascript" src="/arquivos/QD_infinityScroll.min.js"></script>
```

Execute o plugin:

```javascript
$(".prateleira[id*=ResultItems]").QD_infinityScroll();
```

###Avançado

Configurações completas do plugin (lista atualizada em 23/12/2014):
```javascript
$(".prateleira[id*=ResultItems]").QD_infinityScroll({
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
});
```


----------
##Eventos

###$(window).bind("QuatroDigital.cp_thumbsWrapperAdd", handler);

Esse evento é disparado após as miniaturas de um produto estarem prontas, logo, isso ocorrerá uma vez para cada produto da vitrine.

**Parametros:**

1. Objeto de [evento do jQuery](http://api.jquery.com/Types/#Event).


----------
##Contribuidores

 * [Pedro Freires](https://github.com/caljp13/QD-Infinity-Scroll/pull/2)