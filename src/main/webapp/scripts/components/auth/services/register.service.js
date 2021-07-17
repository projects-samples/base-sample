'use strict';

angular.module('spotGarageApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


