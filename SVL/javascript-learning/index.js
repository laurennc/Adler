//START CREATING BUTTONS WITH JAVASCRIPT LEARNING 
const name = document.querySelector(".name");
function changeColor() {
	if (name.style.color == "blue") {
		name.style.color = "red";
	}
	else if (name.style.color == "red") {
		name.style.color = "blue";
	}
	else ;
}

function sayHi() {
    alert("Hi!");
}

function createSVG(path1_in,path2_in,fill1_in,fill2_in,click_function) {
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path1");
	var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path1");

	svg.setAttribute('viewbox', '0 0 24 24');
	svg.setAttribute('width', '24px');
	svg.setAttribute('height', '24px');

	path1.setAttribute('d', path1_in);

	path2.setAttribute('d',path2);
	path2.setAttribute('fill', fill2_in);

	svg.appendChild(path1);
	svg.appendChild(path2);

	svg.addEventListener("click",click_function);
	return svg;
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


//function buildSVGComponents()								//This function rebuilds the Information Panel each time the page or language is changed, and when the page loads.
//		{
//			var upButton = createSVG(buttons[currentTopic][currentPage].up)
//			
//			}

function refresh2() {

}
function refresh4() {
	
}
function refresh5() {
	
}
function refresh6() {
	
}