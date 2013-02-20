
(function($) {

	$.dataTools = function(el, options) {
		console.log('hello');
		this.$el = $(el);
		console.log(this);

		this.json = {};
		this.init(options);
		console.log('iamhere')

	};

	$.dataTools.prototype = {

		init: function(options) {

			var base = this,
				$el = base.$el,
				settings = $.extend( {
			      'useDataApi': false
			    }, options);

		    if (settings.useDataApi)
		    {
				$('[data-serialize]').each(function(){
					base.serialize(this,base.json)
				});
			}
			else
			{
				base.serialize($el,base.json);
			}
		},


		serialize: function($element,collection){
			console.log(collection)
			console.log($element)
			//create JSON collection based upon data-serialize attribute value
			if (collection) {
				collection = this.createCollection(collection,$element.attr('id'));
			} else {
				collection = this.createCollection(this.json,$element.data('serialize'));
			}
			//add element to collection as JSON object with name == id attiribute
			var id = $element.attr('id');
			//if the element doesn't have a id for some reason, generate a new one
			if (id == undefined) {
				id = _.uniqueId($element.data('serialize'));
			}

			//find all children elements that should be added to JSON object
			$element.find('[data-name],[data-serialize]').each(function(index){
				var $child   = $(this),
					name     = $child.data('name'),
					coll     = $child.data('serialize'),
					value    = $child.data('attr') ? $child.attr($child.data('attr')) : $child.html().trim();
				
				//this is used when we have nested data-serialize objects
				if ($child.data('serialized'))
					return;

				//check if it has a data-serialize attiribute
				if (coll) {
					//the element does have a data-serialize attiribute, cycle through all it's data-name children and add to parent JSON object
					this.serialize($child,collection[id]);
				} else {
					//add value to JSON object using data-name as name and html (default) or specified attribute as value
					try {
						collection[id][name] = value;
					} catch (e) {
						collection[id] = {'id':id};
						collection[id][name] = value;
					}
				}
				// ensure that this doesn't get serialized twice, have to do this for nesting
				$child.data('serialized',1);
			});
		},

		createCollection: function(/*object*/ collection, /* string */ name) {
			if (collection[name])
				return collection[name];
			
			collection[name] = {};
			return collection[name];
		}
	};


	$.fn.dataTools = function(options) {
		console.log('hereyouare')
		return this.each(function(){
			new $.dataTools(this, options);
		})
	}

})(jQuery);
