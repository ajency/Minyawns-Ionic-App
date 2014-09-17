angular.module('minyawns.test', [])


.controller('TestController', ['$scope', function($scope) {

	$scope.jobs = [{"post_name":"Sweeping the front lawn","post_date":"07 Apr 2014","post_title":"Sweeping the front lawn","post_id":"1027","job_start_date":false,"job_end_date":false,"job_day":false,"job_wages":13.5,"job_start_day":false,"job_start_month":false,"job_start_year":false,"job_start_meridiem":"am","job_end_meridiem":"am","job_start_time":"11:14","job_end_time":"1:00","job_location":"Margao","job_details":"Test","tags":["Sweeping"],"job_author":" ","job_author_id":"","job_company":null,"job_company_location":null,"job_author_logo":"<img alt='' src='http:\/\/0.gravatar.com\/avatar\/?d=http:\/\/www.minyawns.ajency.in\/wp-content\/themes\/minyawns\/images\/profile.png&#038;s=96' class='avatar avatar-96 photo avatar-default' height='96' width='96' \/>","job_status":1,"user_to_job_status":[],"job_end_date_time_check":"3600","job_start_date_time_check":"40440","todays_date_time":1410872768,"post_slug":"sweeping-the-front-lawn-2","users_applied":[],"load_more":1,"user_profile_image":[],"user_rating_like":[],"user_rating_dislike":[],"default_user_avatar":"<img alt='' src='http:\/\/0.gravatar.com\/avatar\/?d=http:\/\/www.minyawns.ajency.in\/wp-content\/themes\/minyawns\/images\/profile.png&#038;s=96' class='avatar avatar-96 photo avatar-default' height='96' width='96' \/>","job_owner_id":0,"applied_user_id":[],"user_to_job_rating":[],"individual_user_to_job_status":null,"total":3,"job_categories":["Handyman"],"job_category_ids":[93],"job_category_slug":null,"is_verfied":[],"required_minyawns":"2","days_to_job_expired":-16329,"no_applied":0,"no_hired":0,"count_rated":1,"comment":""},{"post_name":"Wash my Bike","post_date":"07 Apr 2014","post_title":"Wash my Bike","post_id":"1020","job_start_date":false,"job_end_date":false,"job_day":false,"job_wages":18,"job_start_day":false,"job_start_month":false,"job_start_year":false,"job_start_meridiem":"am","job_end_meridiem":"pm","job_start_time":"11:06","job_end_time":"1:00","job_location":"1410 NE Campus Pkwy Seattle, WA 98195.","job_details":"I need my blue corvette cleaned. I need someone who knows how to use the car buffer and has cleaned classic cars before.","tags":["Washing"],"job_author":" ","job_author_id":"","job_company":null,"job_company_location":null,"job_author_logo":"<img alt='' src='http:\/\/0.gravatar.com\/avatar\/?d=http:\/\/www.minyawns.ajency.in\/wp-content\/themes\/minyawns\/images\/profile.png&#038;s=96' class='avatar avatar-96 photo avatar-default' height='96' width='96' \/>","job_status":1,"user_to_job_status":[],"job_end_date_time_check":"46800","job_start_date_time_check":"39960","todays_date_time":1410872768,"post_slug":"wash-my-bike","users_applied":[],"load_more":1,"user_profile_image":[],"user_rating_like":[],"user_rating_dislike":[],"default_user_avatar":"<img alt='' src='http:\/\/0.gravatar.com\/avatar\/?d=http:\/\/www.minyawns.ajency.in\/wp-content\/themes\/minyawns\/images\/profile.png&#038;s=96' class='avatar avatar-96 photo avatar-default' height='96' width='96' \/>","job_owner_id":0,"applied_user_id":[],"user_to_job_rating":[],"individual_user_to_job_status":null,"total":3,"job_categories":["Handyman"],"job_category_ids":[93],"job_category_slug":null,"is_verfied":[],"required_minyawns":"1","days_to_job_expired":-16329,"no_applied":0,"no_hired":0,"count_rated":1,"comment":""},{"post_name":"cleaning the garden","post_date":"07 Apr 2014","post_title":"cleaning the garden","post_id":"1025","job_start_date":false,"job_end_date":false,"job_day":false,"job_wages":9,"job_start_day":false,"job_start_month":false,"job_start_year":false,"job_start_meridiem":"am","job_end_meridiem":"pm","job_start_time":"9:00","job_end_time":"11:30","job_location":"margao","job_details":" I need my blue corvette cleaned. I need someone who knows how to use the car buffer and has cleaned classic cars before.","tags":["Cleaning"],"job_author":" ","job_author_id":"","job_company":null,"job_company_location":null,"job_author_logo":"<img alt='' src='http:\/\/0.gravatar.com\/avatar\/?d=http:\/\/www.minyawns.ajency.in\/wp-content\/themes\/minyawns\/images\/profile.png&#038;s=96' class='avatar avatar-96 photo avatar-default' height='96' width='96' \/>","job_status":1,"user_to_job_status":[],"job_end_date_time_check":"84600","job_start_date_time_check":"32400","todays_date_time":1410872768,"post_slug":"cleaning-the-garden","users_applied":[],"load_more":1,"user_profile_image":[],"user_rating_like":[],"user_rating_dislike":[],"default_user_avatar":"<img alt='' src='http:\/\/0.gravatar.com\/avatar\/?d=http:\/\/www.minyawns.ajency.in\/wp-content\/themes\/minyawns\/images\/profile.png&#038;s=96' class='avatar avatar-96 photo avatar-default' height='96' width='96' \/>","job_owner_id":0,"applied_user_id":[],"user_to_job_rating":[],"individual_user_to_job_status":null,"total":3,"job_categories":["Handyman"],"job_category_ids":[93],"job_category_slug":null,"is_verfied":[],"required_minyawns":"1","days_to_job_expired":-16329,"no_applied":0,"no_hired":0,"count_rated":1,"comment":""}]


	


	$scope.onItemClick = function(e){

		console.log('e');
		console.log(e)

	}

}])





.config(function($stateProvider) {
	
	$stateProvider

		.state('menu.test', {
	      url: "/test",
	      views: {
	        'menuContent' :{
	          templateUrl: "test/test.html",
	          controller: 'TestController'
	        }
	      }
	    })

});