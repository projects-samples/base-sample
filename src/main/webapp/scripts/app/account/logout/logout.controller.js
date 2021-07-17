'use strict';

angular.module('spotgarageApp')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });
