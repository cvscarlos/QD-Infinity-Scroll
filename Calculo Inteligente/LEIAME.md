# Calculo Inteligente
### O Plugin "Calculo Inteligente" funciona da seguinte forma
	* Calcula o valor da primeira flag selecionada que contém um número acompanhado do sinal de porcentagem (%);
	* Imprime o valor calculado num container. Este container pode ser criado pelo programador, embora ja exista um html feito para as necessidades do plugin;
	* Nas prateleiras, o plugin funciona da mesma forma, porém, deve-se selecionar apenas a prateleira, e não a flag desejada, para que assim o plugin calcule as demais flags.

### Exemplo


#### HTML a ser adicionado na página de produtos

<div class="desc">
	<em class="valor-desc"><span>Ou:</span> <strong class="descPrice">R$  <span class="total_desc_container"></span></strong></em>
	<span class="dscrptn_desc"><vtex:contentPlaceHolder id="descricao_desconto" /></span> //Este controle é totalmente opcional
</div>

#### HTML a ser adicionado no template de prateleira
<div class="desc">				
	<em class="valor_desc"><span>Ou:</span> <strong class="descPrice">R$  <span class="total_desc_container"></span></strong></em>
	<span class="dscrptn_desc">À vista no boleto ou débito em conta</span>
</div>

* $(".productColumnMain .flag").calc_desc();
* Calcula o valor da flag da página de produtos
	
* $(".prateleira").calc_desc();
* Calcula o valor da flag das prateleiras
	
* $(".prateleira").calc_desc({ container: ".total_desc_container" });
* Elemento retentor do preço calculado na página de produtos.

* $(".prateleira").calc_desc({ container_shelf: ".data .total_desc_container" });
* elemento retentor do preço calculado nas prateleiras.

### Detalhes
	* São obrigatórios os controles de preço (<vtex.cmc:skuPrice />) e de prateleira para que o plugin funcione;
	* O uso da biblioteca vtex_lib é altamente recomendado, pois o plugin usa classes desta biblioteca. Se o programador optar por não usála, deverá declarar o container, 
	caso queira adicionar o controle inteligente na página de produto.