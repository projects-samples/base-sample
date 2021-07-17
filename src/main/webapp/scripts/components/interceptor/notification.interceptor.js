 'use strict';

angular.module('spotGarageApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-spotGarageApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-spotGarageApp-params')});
                }
                return response;
            }
        };
    });
