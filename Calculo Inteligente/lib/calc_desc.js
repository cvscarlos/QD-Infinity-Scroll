(function($) {

	$.fn.calc_desc = function(opts) {
	
		var $elem, $settings, $options, $plugin;
		
		$elem = $(this);
		
		$settings = {
			price: ".skuBestPrice", //elemento retentor do preço a ser calculado.
			price_shelf: ".data .newPrice em", //elemento retentor do preço a ser calculado.
			desc_wrapper: ".productColumnMain .desc", //elemento pai(wrapper)
			desc_wrapper_shelf: ".data .desc", //elemento pai(wrapper)
			container: ".total_desc_container", //elemento retentor do preço calculado. Necessário criá-lo.
			container_shelf: ".data .total_desc_container" //elemento retentor do preço calculado. Necessário criá-lo.
		};
		
		$options = $.extend($settings,opts);
		
		$plugin = {
			num: null,
			price: null,
			result: null,
			init: function() {
				$plugin.calc_discount_product_page();
				$plugin.calc_discount_shelf();
			},
			calc_discount_product_page: function() {
				if ($("body.produto").length>0 && !$elem.hasClass("prateleira")) {
					var wrapper = $($options.desc_wrapper);
					$plugin.num = parseFloat($elem.text().match(/([0-9]+%|[0-9]+ %)/)[0].replace(" %","").replace("%",""));
					$plugin.price = parseFloat($($settings.price||"").text().replace("R$ ","").replace(".","").replace(",","."));
					$plugin.result = $plugin.price - ($plugin.price * $plugin.num/100);

					wrapper.find($options.container).append($plugin.number_format($plugin.result));
					wrapper.show();
				}
			},
			calc_discount_shelf: function() {
				if($elem.hasClass("prateleira")) {
					$elem.find("li").each(function() {
						var $this, wrapper, flag_shelf; 					
					
						$this = $(this);
						wrapper = $this.find($options.desc_wrapper_shelf);
						
						if(wrapper.length>0) {
							$plugin.num = parseFloat($this.find(".flag").text().match(/([0-9]+%|[0-9]+ %)/)[0].replace(" %","").replace("%",""));
							$plugin.price = parseFloat($this.find($settings.price_shelf||"").text().replace("R$ ","").replace(".","").replace(",","."));
							$plugin.result = $plugin.price - ($plugin.price * $plugin.num/100);
							
							$this.find($options.container_shelf).append($plugin.number_format($plugin.result));
							wrapper.show();
						}
					});
				}
			},
			number_format:function(val) {
				var out="",_char="", thousandsFormatted="", values, numbers, i, numLength, thousandsSeparator;
			
				values=val.toFixed(2).split(".");
				numbers=values[0].split("");
				i=0;
				numLength=numbers.length;
				thousandsSeparator=".";
				
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
			}
		};
	
		return $plugin.init();
	};

})(jQuery);