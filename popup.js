browser.runtime.onMessage.addListener(function(request, sender) {
	if (request.action == "getSource") {
		console.log(request);
		heading.innerText = request.heading;
		message.innerText = request.message;
		downloadLink.href = request.source;
		namesBlob = new Blob([request.blob], {type: 'text/html'});
		downloadLink.style.display = "block";
		processNamesBtn.style.display = 'none';
	}
});

let processNamesBtn = document.getElementById('processNames');
let heading = document.getElementById('heading');
let message = document.getElementById('message');
let downloadLink = document.getElementById('download_link');
let namesBlob = null;

processNamesBtn.onclick = function(element) {
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		browser.tabs.executeScript(tabs[0].id, {file: "page-source.js"}, function() {
		    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
		    if (browser.runtime.lastError) {
			 	heading.innerText = 'Oops!'
		    	message.innerText = 'There was an error injecting script : \n' + browser.runtime.lastError.message;
		    }
		});
	});
};

downloadLink.onclick = function(element) {
	browser.downloads.download({
		url: URL.createObjectURL(namesBlob),
		filename: 'familysearch_reserved_names.doc'
	});
};