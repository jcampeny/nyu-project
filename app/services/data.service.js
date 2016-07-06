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
    .service('DataService', ['$http', '$sce'/*, 'config'*/,'$state', '$q', '$rootScope', function($http, $sce/*, config*/, $state, $q, $rootScope){
        var posts = [];
        var filters = [];
        var globalSearch = "";
        var postsCountStart = 5;
        var customPosts = ['books','global','articles','working','blog','videos','podcasts','press','mediakit','globecases','globedocuments','globereadings','globenotes','globepresentations','cases','notes','other'];
        var mediaDB = {
            mediakit : [],
            header : [],
            others : [],
            all : []
        };
        return {
            all     : all,
            allCustomPosts : allCustomPosts,
            getById : getById,
            setFilter  : setFilter,
            getFilter   : getFilter,
            setPosts  : setPosts,
            getPosts  : getPosts,
            getPostsFiltered   : getPostsFiltered,
            getStateFilter : getStateFilter,
            resetFilter : resetFilter,
            setGlobalSearch : setGlobalSearch,
            customPosts : customPosts,
            getGlobalSearch : getGlobalSearch,
            postsToShow : postsToShow,
            postsCountStart : postsCountStart,
            downloadMedia : downloadMedia,
            htmlToPlaintext : htmlToPlaintext,
            getMediaHeader : getMediaHeader,
            getMediaKit : getMediaKit
            //searchOnPosts : searchOnPosts
        };
        /*function searchOnPosts(filter){
            var postsArray = getPostsFiltered(filter);

            angular.forEach(postsArray, function(postItem){
                postItem.content = ekdHighLight(filter.text, postItem.content);
            });

        }*/
        function postsToShow(state, newValue){
            angular.forEach(filters, function(filterItem, i){
                if(state && filterItem.type && (filterItem.type == state) ){
                        filters[i].toShow = newValue;
                }
            });
        }
        function setGlobalSearch(search){
            globalSearch = search;
        }
        function getGlobalSearch(){
            if(globalSearch){
                return globalSearch;                
            }else{
                return "";
            }

        }
        function resetFilter (filter){
            angular.forEach(filters, function(filterItem, i){
                if(filterItem.type == filter.type){
                    filters[i] = filter;
                }
            });
        }
        function setFilter(filter){
            getStateFilter(filter);

        }
        function getStateFilter(filter){
            var found = false;
            angular.forEach(filters, function(filterItem, i){
                if(filter && filterItem.type && filter.type && (filterItem.type == filter.type) ){
                    filter = filterItem;
                    filters[i] = filter;
                    found = true; 
                    if($state.current.url == 'state'){
                        filters[i].text = getGlobalSearch();
                    }
                }
            });
            if(!found && filter){
                filters.push(filter);
            }
            
            return filter;
        }

        function getFilter(filter){
            var actualFilter = getStateFilter(filter);
            //return decorateFilter(actualFilter);
            return actualFilter;
        }
        function setPosts(postArray, state){
            var newPost = {
                posts : postArray,
                state : state
            };
            var found = false;

            angular.forEach(posts, function(postItem, i){
                if(postItem.state == newPost.state) found = true;
            });

            if(!found) posts.push(newPost);
        }
        function getPostsFiltered(filter){
            var actualFilter = getStateFilter(filter);
            return filterPosts(actualFilter);
        }
        function getPosts(){
            return posts;
        }
        function ekdHighLight(word, theString){
            //theString sera POST
            var rgxp = new RegExp(word, 'gi');
            var position = theString.search(rgxp);
            var output = theString;
            if(position >= 0){
                output = output.replace('<span class="highlight-class">', '');
                output = [
                    output.slice(0, position), 
                    '<span class="highlight-class">', 
                    output.slice(position, position+word.length), 
                    '</span>', 
                    output.slice(position+word.length)
                    ].join('');

            }

            return output;
            //return {POST : modificado o no, found : false/true}
        }

        function searchWord(word, temporalPost){
            var found = false;
            var postDataLetSearch = [        
                'author',
                'title',
                'subtitle',
                'content_short',
                'content',
                'publicationType',
                'publication',
                'publisher',
                'pages',
                'other'
                ];
                
            for (var key in temporalPost){
                if(typeof temporalPost[key] == 'string'){
                    var theString  = temporalPost[key].toString();
                    var haveSpan = theString.search('<span class="highlight-class">');
                    var rgxp = new RegExp(word, 'gi');
                    var position = theString.search(rgxp);
                    if(position >= 0 && postDataLetSearch.indexOf(key) >= 0){
                        found = true;
                        if(haveSpan < 0){                       
                            temporalPost[key] = highlightIt(theString, word);
                        }
                    }                 
                }
            }
            return {
                found : found,
                post : temporalPost
            };
            /*EXTRAIBLE*/
            function highlightIt(theString, word) {
                var tags = [];
                var tagLocations = [];
                var htmlTagRegEx = /(<([^>]+)>)/ig;
                var rgxp = new RegExp(word, 'gi');

                //Extraemos las etiquetas HTML i los guardamos para volverlos a poner posteriormente
                angular.forEach(theString.match(htmlTagRegEx), function(htmlTag){
                    tagLocations.push(theString.search(htmlTagRegEx));
                    tags.push(htmlTag);
                    theString = theString.replace(htmlTag, '');
                });

                //Buscamos la palabra en el texto sin etiquetas
                var highlightHTMLStart = '<span class="highlight-class">';
                var highlightHTMLEnd = '</span>';
                var position = theString.search(rgxp);
                theString = [
                    theString.slice(0, position), 
                    highlightHTMLStart, 
                    theString.slice(position, position+word.length), 
                    highlightHTMLEnd, 
                    theString.slice(position+word.length)
                ].join('');

                //Volvemos a poner las etiquetas que hemos extraido anteriomente
                var textEndLocation = position + word.length;

                for(i=tagLocations.length-1; i>=0; i--){
                    var location = tagLocations[i];
                    if(location > textEndLocation){
                        location += highlightHTMLStart.length + highlightHTMLEnd.length;
                    } else if(location > position){
                        location += highlightHTMLStart.length;
                    }
                    theString = theString.substring(0,location) + tags[i] + theString.substring(location);
                }                    

                return  theString;
            }
            /*END EXTRAIBLE*/
        }
        function filterPosts(actualFilter){
            var filteredPosts = [];
           // var actualFilter = filterData;
            angular.forEach(posts, function(post){   
                if(actualFilter && (actualFilter.type == post.state)){
                    angular.forEach(post.posts, function(postItem){
                        var found = true;
                        var temporalPost;

                        temporalPost = angular.copy(postItem);
                        if(actualFilter){
                            if(found){found = searchTag(postItem, actualFilter.targetAudience, 'audience') ;}
                            if(found){found = searchTag(postItem, actualFilter.topic, 'topic') ;}
                            if(found){found = searchTag(postItem, actualFilter.country, 'country') ;}
                            if(found){found = searchTag(postItem, actualFilter.language, 'language') ;}
                            if(found){found = checkYear(postItem, actualFilter.yearFrom, actualFilter.yearTo);}
                            if(found && actualFilter.text && actualFilter.text.length > 1){
                                var searchController = searchWord(actualFilter.text, temporalPost);
                                found = searchController.found;
                                temporalPost = searchController.post;
                            }                    
                        }
                        if(found) filteredPosts.push(temporalPost);
                    });
                }

            });

            function checkYear(post, from, to){
                
                var valueReturn = false;
                if(from <= to && to){
                    var yearStrings = '';
                    if(!from){from = 1990;}

                    angular.forEach(post.tags.years, function(yearItem){
                        if(from == to){
                            if(yearItem.slug == from) valueReturn = true;
                        }else if(yearItem.slug >= from && yearItem.slug <= to ){
                            valueReturn = true;
                        }
                    });

                }else{valueReturn = true;}

                return valueReturn;
            }

            return {
                filter : filteredPosts.slice(0, actualFilter.toShow),
                total : filteredPosts
            };
        }
        function searchTag(post, filter, tag){
            
            var found = false;
            if(filter.length > 0){
                if(post.tags[tag]){
                    angular.forEach(post.tags[tag], function(tagItem){
                        angular.forEach(filter, function(filterItem){
                            if(tagItem.slug.toLowerCase() == filterItem.text.toLowerCase()) found = true;                        
                        });
                        
                    });
                }
            }else found = true;
            return found;

        }
        function decorateFilter(filter){
            var filterString = '';
            filterString += (filter.targetAudience.length === 0) ? '': getTagFilter(filter.targetAudience,'audience', filterString);
            filterString += (filter.topic.length === 0) ? '': getTagFilter(filter.topic,'topic', filterString);
            filterString += (filter.country.length === 0) ? '': getTagFilter(filter.country,'country', filterString);
            filterString += (filter.language.length === 0) ? '': getTagFilter(filter.language,'language', filterString);
            filterString += getTagFilter({from : filter.yearFrom, to : filter.yearTo},'years', filterString);
            return filterString;
        }
        function getTagFilter(tags, nameTag, filterString ){
            var decoratedFilter = '';
            if(nameTag === 'years'){
                if(tags.from < tags.to){
                    var yearStrings = '';
                    if(!tags.from){tags.from = 1990;}
                    for(var y = tags.from; y <= tags.to; y++ ){
                        yearStrings += y + ',';
                    }
                    decoratedFilter += (filterString !== '') ? '&filter['+nameTag+']='+yearStrings : '?_embed&filter['+nameTag+']='+yearStrings; 
                }else{/*catch error*/}
                
            }else{
                angular.forEach(tags, function(tag){
                    decoratedFilter += (filterString !== '') ? '&filter['+nameTag+']='+tag.text : '?_embed&filter['+nameTag+']='+tag.text;
                });                
            }

            return decoratedFilter;
        }
            function all(type, results, page, decorateCustom, filter) {
                var pagination = "";
                if(filter){
                    return getData(type+filter, decorateCustom);   
                }else{
                    if(typeof results !== "undefined"){
                        if(results === "all"){
                            pagination = "&page=1&per_page=100";    
                        }else{
                            pagination = (typeof page !== "undefined") ? ("&page="+page+"&per_page="+ results) : ("&page=1&per_page="+results);
                        }
                        
                    }
                    return getData(type+"?_embed"+pagination, decorateCustom);                    
                }

            }
            function allCustomPosts(results, page, decorateCustom, filter) {

                var defered = $q.defer();
                var promise = defered.promise;
                var postsLoadeds = [];

                angular.forEach(customPosts, function(customPost, i){
                    postsLoadeds[customPost] = getData(customPost+"?_embed" , decorateCustom);
                });

                $q.all(postsLoadeds).then(function(){
                    defered.resolve(postsLoadeds); 
                });

                return promise;
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
            function getMediaHeader(entity){
                var imgFound;
                angular.forEach(mediaDB.header, function(img){
                    if (img.location == entity) imgFound = img.source_url;
                });
                return imgFound;
            }
            function getMediaKit(){
                return mediaDB.mediakit;
            }
            function downloadMedia(){
                var path = "/wordpress/wp-json/wp/v2/";
                var pageController = {
                    page : 1,
                    items : 0,
                    per_page : 100
                };
                var mediaLoadeds = [];
                /* var mediaDB = {
                    mediakit : [],
                    header : [],
                    others : [],
                    all : []
                };*/ 
                getPage();

                function getPage(){
                    $http.get(path + 'media?_embed&page='+pageController.page+'&per_page='+pageController.per_page)
                        .then(function(response){
                            angular.forEach(response.data, function(item, i){
                                mediaDB.all.push(item);
                                pageController.items++;
                                switch (getTypeMedia(item)){
                                    case 'mediakit':
                                        mediaDB.mediakit.push(item);
                                        break;
                                    case 'header':
                                        var image = new Image();
                                        image.src = item.source_url;

                                        item.location = item.pure_taxonomies.header_media[0].slug;
                                        mediaDB.header.push(item);
                                        break;
                                    default :
                                        mediaDB.others.push(item);
                                }
                            });

                            pageController.page++;
                            if(pageController.items == pageController.per_page){
                                pageController.items = 0;
                                getPage();
                            }else{
                                $rootScope.$broadcast('mediaLoaded', {
                                    state : mediaDB
                                }); 
                            }
                    });
                }

                function getTypeMedia(item){
                    var type = 'other';
                    if(typeof item == 'object' && typeof item.pure_taxonomies== 'object'){
                        if(item.pure_taxonomies.header_media){
                            //item.pure_taxonomies.header_media[0].slug;
                            type = 'header';
                        }
                        if(item.pure_taxonomies.media_folder){
                            //item.pure_taxonomies.media_folder[0].slug;
                            type = 'mediakit';
                        }
                    }
                    return type;
                }
            }

            function getById(type, id) {
                return getData(type+'/' + id + '?_embed');
            }

            function getData(url, decorateCustom) {
                var path = "http://test-nyu.elkanodata.com/wordpress/wp-json/wp/v2/";
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
                    share           : (result.share === 'on') ? true : false,
                    type            : result.type,
                    tags            : {
                        audience : result.pure_taxonomies.audience,
                        country  : result.pure_taxonomies.country,
                        language : result.pure_taxonomies.language,
                        topic    : result.pure_taxonomies.topic,
                        years    : result.pure_taxonomies.years
                    }
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

