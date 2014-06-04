$(document).ready(function(){
    $('#pop').hide();
    $('#frame2').hide();
    $('#pub').hide();
    $('#content,#pdf-pub1,#pdf-pub2,#process').hide();
    var webpage = 0;
    var first = 0;
    function youtube_parser(url)
        {
    		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    		var match = url.match(regExp);
    		if (match&&match[7].length==11)
                {
        	  return match[7];
    		}
                else
		{
		  return 1;
    		}
        }
   function checkurl(url, fnum)
	{
		$.getJSON("http://query.yahooapis.com/v1/public/yql?"+"q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(url)+"%22&format=xml'&callback=?",     		
		function(data){
		if(data.results[0]){ 
			if (fnum == 0){
					frames[0].location="http://127.0.0.1:5000/?foruri="+encodeURIComponent(url);
					$('#cont,#content').fadeIn("slow"); } 
			else{
					frames[1].location="http://127.0.0.1:5000/?foruri="+encodeURIComponent(url); 
					if(document.getElementById('ut1').checked)
					{
						$('#pdf-pub1').fadeIn("slow");
					}
					if(document.getElementById('t3').checked || document.getElementById('t4').checked)
					{
						$('#pdf-pub2').fadeIn("slow");
					}
					$('#pop').hide(); 
					$('#cont,#url,#pub').fadeIn("slow"); }
				} else{ alert("URL doesn't exist!!!"); $('#cont,#content,#pdf-pub1,#pdf-pub2').fadeOut("slow");}      		
		});
		
	}	
   function fadein()
	{
			if(document.getElementById('mt3').checked || document.getElementById('ut1').checked)
			{
				$('#pdf-pub1').fadeIn("slow");
			}
			if(document.getElementById('t3').checked || document.getElementById('t4').checked)
			{
				$('#pdf-pub2').fadeIn("slow");
			}
			$('#pop').hide();
        		$('#cont,#url,#pub').fadeIn("slow");
	}
   function send_data(pub_data)
	{
		$.post("http://127.0.0.1:5000/publish", pub_data)
		  .done(function(data) {
			//alert("Data Loaded: "+ data);
			console.log(data);
		  });
	}
			
   $('#submit').click(function(){
	webpage = 0;
	if (first == 1)
	{
		if(document.getElementById('ut1').checked || document.getElementById('mt3').checked) {
			$('#pdf-pub1').fadeIn("slow"); }
		else {
			$('#pdf-pub1').fadeOut("slow"); }
	}
			
       foruri = document.getElementById("inputurl").value;
	if(foruri != '')
	{
		if(foruri.substring(0,7) == "http://") {
       		if (document.getElementById('ut1').checked)
                {	
			checkurl(foruri, 0);	
                }
       		else if (document.getElementById('ut2').checked)
                {
			if (document.getElementById('mt1').checked)
                        {
                            var id = youtube_parser(foruri);
			    if (id == 1)
		    	    {
				$('#cont,#content').fadeOut("slow",function(){});
				alert("URL Incorrect!!!");
		    	    }
		    	    else
		    	    {
			    	frames[0].location="http://www.youtube.com/embed/"+id;
				$('#cont,#content').fadeIn("slow");
			    }
                        }
      			else if (document.getElementById('mt2').checked || document.getElementById('mt3').checked)
                        { 
                            frames[0].location=foruri; 
			    $('#cont,#content').fadeIn("slow");
                        }
                        else
                        {
			   $('#cont,#content').fadeOut("slow");
                           alert("Please select a Media Type!!!");
                        }	
                }
		else
		{
		       $('#cont,#content').fadeOut("slow");
		       alert("Please Select the Type of the URL!!!");
         	}
		}
		else {

		       $('#cont,#content').fadeOut("slow");
    			alert("Please enter 'HTTP' protocoled URL");
    		}
	}
	else
	{

		$('#cont,#content').fadeOut("slow");
		alert("Please Enter the URL!!!");
	}                  
   }); 
   $('#renarrate').click(function(){
	if(document.getElementById('ut1').checked){  
	webpage = 1;
	first = 1; }
       $('#cont,#url,#renarrate,#display').fadeOut("slow",function(){});
       $('#pop').show();
   });
    $('#rsubmit').click(function(){ 
        var rurl=document.getElementById('rurl').value;
        if (rurl != '')
	{
		if(rurl.substring(0,7) == "http://") {
                $('#frame2').show();
		if (document.getElementById('t1').checked)
                {
                    var id = youtube_parser(rurl);
		    if (id == 1)
		    {
			alert("URL Incorrect!!!");
		    }
		    else
		    {
			frames[1].location="http://www.youtube.com/embed/"+id;
			fadein();
		    }
                }
                else if (document.getElementById('t2').checked || document.getElementById('t3').checked)
                { 
                    document.getElementById('frame2').src=rurl; 
		    fadein();
		}
                else if (document.getElementById('t4').checked)
                {  
			checkurl(rurl, 1);
		}
		else
		{
			alert("Please Select the Type of the URL!!!");
        	}
		}
		else{
			alert("Please enter a HTTP protocoled URL!!!");
		}
	}
	else
	{
		alert("Please Enter the URL!!!");
	}
	if (webpage == 1) {
		$('#pdf-pub1').fadeIn("slow"); }
    });
    $('#return').click(function(){
	first = 0;
        $('#pop, #pdf-pub1, #pdf-pub2, #frame2').hide();
        $('#cont,#url,#renarrate,#display').fadeIn("slow");
    });
    $('#ret').click(function(){
	first = 0;
	$('#pub,#pdf-pub1, #pdf-pub2, #frame2').hide();
	$('#url,#renarrate,#display, #frame1').fadeIn("slow");
    });
    $('#publish').click(function(){
	var data = {};
	var how = {};
	data["who"] = prompt("Your Name please", "");
	data["what"] = "SML";
	data["where"] = document.getElementById("inputurl").value; 
	how["type"] = prompt("Enter the Type of the content you are linking", "");
	how["url"] = document.getElementById('rurl').value;
	if(webpage == 1 || document.getElementById('ut1').checked)
	{
		how["text0"] = document.getElementById("text1").value;
	}
	if(document.getElementById('t3').checked || document.getElementById('t4').checked)
	{
		how["text1"] = document.getElementById("text2").value;
	}
	if(document.getElementById('mt1').checked || document.getElementById('mt2').checked)
	{
		if(document.getElementById('mt1').checked)
		{
			how["video0"] = {
						strt_time0 : prompt("Enter the start time of the content you are linking (in HH:MM:SS format)", ""),
						stop_time0 : prompt("Enter the stop time of the content you are linking (in HH:MM:SS format)", "")
					};	
						
		}
		else{
			how["audio0"] = {
						strt_time0 : prompt("Enter the start time of the content you are linking (in HH:MM:SS format)", ""),
						stop_time0 : prompt("Enter the stop time of the content you are linking (in HH:MM:SS format)", "")
					};
		}
	}
	if(document.getElementById('t1').checked || document.getElementById('t2').checked)
	{
		if(document.getElementById('t1').checked)
		{
			how["video1"] = {
						strt_time1 : prompt("Enter the start time of the content to be linked", ""),
						stop_time1 : prompt("Enter the stop time of the content to be linked", "")
					};
		}
		else{
			how["audio1"] = {
						strt_time1 : prompt("Enter the start time of the content to be linked", ""),
						stop_time1 : prompt("Enter the stop time of the content to be linked", "")
					};
		}
	}
	data["how"] = how;
	data = JSON.stringify(data);
	send_data(data);
	alert("Data Sent!!!");
	alert("Thanks for linking!!!");
    });
    $('#display').click(function() {
	var foruri = document.getElementById('inputurl').value;
	frames[1].location = "http://127.0.0.1:5000/see_links?foruri=" + encodeURIComponent(foruri) ;
	$('#frame2').show("slow");
    });
});