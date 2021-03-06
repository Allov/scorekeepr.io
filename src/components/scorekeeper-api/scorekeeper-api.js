define(['jquery'],
    function($) {
        'use strict';

        var api = {};

        api.init = function() {
            return new $.Deferred(function(dfd) {
                $.getJSON('/api/account', function(user) {
                    api.user = user;
                }).always(function() {
                    dfd.resolve();
                });
            }).promise();
        };

        api.logout = function() {
            $.post('/api/logout', function() {
                window.location = '/';
            });
        }

        return api;
    });
