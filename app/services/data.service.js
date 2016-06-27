/**
 * The BlogService retrieves and processes the json response from WP-API into a form that Angular can use.
 *
 * @param $http
 * @param $sce
 * @param config
 * @returns {{allPosts: allPosts, allPostsByTag: allPostsByTag, allPostsBySearchTerm: allPostsBySearchTerm, featuredPosts: featuredPosts, post: post}}
 * @constructor
 */
 angular
    .module('app')
    .service('DataService', ['$http', '$sce'/*, 'config'*/, function($http, $sce/*, config*/){
        return {
            all     : all,
            getById : getById
        };
       

            function all(type, results, page, decorateCustom) {
                var pagination = "";
                if(typeof results !== "undefined"){
                    if(results === "all"){
                        pagination = "&page=1&per_page=100";    
                    }else{
                        pagination = (typeof page !== "undefined") ? ("&page="+page+"&per_page="+ results) : ("&page=1&per_page="+results);
                    }
                    
                }
                return getData(type+"?_embed"+pagination, decorateCustom);
            }

            // function allByTag(type, tag) {
            //     return getData(type+'?filter[tag]=' + tag);
            // }

            // function allPostsBySearchTerm(searchTerm) {
            //     return getData('posts?filter[category_name]=post&filter[s]=' + searchTerm);
            // }

            // function featuredPosts() {
            //     return getData('posts?filter[category_name]=post%2Bfeatured');
            // }

            function getById(type, id) {
                return getData(type+'/' + id + '?_embed');
            }

            function getData(url, decorateCustom) {
                var path = "/wordpress/wp-json/wp/v2/";
                return $http
                    .get(path + url, { cache: true })
                    .then(function(response) {
                        if (response.data instanceof Array) {
                            var items = response.data.map(function(item) {
                                return decorateResult(item, decorateCustom);
                            });
                            return items;
                        } else {
                            return decorateResult(response.data, decorateCustom);
                        }
                    });
            }

            /**
             * Decorate a post to make it play nice with AngularJS
             * @param result
             * @returns {*}
             */
            function decorateResult(result, decorateCustom) {
                if(typeof result.taxonomy === "undefined"){
                    result.title = (result.title) ? $sce.trustAsHtml(result.title.rendered) : '';
                    //result.excerpt = $sce.trustAsHtml(result.excerpt.rendered);
                    result.date = Date.parse(result.date);
                    //result.content_untrust = result.content.rendered;
                    result.content = (result.content) ? $sce.trustAsHtml(result.content.rendered) : '';


                    if(typeof result._embedded !== "undefined" && typeof result._embedded['wp:featuredmedia'] !== "undefined" && result._embedded['wp:featuredmedia'].length > 0){
                        result.image = result._embedded['wp:featuredmedia'][0].source_url;
                    }

                    if(typeof result._embedded !== "undefined" && typeof result._embedded['wp:term'] !== "undefined" && result._embedded['wp:term'].length > 0){
                        result.embed_categories = [];

                        angular.forEach(result._embedded['wp:term'],function(term){
                            if(Array.isArray(term)){
                                angular.forEach(term, function(cat){
                                    if(cat.taxonomy === "category"){
                                        result.embed_categories.push(cat.slug);
                                    }
                                });
                            }
                        });
                    }
                }
                if(decorateCustom){
                    return decoratePankaj(result);
                }else{
                    return result;
                }
                
            }

            /**
             * Decorate a post to make it play nice with Pankaj
             * @param result
             * @returns {*}
             */
            function decoratePankaj(result) {
                var item = {
                    id              : result.id,
                    author          : result.author,
                    title           : result.title_metabox,
                    subtitle        : result.subtitle,
                    content_short   : result.content_short,  
                    content         : result.content_metabox,
                    publicationType : result.publication_type,
                    publication     : result.publication,
                    publisher       : result.publisher,
                    date            : result.date_metabox,
                    pages           : result.pages     ,
                    other           : result.other     ,
                    main_cta        : result.main_cta  ,
                    main_cta_2      : result.main_cta_2,
                    other_cta       : result.other_cta ,
                    ext_link        : result.ext_link  ,
                    pdf_link        : result.pdf_link  ,
                    xls_link        : result.xls_link  ,
                    picture         : (result.image) ? result.image : '',
                    audio           : result.audio     ,
                    share           : (result.share === 'on') ? true : false
                };
                if(result.type === 'latest'){
                    item = {
                        id      : result.id,
                        content : result.content,
                        link    : htmlToPlaintext(result.excerpt.rendered),
                        picture : (result.image) ? result.image : ''
                    };
                }
                return item;
            }
            function htmlToPlaintext(text){

                return  text ? String(text).replace(/<[^>]+>/gm, '') : ''; 

            }
    }]);

