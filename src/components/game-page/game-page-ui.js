define(['text!./game-page.html', 'knockout', 'lodash', 'socketio'],
    function(template, ko, _, io) {
        'use strict';

        var Player = function(name) {
            this.name = ko.observable(name);
            this.score = ko.observable(0);
            this._score = 0;
            this.isWinning = ko.observable(false);
            this.isLosing = ko.observable(false);
        };
        
        Player.prototype.add = function(score) {
            this.score(this.score() + score);
        };
        
        var ViewModel = function(params, componentInfo) {
            var self = this;
            self.players = ko.observableArray([]);
            self.currentRelease = ko.observable(1);
            
            self.socket = io.connect();
            
            self.socket.on('connect', function() {
                console.log('connected');
                self.socket.emit('join', { game: params.params[0].game });
            });
            
            self.socket.on('user joined', function(user) {
                console.log('User [' + user.name + '] joined the game.');
            });
            
            self.socket.on('end of game', function(data) {
                console.log(data.reason);
            });
            
            self.socket.on('disconnect', function() {
               console.log('disconnected');
            });
        };
        
        ViewModel.prototype.nextRelease = function() {
            var self = this;
            self.currentRelease(self.currentRelease() + 1);
        };
    
        ViewModel.prototype.reset = function() {
            var self = this;
            self.currentRelease(1);
            _.forEach(self.players(), function(plyr) {
                plyr.score(0);
            });
        };
        
        ViewModel.prototype.addPlayer = function() {
            var self = this;
            var playerNumber = self.players().length + 1;
            var player = new Player('Player ' + playerNumber);
            self.players.push(player);
    
            player.score.subscribe(function(value) {
                player._score = value;
                _.forEach(self.players(), function(plyr) {
                    plyr.isWinning(false);
                    plyr.isLosing(false);
                });
                
                var max = _.max(self.players(), function(plyr) { return plyr.score(); }).score();
                var min = _.min(self.players(), function(plyr) { return plyr.score(); }).score();
                
                if (max == min) {
                    return;
                }
                
                _.where(self.players(), { '_score': max }).forEach(function(plyr) {
                    plyr.isWinning(true);
                });
                _.where(self.players(), { '_score': min }).forEach(function(plyr) {
                    plyr.isLosing(true);
                });
            });
        };
        
        return {
            viewModel: {
                createViewModel: function(params, componentInfo) {
                    return new ViewModel(params, componentInfo);
                }
            },
            template: template
        };
    });