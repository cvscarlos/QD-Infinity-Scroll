#VTEX - Infinity Scroll
>*Extensões da plataforma VTEX são plugins criados por desenvolvedores de interface ou pelo VTEX Lab (Laboratório de Inovações da VTEX) que podem ser inseridas em sua loja. Existem extensões gratuitas com código aberto -  Open Source - e extensões pagas.  Indicamos que a instalação seja realizada pelos profissionais e empresas certificados pela VTEX. Vale ressaltar que qualquer profissional de CSS, JavaScript e HTML pode também executar esta tarefa.*

----------

Veja este componente na [VTEX Store](http://conversionstore.com.br/index.php/extensoes/busca/carregamento-inteligente-de-imagens)

##Instalação
Faça o upload para o "Gerenciador do portal" no "Vtex Admin" dos seguintes arquivos:
* img/ajax-loader2.gif
* img/returnToTop.png
* infinityScroll.min.js

Faça a chamada do arquivo javascript na página:

```html
<script type="text/javascript" src="/arquivos/infinityScroll.min.js"></script>`
```

Execute o plugin:

```javascript
$(".prateleira[id*=ResultItems]").infinityScroll();
```

Adicione o botão "Voltar ao topo" no template HTML:
```html
<div id="returnToTop"><a href="#">
	<span class="text">voltar ao</span>
	<span class="text2">TOPO</span>
	<span class="arrowToTop"></span>
</a></div>
```

Adicione o CSS do botão "Voltar ao topo" na folha de estilos da página:
```css
/* SCROLL INFINITO */
#scrollLoading{border:#FFD324 solid 2px; margin:20px auto; line-height:20px; padding:5px; width:100px; background:url("/arquivos/ajax-loader2.gif") no-repeat right center #FFF6BF;}
body .vitrine +.searchResultsTime{display:none;}
body .vitrine +.searchResultsTime +.sub{display:none;}
body .pager.bottom{display:none;}

/* Return to top */
#returnToTop{display:none; position:fixed; bottom:100px; right:0; width:90px; padding:3px 0 0 4px; height:32px; background-color:#FFF; border-radius:4px 0 0 4px;}
#returnToTop span{font-weight:bold; height:auto; line-height:12px; color:#A21279;}
#returnToTop .text{display:block;}
#returnToTop .text2{float:left; font-size:18px; font-weight:normal;}
#returnToTop .arrowToTop{background:url("/arquivos/returnToTop.png") no-repeat #A21279; width:32px; height:32px; position:absolute; top:2px; right:0; display:block; float:right;}
```