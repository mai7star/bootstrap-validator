require.config({
	paths: {
		'r.css': 'https://cdnjs.cloudflare.com/ajax/libs/require-css/0.1.5/css.min',

		'underscore': "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
		'jquery': "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min",
		'bootstrap': "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/js/bootstrap.min",
		'bootbox': "https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min",
		'bootbox.deferred': "../bootbox.deferred"
	},
	callback: function(){
		require(['bootbox'], function(bootbox){
			window.bootbox = bootbox;
		})
	},
	shim: {
		'bootstrap': [
			'jquery',
			'r.css!https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/css/bootstrap.min.css'
		],
		'bootbox': ['bootstrap']
	}
});

require(['bootbox.deferred'], function(){
	$('#btn').click(function(){
		bootbox.prompt.deferred({
			title: "What is your real name?",
			data: "makeusabrew"
		}).done(function(result){
			alert(result);
		}).fail(function(){
			alert('fail');
		});
	});
});
