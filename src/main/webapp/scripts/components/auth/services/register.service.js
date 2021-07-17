'use strict';

angular.module('spotgarageApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


