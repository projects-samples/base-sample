'use strict';

/* App Module */

var spotgarageApp = angular.module('spotgarageApp', ['http-auth-interceptor', 'tmh.dynamicLocale',
    'ngResource', 'ngRoute', 'ngCookies', 'pascalprecht.translate']);

spotgarageApp
    .config(['$routeProvider', '$httpProvider', '$translateProvider',  'tmhDynamicLocaleProvider', 'USER_ROLES',
        function ($routeProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, USER_ROLES) {
            $routeProvider
                .when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'LoginController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/error', {
                    templateUrl: 'views/error.html',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/settings', {
                    templateUrl: 'views/settings.html',
                    controller: 'SettingsController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/password', {
                    templateUrl: 'views/password.html',
                    controller: 'PasswordController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/sessions', {
                    templateUrl: 'views/sessions.html',
                    controller: 'SessionsController',
                    resolve:{
                        resolvedSessions:['Sessions', function (Sessions) {
                            return Sessions.get();
                        }]
                    },
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/metrics', {
                    templateUrl: 'views/metrics.html',
                    controller: 'MetricsController',
                    access: {
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
                .when('/logs', {
                    templateUrl: 'views/logs.html',
                    controller: 'LogsController',
                    resolve:{
                        resolvedLogs:['LogsService', function (LogsService) {
                            return LogsService.findAll();
                        }]
                    },
                    access: {
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
                .when('/audits', {
                    templateUrl: 'views/audits.html',
                    controller: 'AuditsController',
                    access: {
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
                .when('/logout', {
                    templateUrl: 'views/main.html',
                    controller: 'LogoutController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .otherwise({
                    templateUrl: 'views/main.html',
                    controller: 'MainController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                });

            // Initialize angular-translate
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });

            $translateProvider.preferredLanguage('en');

            $translateProvider.useCookieStorage();

            tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js')
            tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
        }])
        .run(['$rootScope', '$location', 'AuthenticationSharedService', 'Session', 'USER_ROLES',
            function($rootScope, $location, AuthenticationSharedService, Session, USER_ROLES) {
                $rootScope.$on('$routeChangeStart', function (event, next) {
                    $rootScope.authenticated = AuthenticationSharedService.isAuthenticated();
                    $rootScope.isAuthorized = AuthenticationSharedService.isAuthorized;
                    $rootScope.userRoles = USER_ROLES;
                    $rootScope.account = Session;

                    var authorizedRoles = next.access.authorizedRoles;
                    if (!AuthenticationSharedService.isAuthorized(authorizedRoles)) {
                        event.preventDefault();
                        if (AuthenticationSharedService.isAuthenticated()) {
                            // user is not allowed
                            $rootScope.$broadcast("event:auth-notAuthorized");
                        } else {
                            // user is not logged in
                            $rootScope.$broadcast("event:auth-loginRequired");
                        }
                    }
                });

                // Call when the the client is confirmed
                $rootScope.$on('event:auth-loginConfirmed', function(data) {
                    if ($location.path() === "/login") {
                        $location.path('/').replace();
                    }
                });

                // Call when the 401 response is returned by the server
                $rootScope.$on('event:auth-loginRequired', function(rejection) {
                    Session.destroy();
                    if ($location.path() !== "/" && $location.path() !== "") {
                        $location.path('/login').replace();
                    }
                });

                // Call when the 403 response is returned by the server
                $rootScope.$on('event:auth-notAuthorized', function(rejection) {
                    $rootScope.errorMessage = 'errors.403';
                    $location.path('/error').replace();
                });

                // Call when the user logs out
                $rootScope.$on('event:auth-loginCancelled', function() {
                    $location.path('');
                });
        }]);
