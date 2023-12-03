
const DOM = {
	// Shorthand for document.createElement() AND sets attributes
	create: (tag,props,children) => {
		var element = document.createElement(tag.toUpperCase());
		if (isObject(props)) {
			Object.keys(props).forEach(key => {
				//Object.defineProperty(element,key,{value:props[key], writable:false});
				if (key === "innerHTML") {
					element.innerHTML = props[key];
				} else {
					element.setAttribute(key,props[key]);
				}
			});
		} else if (isDefined(props)) {
			element.innerHTML = props;
		}
		if (isDefined(children)) {DOM.append(element,children);}
		return element;
	},

	// Shorthand for document.createTextNode()
	text: (content) => {
		return document.createTextNode(content);
	},

	modify: (element,props) => {
		if (isObject(props)) {
			Object.keys(props).map(key => {
				//Object.defineProperty(element,key,{value:props[key], writable:false});
				if (key === "innerHTML") {
					element.innerHTML = props[key];
				} else {
					element.setAttribute(key,props[key]);
				}
			});
		} else if (isDefined(props)) {
			element.innerHTML = props;
		}
		return element;
	},

	// Shorthand for one or multiple document.appendElement()
	append: (...args) => {
		for (var i = args.length-1; i >= 1; i--) {
			if (Array.isArray(args[i])) {
				for (var j = 0; j < args[i].length; j++) {
					if (args[i][j] instanceof Node) {
						args[i-1].appendChild(args[i][j]);
					} else {
						//console.warn('Appended "'+args[i][j]+'" as text node to:',args[i-1]);
						args[i-1].appendChild(DOM.text(args[i][j]));
					}
				}
			} else {
				if (args[i] instanceof Node) {
					args[i-1].appendChild(args[i]);
				} else {
					//console.warn('Appended "'+args[i]+'" as text node to:',args[i-1]);
					args[i-1].appendChild(DOM.text(args[i]));
				}
			}
		}
		return args[0];
	},

	replaceChildren: (oldC,newC) => {
		while (oldC.childNodes.length > 0) {
			oldC.removeChild(oldC.childNodes[0]);
		}
		for (var i = 0; i < newC.childNodes.length; i++) {
			DOM.append(oldC,newC.childNodes[i].cloneNode(true));
		}
		return oldC;
	},

	EZ: {
		p: (text, attributes) => {
			if (!isObject(attributes)) {attributes = {};}
			return DOM.create('p',attributes,DOM.text(text));
		},
		span: (text, attributes) => {
			if (!isObject(attributes)) {attributes = {};}
			return DOM.create('span',attributes,DOM.text(text));
		},
		h1: (text, attributes) => {
			if (!isObject(attributes)) {attributes = {};}
			return DOM.create('h1',attributes,DOM.text(text));
		},
		h2: (text, attributes) => {
			if (!isObject(attributes)) {attributes = {};}
			return DOM.create('h2',attributes,DOM.text(text));
		},
		h3: (text, attributes) => {
			if (!isObject(attributes)) {attributes = {};}
			return DOM.create('h3',attributes,DOM.text(text));
		},
		h4: (text, attributes) => {
			if (!isObject(attributes)) {attributes = {};}
			return DOM.create('h4',attributes,DOM.text(text));
		},
		a: (type,href,attributes,innerHTML) => {
			if (type === 'i') {
				if (!isObject(attributes)) {attributes = {};}
				attributes.href = Site.root+href;
				attributes.onclick = "navigateTo('"+href+"',false,event)";
				return DOM.create('a',attributes,DOM.text(innerHTML||href));
			} if (type === 'ic') {
				if (!isObject(attributes)) {attributes = {};}
				attributes.href = Site.root+Site.src.root+href;
				return DOM.create('a',attributes,DOM.text(innerHTML||href));
			} else if (type === 'm') {
				if (!isObject(attributes)) {attributes = {};}
				attributes.href = 'mailto:'+href.toLowerCase();
				return DOM.create('a',attributes,innerHTML||href);
			} else if (type === 'e') {
				if (!isObject(attributes)) {attributes = {};}
				if (href.indexOf('http') < 0) {attributes.href = 'http://'+href;}
				else {attributes.href = href;}
				return DOM.create('a',attributes,DOM.text(innerHTML||href));
			} else {
				console.error('Invalid input',type);
			}
		},
		select: (id,attributes,options,selectedValue) => {
			attributes.name = attributes.id = id;
			var select = DOM.create('select',attributes);
			for (var i = 0; i < options.length; i++) {
				if (Array.isArray(options[i])) {
					select.add(DOM.create('option',{value:options[i][1], innerHTML:options[i][0]}));
					if (options[i][1] == selectedValue) {select.selectedIndex = select.length-1;}
				} else {
					select.add(DOM.create('option',{value:options[i], innerHTML:options[i]}));
					if (options[i] == selectedValue) {select.selectedIndex = select.length-1;}
				}
			}
			return select;
		},
		table: (array,props,thRows,tfRows) => {
			// Perform a check of the length of each row of the array to ensure an equal table
			for (var i = 1; i < array.length; i++) {
				if (array[i].length != array[0].length) {
					return "ERROR: Unable to create table. Please check the dimensions of the parameter array.";
				}
			}
			if (isNaN(thRows)) {thRows = 0;}
			if (isNaN(tfRows)) {tfRows = 0;}
			if (!isObject(props)) {props = {};}

			// <thead> / <tr> / <th>
			var thead = DOM.create('thead');
			for (var i = 0; i < thRows; i++) {
				var tr = DOM.create('tr');
				for (var j = 0; j < array[i].length; j++) {
					var th = DOM.create('th');
					if (Array.isArray(array[i][j]) == true) {
						for (var k = 0; k < array[i][j].length; k++) {
							if (array[i][j][k] instanceof Node) {
								DOM.append(th, array[i][j][k]);
							} else {
								DOM.append(th, DOM.text(array[i][j][k]));
							}
						}
					} else {
						if (array[i][j] instanceof Node) {
							DOM.append(th, array[i][j]);
						} else {
							DOM.modify(th, {innerHTML:array[i][j]});
						}
					}
					DOM.append(tr,th);
				}
				DOM.append(thead,tr);
			}

			// <tbody> / <tr> / <td>
			var tbody = DOM.create('tbody');
			for (var i = thRows; i < array.length-tfRows; i++) {
				var tr = DOM.create('tr');
				for (var j = 0; j < array[i].length; j++) {
					var td = DOM.create('td');
					if (Array.isArray(array[i][j]) == true) {
						for (var k = 0; k < array[i][j].length; k++) {
							if (array[i][j][k] instanceof Node) {
								DOM.append(td, array[i][j][k]);
							} else {
								DOM.append(td, DOM.text(array[i][j][k]));
							}
						}
					} else {
						if (array[i][j] instanceof Node) {
							DOM.append(td, array[i][j]);
						} else {
							DOM.modify(td, {innerHTML:array[i][j]});
						}
					}
					DOM.append(tr,td);
				}
				DOM.append(tbody,tr);
			}

			// <tfoot> / <tr> / <th>
			var tfoot = DOM.create('tfoot');
			for (var i = array.length-tfRows; i < array.length; i++) {
				var tr = DOM.create('tr');
				for (var j = 0; j < array[i].length; j++) {
					var th = DOM.create('th');
					if (Array.isArray(array[i][j]) == true) {
						for (var k = 0; k < array[i][j].length; k++) {
							if (array[i][j][k] instanceof Node) {
								DOM.append(th, array[i][j][k]);
							} else {
								DOM.append(th, DOM.text(array[i][j][k]));
							}
						}
					} else {
						if (array[i][j] instanceof Node) {
							DOM.append(th, array[i][j]);
						} else {
							DOM.modify(th, {innerHTML:array[i][j]});
						}
					}
					DOM.append(tr,th);
				}
				DOM.append(tfoot,tr);
			}

			return DOM.create('table',props,[thead,tbody,tfoot]);
		},
		spacer: (height) => {
			return DOM.create('div',{class:'spacer', style:'height:'+(height||50)+'px'});
		},
	}
}
