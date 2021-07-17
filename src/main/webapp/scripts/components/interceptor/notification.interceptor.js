 'use strict';

angular.module('spotgarageApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-spotgarageApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-spotgarageApp-params')});
                }
                return response;
            }
        };
    });
