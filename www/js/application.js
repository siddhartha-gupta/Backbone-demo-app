(function() {
    window.App = window.App || {};

    App = new Backbone.Marionette.Application();

    App.controller = App.controller || {};
    App.collections = App.collections || {};
    App.views = App.views || {};
    App.models = App.models || {};
    App.routers = App.routers || {};
    App.subController = App.subController || {};

    App.addRegions({
        mainRegion: "#content"
    });

    App.addInitializer(function(options) {
        App.customRoutes = new App.mainRouters({
			controller : App.controller.routeFuncs
		});
        App.customRoutes.on('beforeroute', App.controller.beforeRoute);
		App.customRoutes.on('onRoute', App.controller.onRoute);
    });

    App.bind('initialize:after', function(options) {
		if(Backbone.history) {
			Backbone.history.start();
		}
	});

    Backbone.Marionette.CompositeView = Backbone.Marionette.CompositeView.extend({
        appendHtml: function(collectionView, itemView){
        	if(this.customEl) {
				collectionView.$('.' + this.customEl).append(itemView.el);
        	} else {
        		collectionView.$el.append(itemView.el);
        	}
        },

		close : function() {
			this.unbind();
			this.$el.empty();
			this.closeChildren();
			this.remove();
		}
    });

	Backbone.Marionette.ItemView = Backbone.Marionette.ItemView.extend({
        render: function() {
			if(this.model) {
				this.applyScroll = true;
				this.listenTo(this.model, "change", this.render, this);
			}

			this.isClosed = false;
			this.triggerMethod("before:render", this);
			this.triggerMethod("item:before:render", this);
			var data = this.serializeData();
			data = this.mixinTemplateHelpers(data);
			var template = this.getTemplate();
			var html = Marionette.Renderer.render(template, data);

			if(this.childView) {
				this.setElement(html);
			} else {
				this.$el.html(html);	
			}			
			this.bindUIElements();
			this.triggerMethod("render", this);
			this.triggerMethod("item:rendered", this);
			if (_.isObject(this.scrollArea) && this.applyScroll) {
				this.addScroll();
			}
			return this;
		},

		close : function() {
			this.unbind();
			this.$el.empty().unbind();
			this.remove();
		},

		addScroll: function() {
			var _this = this,
				initHeight = $(window).height(),
				//keep adjust for android
				adjustment = this.scrollArea.adjust || 0,
				element = this.$el.find(this.scrollArea.element),
				scrollHeight = initHeight - $(element[0]).offset().top - adjustment;

			$(this.$el.find(element)[0]).css('min-height', scrollHeight);
			this.custScroll = new iScroll($(element, this.$el).get(0));
		}
    });
})();