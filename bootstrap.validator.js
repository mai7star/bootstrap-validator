define(['jquery', 'underscore', 'bootstrap'], function($, _){
	'use strict';

	var FormValidator = function(form, rules){
		this.form = form;
		this.rules = rules;
	};

	FormValidator.prototype = {
		validate: function(){
			this.deferred = $.Deferred();
			this.clearError();

		 	return this.deferred.promise();
		},

		filter1: function(){
			return !_.isUndefined($(this).data('error'));
		},

		clearError: function(){
			this.form
				.find('.form-group')
				.each(function(){
					$(this).removeClass('has-error');
				});

			var ps = this.form
				.find('*')
				.filter(this.filter1)
				.map(function(){
					var d = $.Deferred();

				 	$(this)
				 		.one('hidden.bs.tooltip', d.resolve)
						.tooltip('destroy')
						.removeData('error');

				 	return d.promise();
				}).get();

			$.when
				.apply(null, ps)
				.then(this.validateRules.bind(this));
		},

		validateRules: function(){
			var ds = _.chain(this.rules)
				.invoke('call', this.form)
				.filter()
				.value();

			ds.push(this.wait());
			$.when
				.apply(null, ds)
				.then(this.showErrors.bind(this));
		},

		showErrors: function(){
			var has_error = this.form
				.find("*")
				.filter(this.filter1)
				.each(function(){
					$(this).parents('.form-group:first').addClass('has-error');

					var option = $(this).data('error');
					if(_.isString(option)){
						option = {
							placement: 'top',
							title: option
						};
					}
					option.trigger = 'manual';

					$(this)
						.tooltip(option)
						.tooltip('show');
				})
				.get()
				.length > 0;

			has_error ? this.deferred.reject() : this.deferred.resolve();
		},

		wait: function(){
			var d = $.Deferred();
			setTimeout(d.resolve, 100);
			return d.promise();
		}
	};

	return FormValidator;
});