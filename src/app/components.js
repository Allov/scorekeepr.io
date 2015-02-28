//
// Main component registry file. It is called once at application start. Any scaffolded component will be added here.
//

define(['knockout-utilities', 'router', 'dialoger', 'modaler', 'nav-bar'],
    function(koUtilities, router, dialoger, modaler, navbar) {
        'use strict';

        var Components = function() {};

        Components.prototype.registerComponents = function() {
            // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
            
            //Register components, dialogs & pages here
            koUtilities.registerComponent('nav-bar');
            
            router.registerPage('home');
            router.addRoute('', {
                title: 'Home',
                pageName: 'home'
            });
            
            router.registerPage('game', {
                withActivator: true
            });
            router.addRoute('/game/:game:', {
                title: 'Game',
                pageName: 'game'
            });
        };

        return new Components();
    });
