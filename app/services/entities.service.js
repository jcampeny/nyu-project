
angular.module('app').service("EntitiesService",['$http', function( $http ) {
		var entitiesImgTop = ["articles","blog","cases","global","globecourse","mediakit","notes","other","podcasts","press","surveys","videos","working"];


		var groups = {
			cases:{name: "Cases & Teaching Notes", group: "Teaching Materials", state: "app.cases", suboptions: []},
            notes:{name: "Globalization Notes", group: "Teaching Materials", state: "app.notes", suboptions: []},
            surveys:{name: "Surveys", group: "Teaching Materials", state: "app.surveys", suboptions: []},
            other:{name: "Other Teaching Materials", group: "Teaching Materials", state: "app.other", suboptions: []}
        };

    	var entityLabels = {
            books    :{altName: "Books", name: "Books", group: "Publications", state: "app.books", suboptions: []},
            global   :{altName: "Globalization Index Reports", name: "Globalization Index Reports", group: "Publications", state: "app.global", suboptions: []},
            articles :{altName: "Articles & Book Chapters", name: "Articles & Book Chapters", group: "Publications", state: "app.articles", suboptions: []},
            working  :{altName: "Working Papers", name: "Working Papers", group: "Publications", state: "app.working", suboptions: []},
            blog     :{altName: "Blog Posts", name: "Blog", group: "Publications", state: "app.blog", suboptions: []},

            videos   :{altName: "Videos", name: "Videos", group: "News & Media", state: "app.videos", suboptions: []},
            podcasts :{altName: "Podcasts", name: "Podcasts", group: "News & Media", state: "app.podcasts", suboptions: []},
            press    :{altName: "Press", name: "Press", group: "News & Media", state: "app.press", suboptions: []},
            mediakit :{altName: "Media Kit", name: "Media Kit", group: "News & Media", state: "app.mediakit", suboptions: []},

            globecourse:{altName: "GLOBE Course", name: "GLOBE Course", group: "Teaching Materials", state: "app.globecourse", suboptions: [
                {id: "globedocuments", name: "GLOBE Documents", group: "GLOBE", state: "app.globedocuments"},
                {id: "globereadings", name: "GLOBE Readings", group: "GLOBE", state: "app.globereadings"},
                {id: "globecases", name: "GLOBE Cases", group: "GLOBE", state: "app.globecases"},
                {id: "globenotes", name: "GLOBE Notes", group: "GLOBE", state: "app.globenotes"},
                {id: "globepresentations", name: "GLOBE Presentations", group: "GLOBE", state: "app.globepresentations"}
            ]},
            cases   :{altName: "Cases & Teaching Notes", name: "Cases & Teaching Notes", group: "Teaching Materials", state: "app.cases", suboptions: []},
            notes   :{altName: "Globalization Notes", name: "Globalization Notes", group: "Teaching Materials", state: "app.notes", suboptions: []},
            surveys :{altName: "Surveys", name: "Surveys", group: "Teaching Materials", state: "app.surveys", suboptions: []},
            other   :{altName: "Other Teaching Materials", name: "Other Teaching Materials", group: "Teaching Materials", state: "app.other", suboptions: []}
 
        };

        var entityFilters = {
    		articles: {name: "Articles and Book Chapters", fields:["target","topic","country","date","language"]},
    		blog: {name: "Blog", fields:["topic","country","date","language"]},
    		videos: {name: "Videos", fields:["topic","country","date","language"]},
    		podcasts: {name: "Podcasts", fields:["topic","country","date","language"]},
    		press: {name: "Press", fields:["topic","country","date","language"]}
    	};

    	function getEntityLabels(){
    		return entityLabels;
    	}

    	function groupItems(entity){
    		var items = [];
    		var thisGroup = entityLabels[entity].group;

    		for (var item in entityLabels) {
			    if (entityLabels.hasOwnProperty(item) && entityLabels[item].group === thisGroup) {
			        items.push(entityLabels[item]);
			    }
			}

    		return items;
    	}

    	function hasTopImg(entity){
    		return entitiesImgTop.indexOf(entity) >= 0;
    	}

    	function showFilter(entity){
    		return (typeof entityFilters[entity] !== "undefined");
    	}

    	function hasFilter(entity, field){
    		return entityFilters[entity].fields.indexOf(field) >= 0;
    	}

    	function getFilterLabel(entity){
    		return entityFilters[entity].name;
    	}

	    return({
			groupItems      : groupItems,
			hasTopImg       : hasTopImg,
			getEntityLabels : getEntityLabels,
			showFilter      : showFilter,
			hasFilter       : hasFilter,
			getFilterLabel  : getFilterLabel
		});


	}]);
