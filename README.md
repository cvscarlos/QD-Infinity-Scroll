#VTEX - Infinity Scroll#
>*Extensões da plataforma VTEX são plugins criados por desenvolvedores de interface ou pelo VTEX Lab (Laboratório de Inovações da VTEX) que podem ser inseridas em sua loja. Existem extensões gratuitas com código aberto -  Open Source - e extensões pagas.  Indicamos que a instalação seja realizada pelos profissionais e empresas certificados pela VTEX. Vale ressaltar que qualquer profissional de CSS, JavaScript e HTML pode também executar esta tarefa.*

----------

Veja este componente na [VTEX Store](http://conversionstore.com.br/index.php/extensoes/busca/carregamento-inteligente-de-imagens)

##Instalação##
Faça o upload para o "Gerenciador do portal" no "Vtex Admin" dos seguintes arquivos:
* img/ajax-loader2.gif
* img/returnToTop.png
* infinityScroll.min.js

Faça a chamada do arquivos JS na página:

`<script type="text/javascript" src="/arquivos/infinityScroll.min.js"></script>`

Execute o plugin:

`$(".prateleira[id*=ResultItems]").infinityScroll();`