'use strict';

var services = angular.module('SchoolServices', ['ngResource']);

var lhost = 'http://localhost:5000/';
//var rhcloud = 'http://server-foodplaner.rhcloud.com/rest/v1/'; // to change
var domainUrl = lhost;

/*
  $http.defaults.headers.common = {'Access-Control-Request-Headers': 'accept, origin, authorization'};
  $http.defaults.headers.common = {'Access-Control-Expose-Headers': 'Origin, X-Requested-With, Content-Type, Accept'};
  $http.defaults.headers.common['Cache-Control'] = 'no-cache';
  $http.defaults.headers.common.Pragma = 'no-cache';
  //$http.defaults.headers.common.Authorization = 'Basic YWRtaW46cGFzc3dvcmQ=';
  */

services.factory('LoginService', function ($resource) {
  //console.log($http.defaults.headers.common.Authorization);
  return $resource(domainUrl + 'login', {}, {
    save: {method: 'POST'},
  });
});

services.factory('ClassesService', function ($resource, $http, localStorageService) {
  $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('credentials');
  console.log($http.defaults.headers.common.Authorization);
  return $resource(domainUrl + 'classes', {}, {
    query: {method: 'GET'/*, isArray: true*/},
  });
});

/*
 wyślij formularz do analizy przepisu
 ścieżka: /crawler/recipe/send
 metoda: PUT
 HEADER: brak
 IN: RecipeForm
 OUT: RecipeAnalized
 */
/*services.factory('RecipeSendService', function ($resource) {
  return $resource(domainUrl + 'crawler/recipe/send', {}, {
    update: {method: 'PUT'}
  });
});*/

/*
 potwierdź przeanalizowany przepis
 ścieżka: /crawler/recipe/confirm
 metoda: PUT
 HEADER: brak
 IN: RecipeAnalized
 OUT: brak
 wyjątki:
 InvalidRecipeDataException (403 Forbidden)
 */
/*services.factory('RecipeConfirmService', function ($resource) {
  return $resource(domainUrl + 'crawler/recipe/confirm', {}, {
    update: {method: 'PUT'}
  });
});*/

/*
 pobierz kategorie
 ścieżka: /crawler/category
 metoda: GET
 HEADER: brak
 IN: brak
 OUT: List<CategoryForm>

 dodaj kategorię
 ścieżka: /crawler/category
 metoda: PUT
 HEADER: brak
 IN: CategoryForm
 OUT: brak
 wyjątki:
 ValidationException (409 Conflict) - np. już taka kategoria jest w bazie danych
 */
/*services.factory('CategoryService', function ($resource) {
  return $resource(domainUrl + 'crawler/category', {}, {
    query: {method: 'GET', isArray: true},
    update: {method: 'PUT'}
  });
});*/


/*
 pobierz składniki
 ścieżka: /crawler/ingredient
 metoda: GET
 HEADER: brak
 IN: brak
 OUT: List<IngredientAnalized>

 dodaj składnik
 ścieżka: /crawler/ingredient
 metoda: PUT
 HEADER: brak
 IN: IngredientAnalized
 OUT: brak
 wyjątki:
 ValidationException (409 Conflict) - np. już taki składnik jest w bazie danych
 */
/*services.factory('IngredientService', function ($resource) {
  return $resource(domainUrl + 'crawler/ingredient', {}, {
    query: {method: 'GET', isArray: true},
    update: {method: 'PUT'}
  });
});*/
