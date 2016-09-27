$("#go").click(function(e){
	e.preventDefault();
	//$("#step1").hide();
	$("nav.overlay").show();
});
$("nav button").click(function(e){
	e.preventDefault();
	setTimeout(function(){
		$("nav.overlay, #step1").hide();
		$("#step2").show();
	},400);
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
						sp = 50; 
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
