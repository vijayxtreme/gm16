$("#go").click(function(e){
	e.preventDefault();
	//$("#step1").hide();
	$("nav.overlay").show();
});
$(".overlay_step.move_size button").click(function(e){
	e.preventDefault();
	$(".overlay_step.move_size").hide();
	$(".overlay_step.datepicker").show();
});

$("#info-show").click(function(e){
	e.preventDefault();
	$("aside#info").show();
});
$("#close-button").click(function(e){
	e.preventDefault();
	$("aside#info").hide();
});
$("#calculate").click(function(e){
	e.preventDefault();
	$("#step2").hide();
	$("#step3").show();
	searchBarAnimate();
});
$("#get-my-quotes").click(function(e){
	e.preventDefault();
	$("#step4").hide();
	$("#thank-you").show();
});

$("#calendar").datepicker({
	onSelect:function(){
		$("nav.overlay, #step1").hide();
		$("#step2").show();
	}
});

$(".ziphelp").click(function(e){
	e.preventDefault();
	$(".zips").show();
});


$("#from_zip").mask('99999', {placeholder:""});
$("#to_zip").mask('99999', {placeholder:""});
$("#phone_num").mask('(999) 999-9999', {placeholder:""});

function searchBarAnimate(){
	var $bar = $(".bar");
	var $loadheading = $("#loader-heading");
	var $loadtime = $("#loader-text");
	var inc = 8;

	var sp = 50;
		
	animateOrangeLoader(inc, sp);
						
	function animateOrangeLoader(inc, sp){
		var timer = setInterval(function(){
      //width of the bar holder
			if(inc < 99){
        	//inc increments the bar's width every 20 milliseconds
				inc++;

				if(inc == 50){
					$loadheading.text("Searching For Movers...")
					clearInterval(timer);
					timer = setTimeout(function(){
						sp = 150; 
						animateOrangeLoader(inc, sp);
					}, 300);
					
				}
				
				if(inc == 75){
					$loadheading.text("Matching Movers Found!")
				
					clearInterval(timer);
					timer = setTimeout(function(){
						sp = 90;
						animateOrangeLoader(inc, sp);
					}, 800);
					
				}
				
				$bar.css('width',inc + "%");
				$loadtime.text(Math.floor(inc));
			}else {
				$loadtime.text("100");
				clearInterval(timer);
       			setTimeout(function(){
       				$("#step3").hide();
       				$("#step4").show();
       			}, 500);

      	}
				
	}, sp);
  }
}

//zipfinder
(function(){
	$.fn.zipfinder = function(){
		return this.each(function(){
			//the zipfinder div
			var $zipfinder = $(this),
				$field = $zipfinder.prev(".zipcode"),
				$statePage = $zipfinder.find(".zh-state"),
				$cityPage = $zipfinder.find(".zh-city"),
				//$loader = $zipfinder.find(".zh-loader"),
				$stateHolderScroller = $(".zh-state-holder"),
				$cityHolderScroller = $(".zh-city-holder"),
				isClickable = true,
				isScrolling = false,
				isPageEnd,
				shouldScrollOnPageLoad = false;
			
			initiate();
			
			function initiate(){
				
				$cityHolderScroller.mCustomScrollbar({
					theme:"dark-thin",
					callbacks:{
						onScrollStart: function(){
							isScrolling = true;
						},
						onScroll:function(){
							isScrolling = false;
						},
						onTotalScroll:function(){
							isPageEnd = true;
							console.log("the end");
						},
					}
				}); 
			
				$stateHolderScroller.mCustomScrollbar({
					theme:"dark-thin",
					callbacks:{
						onScrollStart: function(){
							isScrolling = true;
						},
						
						onScroll:function(){
							isScrolling = false;
						},
						onTotalScroll:function(){
							isPageEnd = true;
							console.log("the end");
						},
					}
				});

				$statePage.on("click", ".state", function(){
			
					if (isScrolling == false){
						if (isClickable == true){
							var $state = $(this); //state
							var stateName = $state.data("state");
							var stateFullName = $state.data("abbr");
							getCity(stateName);
							
							$(".select-state").text(stateFullName);
							isClickable = false;
							$zipfinder.find(".zh-city-holder").mCustomScrollbar("update");
							//$loader.show();
							$(".state").removeClass("selected");
							$state.addClass("selected");
							
						}
						
					} else {
						$stateHolderScroller.mCustomScrollbar("stop");
						$stateHolderScroller.mCustomScrollbar("update");
						isScrolling = false;	
					}					
				});
				
				$cityPage.on("click", ".city", function(){
					if (isScrolling == false){
						if (isClickable == true){	
							var $city = $(this);
							console.log($city);

							$city.addClass("selected");
							var theTimer = setTimeout(function(){
								$city.removeClass("selected");
							}, 100);
							
							$("input.zipcode.active").val($(this).data("zipcode"));
							setTimeout(function(){
								closeZiphelp();
							}, 10);
							
						}
					
					} else {
						$cityHolderScroller.mCustomScrollbar("stop");
						$cityHolderScroller.mCustomScrollbar("update");
						isScrolling = false;
					
					}
					
				});
				
				$(".zip-alpha, .zip-alpha-mini").on("click", ".scrollToSelected", function(){
					if (isClickable == true){
						var $alpha = $(this);
						var alphabet = $alpha.text();
						$(".scrollToSelected").removeClass("selected");
						$alpha.addClass("selected");
						
						
						if ($(".city[data-alphabet='"+alphabet+"']").length >0) {
							console.log(true);
							$(".zh-city-holder").mCustomScrollbar("scrollTo", $(".city[data-alphabet='"+alphabet+"']"));
						}
					
					}
				});
				$("#zip-close-btn").click(closeZiphelp);
				
				$("#back").on("click", function(){
					changePage($cityPage, $statePage);
					$("#back").addClass("inactive");
					$(".zip-holder").removeClass("cities");		

					if($(".tiny").is(":visible")){
						$(".zip-alpha-mini").addClass("inactive");
						$(".zh-state").show();
					}else{
						$(".zip-alpha").addClass("inactive");
						$(".zh-state").addClass("default");
					}

					$(".zh-city").hide();
					$(".zh-state").show();
					$statePage.find(".state.clicked").removeClass("clicked");
				});

				// $("#zip-close-btn").click(function(){

				// });
			}
				
			function getCity(stateAbbr){
					$("section.spinner").show();
					//create a fake server -- replace this with staging code instead
					$.get(
						'http://localhost:1337',
						function(data){
							var info = data;
							var $container = $zipfinder.find(".zh-city-holder .mCSB_container");
							
							$container.empty();
							
							$.each(info, function(index, value){
							 	var temp = "<div class='city' data-zipcode='"+ value.zipcode+"' data-alphabet='"+value.first_letter_city+"' >"+ capitalize(value.city_name.toLowerCase() )+"</div>";
							 	$container.append(temp);
							 });

						}
						
					).done(function(){
						//$loader.hide();
						$("section.spinner").hide();
						changePage($statePage, $cityPage); //change page
						$("#back").removeClass("inactive");

						changeZipHolder();
					});
			}
			function closeZiphelp(){
				
				shouldScrollOnPageLoad = true;
				$("#back").addClass("inactive");
				$(".zip-holder").removeClass("cities");		
				if($(".tiny").is(":visible")){
					$(".zip-alpha-mini").addClass("inactive");
					$(".zh-state").show();
				}else{
					$(".zip-alpha").addClass("inactive");
					$(".zh-state").addClass("default");
				}
				$(".zh-city").hide();
				$(".zh-state").show();
				$(".zips").hide();
				isClickable = true;
				
			}
			
			function changePage($firstPage, $secPage){
				$firstPage.fadeOut(150,function(){
					resetAlphabet();
				});
				$secPage.fadeIn(150);
				isClickable = true;
				
			}
			
			function resetAlphabet(){
				$cityPage.find(".scrollToSelected").removeClass("selected").first().addClass("selected");
			}
		});
	};
})();

$(".zips").zipfinder();
window.addEventListener("resize", changeZipHolder, false);

function changeZipHolder(){

	$(".zh-city-holder").mCustomScrollbar("scrollTo", "top");
	if($(".tiny").is(":visible")){
		if($(".zh-city").is(":visible")){
			$(".zip-alpha-mini").removeClass("inactive");
			$(".zip-alpha").addClass("inactive");
			$(".zh-city").addClass("default");
			$(".zip-holder").addClass("cities");
		}
	}else if($(".tiny").not(":visible")){
		if($(".zh-city").is(":visible")){
			$(".zip-alpha-mini").addClass("inactive");
			$(".zip-alpha").removeClass("inactive");
			$(".zh-city").removeClass("default");
			$(".zip-holder").removeClass("cities");
		}
	}
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
