/**
 * bootstrap validtor
 *
 *
 */
(function(root, factory){
    if(typeof define === "function" && define.amd){
        // AMD. Register as an anonymous module.
        define(['jquery', 'underscore', 'bootstrap'], factory);

    } else if (typeof exports === "object") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require("jquery"), require("underscore"));

    } else {
        if(typeof root.jQuery === 'undefined') {
            throw new Error('bootstrap validtor requires jQuery.');
        }
        if(typeof root._ === 'undefined') {
            throw new Error('bootstrap validtor requires underscore.js.');
        }
        if(typeof root.jQuery().emulateTransitionEnd === 'undefined') {
            throw new Error('bootstrap validtor requires Bootbox.');
        }

        // Browser globals (root is window)
        root.validator = factory(root.jQuery, root._);
    }

}(this, function($, _){
    'use strict';

    var validator = function(form, rules, callback){
        this.form = form;
        this.rules = rules || [];
        this.callback = callback || _.constant({});
    };

    validator.prototype = {
        validate: function(){
            this.deferred = $.Deferred();
            this.clearError();

            return this.deferred.promise();
        },

        filter1: function(){
            return !_.isUndefined($(this).data('error'));
        },

        selector: function(selector){
            return this.form.find(selector);
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
                .invoke('call', null, this.selector.bind(this))
                .filter()
                .push(this.wait())
                .value();

            $.when
                .apply(null, ds)
                .always(this.showErrors.bind(this));
        },

        showErrors: function(){
            var has_error = this.form
                .find("*")
                .filter(this.filter1)
                .each(function(){
                    var $this = $(this);

                    $this.parents('.form-group:first').addClass('has-error');

                    var option = $this.data('error');
                    if(_.isString(option)){
                        option = {
                            placement: 'top',
                            title: option
                        };
                    }
                    option.trigger = 'manual';

                    $this
                        .tooltip(option)
                        .tooltip('show');

                    var tooltipid = $this.attr('aria-describedby');
                    $('#' + tooltipid)
                        .click(function(){
                            $this.tooltip('hide');
                        });
                })
                .get()
                .length > 0;

            if(has_error){
                this.deferred.reject();
                return;
            }

            var result = this.callback(this.selector.bind(this));
            this.deferred.resolve(result);
        },

        wait: function(){
            return $.Deferred(function(){
                setTimeout(this.resolve, 100);
            }).promise();
        }
    };

    $.fn.validate = function(rules, callback){
        if(this.prop('tagName') != 'FORM'){
            throw new Error('only support form tag');
        }

        return new validator(this, rules, callback).validate();
    }

    return validator;
}));