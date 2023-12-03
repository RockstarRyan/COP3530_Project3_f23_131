
function isDefined(string) {
	if (string==undefined || string==null || string=="") {
		return false;
	} else {
		return true;
	}
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function get(identifier) {
	try {
		var nodeList = document.querySelectorAll(identifier);
		if (nodeList.length === 1) {nodeList = nodeList[0];}
		return nodeList;
	} catch (e) {
		return get_OLD(identifier,document);
	}
}

function get_OLD(identifier,e) {
	console.log(identifier);
	var id_pieces = identifier.split(' ');
	var element = e || document;
	for (var i = 0; i < id_pieces.length; i++) {
		var temp;
		if (id_pieces[i].indexOf('#') > -1) {
			temp = element.getElementById(id_pieces[i].substring(id_pieces[i].indexOf('#')+1));
		} else {
			if (id_pieces[i].indexOf('.') > -1) {
				temp = element.getElementsByClassName(id_pieces[i].substring(id_pieces[i].indexOf('.')+1));
			} else {
				temp = element.getElementsByTagName(id_pieces[i]);
			}
			//if (temp.length > 1) {console.warn("WARNING: Query #"+(i+1)+" (\""+id_pieces[i]+"\") returned "+temp.length+" results, only the first of which was returned.");}
			if (i!=id_pieces.length-1 || temp.length==1) {temp = temp[0];} // FIX later
		}
		element = temp;
	}
	return element;
}

function getCSSVar(varName) {
	return getComputedStyle(document.querySelector(':root')).getPropertyValue(varName);
}

function setCSSVar(varName,value) {
	return getComputedStyle(document.querySelector(':root')).setPropertyValue(varName,value);
}

function hexToRGB(hex,returnAs) {
	if (hex.indexOf('#') >= 0) {hex = hex.substring(hex.indexOf('#')+1);}
	var hexObject = {}, rgbObject = {}, index = 0;
	for (var i = 0; i < hex.length; i += (hex.length/3)) {
		hexObject["rgb"[index]] = "0x"+hex.substring(i,i+hex.length/3);
		if (hex.length/3 === 1) {hexObject["rgb"[index]] += hex.substring(i,i+hex.length/3);}
		rgbObject["rgb"[index]] = +hexObject["rgb"[index]];
		index++;
	}
	switch (returnAs) {
		case 'o': return rgbObject; break;
		case 's': return "rgb("+rgbObject.r+", "+rgbObject.g+", "+rgbObject.b+")"; break;
		default: return [rgbObject.r, rgbObject.g, rgbObject.b]; break;
	}
}

// String functions

function splitAndTrim(string,splitString) {
	var array = string.split(splitString)
	for (var i = 0; i < array.length; i++) {
		if (array[i] === "") {
			array.splice(i,1);
		}
	}
	return array;
}

function trimToLength(long,limit) {
	var short = long;
	if (long.length > limit) {
		var endIndex = long.substring(limit-10).indexOf(' '); if (endIndex == -1) {endIndex = 7;}
		short = long.substring(0,limit-10) + long.substring(limit-10,endIndex+limit-10) + '...';
	}
	return short;
}

function textToDOM(string,className) {
	className = className||'';
	// For convenience, paragraph(s) is abbreviated as pp(s)
	var pps = string.split('\n'), content = DOM.create('div');
	for (var i = 0; i < pps.length; i++) {
		var links = pps[i].match(/<a href='[\w\d\/\.\:\-@]+'>[\w\d\/\.\:\-\040@]+<\/a>/g);
		var otherTexts = pps[i].split(/<a href='[\w\d\/\.\:\-@]+'>[\w\d\/\.\:\-\040@]+<\/a>/g);
		links = links || [];
		var pp = DOM.create('p',{class:className});
		for (var j = 0; j < links.length+otherTexts.length; j++) {
			if (j%2 === 0) {
				DOM.modify(pp, {innerHTML:pp.innerHTML+otherTexts[Math.floor(j/2)]});
			} else {
				var k = Math.floor(j/2);
				var start = links[k].indexOf("\""), href = links[k].substring(start,links[k].substring(start+1).indexOf("'")+start), innerHTML = links[k].substring(links[k].substring(1).indexOf('>')+2,links[k].substring(1).indexOf('<')+1);
				switch (links[k].substring(1,links[k].indexOf(' '))) {
					case 'a': DOM.append(pp, DOM.create('a',{href:href, innerHTML:innerHTML})); break;
					case 'img': DOM.append(pp, DOM.create('img',{src:Site.root+Site.src.root+"images/"+href})); break;
					default: console.error(links[k]); break;
				}
			}
		}
		DOM.append(content,pp);
	}
	return content;
}

function arrayToDOM(array,className) {
	className = className||'';
	// For convenience, paragraph(s) is abbreviated as pp(s)
	var content = DOM.create('div');
	for (var i = 0; i < array.length; i++) {
		var element;
		if (array[i].substring(0,2) == "<>") {
			var split = array[i].split(' ');
		}
		if (j%2 === 0) {
			DOM.modify(pp, {innerHTML:pp.innerHTML+otherTexts[Math.floor(j/2)]});
		} else {
			var k = Math.floor(j/2);
			var start = links[k].indexOf("'"), href = links[k].substring(start,links[k].substring(start+1).indexOf("'")+start), innerHTML = links[k].substring(links[k].substring(1).indexOf('>')+2,links[k].substring(1).indexOf('<')+1);
			switch (links[k].substring(1,links[k].indexOf(' '))) {
				case 'a': DOM.append(pp, DOM.create('a',{href:href, innerHTML:innerHTML})); break;
				case 'img': DOM.append(pp, DOM.create('img',{src:Site.root+Site.src.root+"images/"+href})); break;
				default: console.error(links[k]); break;
			}
		}
		DOM.append(content,element);
	}
	return content;
}

function char(htmlCharCode) {
	return DOM.create('span',{innerHTML:'&'+htmlCharCode+';'});
}

function objectToArray(object) {
	var array = [], i = 0;
	Object.keys(object).map(key => {
		array[i++] = Object.assign({},object[key]);
	});
	return array;
}

// ******** AJAX ***********

function ajax(url, callback, arg1, arg2) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(this, arg1, arg2);
			AJAXRequestComplete = true;
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
	AJAXRequestComplete = false;
}

function serveLocalIcon(xhttp, icon, id) {
	if (xhttp instanceof XMLHttpRequest) {
		//console.log(xhttp);
		localIcons[icon] = xhttp.responseXML.children[0];
		if (id instanceof Node) {
			DOM.append(id, localIcons[icon]);
		} else {
			DOM.append(get(id), localIcons[icon]);
		}
	} else {
		if (!(localIcons[icon] instanceof Object)) {
			ajax(Site.root+Site.src.root+'images/ionicons-5.4.0/'+icon+'.svg', serveLocalIcon, icon, id);
		} else {
			if (id instanceof Node) {
				setTimeout(() => DOM.append(id, localIcons[icon].cloneNode(true)), 20);
			} else {
				setTimeout(() => DOM.append(get(id), localIcons[icon].cloneNode(true)), 20);
			}
		}
		//return localIcons.length;
	}
}

var localIcons = {};
var AJAXRequestComplete = true;

// ********** Date and time ************

const Days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const Months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDayDiff(date1st, date2nd) {
	return Math.floor(date2nd.getTime() / 86400000) - Math.floor(date1st.getTime() / 86400000);
}

function getMinuteDiff(date1st, date2nd) {
	return Math.floor(date2nd.getTime() / 60000) - Math.floor(date1st.getTime() / 60000);
}

function getClockTime(date,includeXM) {
	var h = date.getHours(), mm = date.getMinutes(), xm = (date.getHours() < 12) ? 'AM' : 'PM';
	if (date.getHours() === 0) {
		h = 12; xm = 'AM';
	} else if (date.getHours() > 12) {
		h -= 12;
	}

	if (mm < 10) {mm = '0'+mm;}

	if (includeXM == true) {return h+':'+mm+' '+xm;}
	else {return h+':'+mm;}
}

function getComparisonTimestamp(oldDate,addClockTime) {
	var timestamp, currentDate = new Date();
	var dayDiff = getDayDiff(oldDate,currentDate), minuteDiff = getMinuteDiff(oldDate,currentDate);
	if (minuteDiff === 0) {
		timestamp = 'now';
	} else if (minuteDiff > 0 && minuteDiff < 60) {
		timestamp = minuteDiff+'m ago';
	} else {
		if (dayDiff === 0) {
			timestamp = 'Today';
		} else if (dayDiff === 1) {
			timestamp = 'Yesterday';
		} else if (dayDiff > 1 && dayDiff <= 6) {
			timestamp = Days[oldDate.getDay()].substring(0,3)+' '+Months[oldDate.getMonth()].substring(0,3)+' '+oldDate.getDate();
		} else {
			timestamp = Months[oldDate.getMonth()]+' '+oldDate.getDate();
		}
		if (addClockTime !== false) {timestamp += ', '+getClockTime(oldDate,true);}
	}
	return timestamp;
}

function getLastDayofMonth(m) {
	switch (m) {
		case 0: case 2: case 4: case 6: case 7: case 9: case 11: return 31;
		case 3: case 5: case 8: case 10: return 30;
		case 1: return 28;
		default: console.error("Error: Invalid input passed to function",m);
	}
}
