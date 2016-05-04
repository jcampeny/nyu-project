# README #

## What is this? ##

This is an angular project seed to start web applications based on AngularJS framework and Wordpress as CMS.
It has the most basic file structure and configuration to start this kind of projects.

Works with:
 - Bootstrap
 - FontAwesome
 - Sass

## How to install? ##

## Setting Up Wordpress

1. Download and install Wordpress ([Download link](https://wordpress.org/download/))
2. Enable pretty permalinks (`Settings -> Permalinks`), select "custom structure" and use the string `/%post_id%/%postname%`.
3. Install the [**JSON REST API (WP-API) V2**](https://wordpress.org/plugins/rest-api/) plugin. Easiest way is to use the `Plugins -> Add New` feature of the Wordpress
admin interface. Manual install instructions can be found on the [WP-API repo](http://v2.wp-api.org/).
4. By default, the [AngularJS service that communicates with Wordpress](app/services/data.service.js). It implements other functionalities for retrieving data from Wordpress


## Setting the Client

If you dont have Nodejs installed, you must do it at this point. Please visit: http://nodejs.org/ for instructions


Install dependencies
 
	npm install
	
	bower install


## How to run the webapp? ##

Start Grunt for development

	grunt dev


## How to run the tests? ##

	The tests run everytime a file is changed


## How to run update webapp? ##

Install npm-check-updates

	 npm install -g npm-check-updates

Run the following command to update package.json file with new versions

	npm-check-updates -u

Update modules:

	npm install 


