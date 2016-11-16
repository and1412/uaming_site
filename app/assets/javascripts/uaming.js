var UamingWidget = {

	uamingServer: "",
	oldURL: "",

	init: function(server){
		this.uamingServer = server;
		this.checkUserId();
		this.oldURL = "";
		var self = this;
		setInterval(function(){self.checkURLchange(self)}, 1000);
	},

	checkURLchange: function(self){
	    var currentURL = window.location.pathname;
	    if(currentURL == self.oldURL){
	    	return 
	    }
	    self.oldURL = currentURL;
	    self.apiAuditEvents();
	},
	
	generateUserId: function(){
		var dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()";
		var userId = "";
    		for(var i = 0; i < 30; i++) {
        		userId += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    		}
    		return userId;
	},

	getCookie: function(cname) {
		var name = cname + "=";
    		var ca = document.cookie.split(';');
    		for(var i = 0; i <ca.length; i++) {
        		var c = ca[i];
        		while (c.charAt(0)==' ') {
            			c = c.substring(1);
        		}
        		if (c.indexOf(name) == 0) {
            			return c.substring(name.length,c.length);
        		}
    		}
    		return "";
	},
	
	setCookie: function(cname, cvalue, exdays) {
    		var d = new Date();
    		d.setTime(d.getTime() + (exdays*24*60*60*1000));
    		var expires = "expires="+ d.toUTCString();
    		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	},

	checkUserId: function() {
		var userId = this.getCookie("userId");
		if (userId != "") {
			console.log("User already stored on cookie!");
		} else {
			userId = this.generateUserId();
			if (userId != "" && userId != null) {
				this.setCookie("userId", userId, 7);
			}
		}
	},

	apiAuditEvents: function() {
		
		Number.prototype.padLeft = function(base,chr){
		    var  len = (String(base || 10).length - String(this).length)+1;
		    return len > 0? new Array(len).join(chr || '0')+this : this;
		}

		var d = new Date();
		var parameters = {
		    "user": this.getCookie("userId"),
		    "resource": this.oldURL.substr(1),
		    "event_date": [d.getFullYear(), (d.getMonth()+1).padLeft(),
               d.getDate().padLeft()].join('-') +'T' +
              [d.getHours().padLeft(),
               d.getMinutes().padLeft(),
               d.getSeconds().padLeft()].join(':')
		};

		this.sendRequest("events.json", parameters, function(){});			
	},

	apiSendContact: function(email,message) {
		var parameters = {
		    "user": this.getCookie("userId"),
		    "email": email,
		    "message": message
		};

		this.sendRequest("contacts.json", parameters, this.limpaForm);	
	},

	limpaForm: function(){
		document.getElementById("email").value = "";
		document.getElementById("message").value = "";
		alert("Contact was received. Thank you!")
	},

	sendRequest: function(path, parameters, callback){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", this.uamingServer + "/" + path , true);
		xmlhttp.setRequestHeader("Content-type", "application/json");
		xmlhttp.onreadystatechange = function () {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 201) {
				callback();
		    }
		}
		xmlhttp.send(JSON.stringify(parameters));
	}

};

(function() {

  console.log("Loading Uaming Library")
  UamingWidget.init("http://uaming-application.herokuapp.com");

})();

