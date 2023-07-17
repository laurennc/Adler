//function connectToOpenSpace()
//{
//	//setup the api params
//	///var host = document.getElementById('ipaddress').value;
//	api = openspaceApi(ipAddress, port); //4682
//	
//	//notify users on disconnect			
//	api.onDisconnect( onDisconnectScript() );
//					
//	//notify users and map buttons when connected
//	api.onConnect( onConnectScript() );
//	
//	//connect
//	api.connect();
//	
//	buildInformationPanel();								//This function initlaized the page content based on the default 'current' variable assignments.
//}
//
//function onDisconnectScript()
//{
//	console.log("disconnected");
//	openspace = null;
//}
//
//async function onConnectScript()
//{
//	try
//	{
//		openspace = await api.library();
//		console.log('connected');
//		mapButtons(openspace);
//	}
//	catch (e) 
//	{
//		console.log('OpenSpace library could not be loaded: Error: \n', e)
//		return;
//	}	
//}

async function up()
{
	openspace.navigation.addGlobalRotation(0.0,5.0);
}

async function right()
{
	openspace.navigation.addGlobalRotation(-5.0,0.0);
}

async function down()
{
	openspace.navigation.addGlobalRotation(0.0,-5.0);
}

async function left()
{
	openspace.navigation.addGlobalRotation(5.0,0.0);
}

async function plusSign()
{
	openspace.navigation.addTruckMovement(0.0, 5.0);
}

async function minusSign()
{
	openspace.navigation.addTruckMovement(0.0, -5.0);
}

async function back()
{
	openspace.pathnavigation.flyTo('Moon');
}

//START -- buildInformationPanel() --
		function buildInformationPanel()								//This function rebuilds the Information Panel each time the page or language is changed, and when the page loads.
		{
			if (currentLanguage=="English")
			{
				//change information panel based on current settings
				$('#informationHeader').html(information[currentTopic][currentPage].header);
				$('#informationText1').html(information[currentTopic][currentPage].text1);
				$('#informationText2').html(information[currentTopic][currentPage].text2);
				$('#informationText3').html(information[currentTopic][currentPage].text3);
				
				//switch speaker audio
				audio=new Audio(information[currentTopic][currentPage].narration);				//'audio' is a global variable initalized in 'index.html'
			}
			else if (currentLanguage=="Spanish")
			{
				//change information panel based on current settings
				$('#informationHeader').html(information[currentTopic][currentPage].headerSpan);
				$('#informationText1').html(information[currentTopic][currentPage].text1Span);
				$('#informationText2').html(information[currentTopic][currentPage].text2Span);
				$('#informationText3').html(information[currentTopic][currentPage].text3Span);
			
				//switch speaker audio
				audio=new Audio(information[currentTopic][currentPage].narrationSpan);			//'audio' is a global variable initalized in 'index.html'
			}
			else;
				
		}
//END -- buildInformationPanel() --

//START -- turnPage(direction) --
		function turnPage(direction)									//This function changes the 'currentPage' variable, and makes the arrows invisible when the first or last pages are reached
		{
			if (direction=="right")
			{
				if (currentPage<(information[currentTopic].length-1))
				{
					currentPage++;
				}
				
			}
			else if (direction=="left")
			{
				if (currentPage!=0)
				{
					currentPage--;
				}
				
			}
			else;
		
			if (currentPage==0)
			{
				//make left arrow disappear
				$('#leftArrow').css("display","none");
			}
			else if (currentPage==(information[currentTopic].length-1))
			{
				//make right arrow disappear
				$('#rightArrow').css("display","none");
				
			}
			else
			{	
				$('#leftArrow').css("display","block");
				$('#rightArrow').css("display","block");
			}
			
			console.log(currentPage);
			buildInformationPanel();
			
		}
//END -- turnPage(direction) --

//START -- narrationToggle() --
		function narrationToggle()									//This function toggles narration on and off.
		{
			if (narrationOn)
			{
				$('#speakerAnimationLayer').removeClass("imageOverlaySpeakerAnimation");
				audio.pause();										//stopping audio is a combintation of pausing and resetting the timeer to 0
				audio.currentTime = 0;  							//'audio' is defined in index.html with the global variables, and changes in the 'buildInformationPanel()' function
				
				narrationOn=false;
			}
			else
			{
				$('#speakerAnimationLayer').addClass("imageOverlaySpeakerAnimation");
				audio.play();										//'audio' is defined in index.html with the global variables, and changes in the 'buildInformationPanel()' function
				narrationOn=true;
			}
		}
//END -- narrationToggle() --


//START -- languageChoice(language) --
		function languageChoice(language)							//This function changes the 'currentLanguage' variable, and flips the 'selectedLanguage' styling to the newly selected language
		{
			if (language=="English")
			{
				$('#spanish').removeClass("selectedLanguage");
				$('#english').addClass("selectedLanguage");
						
				currentLanguage="English";
			}
			else if (language=="Spanish")
			{
				$('#english').removeClass("selectedLanguage");
				$('#spanish').addClass("selectedLanguage");
				
				currentLanguage="Spanish";
			}
			else;
			
			buildInformationPanel();
		}
//END -- languageChoice(language) --

