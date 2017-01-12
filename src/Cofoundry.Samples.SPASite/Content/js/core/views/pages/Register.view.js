(function (pages, itemViews, models, app, $, _, Backbone) {
    pages.Register = Backbone.View.extend({
        el : 'main',
        template: _.template($('#register').html()),
        events: {
            'submit .form': 'onFormSubmit'
        },

        initialize : function() {
            this.model = new models.Register();
            this.render();
        },
        render : function() {
            this.$el.empty().append(this.template);
            return this;
        },
        onFormSubmit: function(e) {
            e.preventDefault();
            this.clearErrors();

            var that = this;

            this.$el.find('input[name]').each(function() {
                that.model.set(this.name, this.value);
            });

            this.model.save(null, {
                error: function(model, response) {
                    var JSONResponse = JSON.parse(response.responseText),
                        errors = JSONResponse.errors;

                    that.handleErrors(errors);
                },
                success: function(model, response) {
                    var token = response.data.antiForgeryToken;

                    that.handleRegister(token);
                }
            });
        },
        handleErrors: function(errors) {
            console.log(errors);

            _.each(errors, function(error) {
                var name = error.properties[0].toLowerCase(),
                    message = error.message,
                    $input = this.$el.find('input[name="' + name + '"] + .error');

                $input.text(message).removeClass('hidden');
            }, this)
        },
        clearErrors: function() {
            var errorTexts = this.$el.find('.error');

            _.each(errorTexts, function(error) {
                if (!$(error).hasClass('hidden')) $(error).addClass('hidden');
                $(error).text('');
            });
        },
        handleRegister: function(token) {
            this.showRegisteredMessage();

            app.User.authenticated = true;
            app.User.token = token;
        },
        showRegisteredMessage: function() {
            this.$el.find('.form').addClass('hidden');
            this.$el.find('.message').removeClass('hidden');
        }
    });
})(
    CofoundrySPA.PageViews = CofoundrySPA.PageViews || {},
    CofoundrySPA.ItemViews,
    CofoundrySPA.Models,
    CofoundrySPA.App,
    jQuery,
    _, 
    Backbone
);