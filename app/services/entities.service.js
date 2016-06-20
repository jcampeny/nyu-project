
angular.module('app').service("EntitiesService",['$http', function( $http ) {
		var entitiesImgTop = ["articles","blog","cases","global","globecourse","mediakit","notes","other","podcasts","press","surveys","videos","working"];

    	var entityLabels = {
            books:{name: "Books", group: "Publications", state: "app.books", suboptions: []},
            global:{name: "Globalization Index Reports", group: "Publications", state: "app.global", suboptions: []},
            articles:{name: "Articles & Book Chapters", group: "Publications", state: "app.articles", suboptions: []},
            working:{name: "Working Papers", group: "Publications", state: "app.working", suboptions: []},
            blog:{name: "Blog", group: "Publications", state: "app.blog", suboptions: []},

            videos:{name: "Videos", group: "News & Media", state: "app.videos", suboptions: []},
            podcasts:{name: "Podcasts", group: "News & Media", state: "app.podcasts", suboptions: []},
            press:{name: "Press", group: "News & Media", state: "app.press", suboptions: []},
            mediakit:{name: "Media Kit", group: "News & Media", state: "app.mediakit", suboptions: []},

            globecourse:{name: "GLOBE Course", group: "Teaching Materials", state: "app.globecourse", suboptions: [
                {id: "globedocuments", name: "GLOBE Documents", group: "GLOBE", state: "app.globedocuments"},
                {id: "globereadings", name: "GLOBE Readings", group: "GLOBE", state: "app.globereadings"},
                {id: "globecases", name: "GLOBE Cases", group: "GLOBE", state: "app.globecases"},
                {id: "globenotes", name: "GLOBE Notes", group: "GLOBE", state: "app.globenotes"},
                {id: "globepresentations", name: "GLOBE Presentations", group: "GLOBE", state: "app.globepresentations"}
            ]},
            cases:{name: "Cases & Teaching Notes", group: "Teaching Materials", state: "app.cases", suboptions: []},
            notes:{name: "Globalization Notes", group: "Teaching Materials", state: "app.notes", suboptions: []},
            surveys:{name: "Surveys", group: "Teaching Materials", state: "app.surveys", suboptions: []},
            other:{name: "Other Teaching Materials", group: "Teaching Materials", state: "app.other", suboptions: []}
 
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

	    return({
			groupItems      : groupItems,
			hasTopImg       : hasTopImg,
			getEntityLabels : getEntityLabels
		});


	}]);
