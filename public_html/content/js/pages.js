
const Pages = (path) => {
	if (path.length == 1) {switch (path[0]) {
		case '': return {
			title: "Home",
			// nav_menu: 'home',
			// back: {text:'Back', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				DOM.create('div',{class:'align-middle'},[
					DOM.create('h2',{},"Project 3 – Router Tracing")
				]),
				DOM.EZ.spacer(20),
				DOM.create('div',{class:'large-text'},[
					DOM.EZ.p(''),
					DOM.create('p',{},[
						"View the ",DOM.EZ.a('i','list',{},'full list')," of routers.",
					]),
					DOM.create('p',{},[
						DOM.EZ.a('i','compute',{},'Compute')," the optimal path between two routers based on a specified parameter.",
					]),
				]),
				DOM.create('p',{class:'article-foot'},DOM.text('Team #131')),
			],
			callback: () => {},
		};
		case 'list': return {
			title: "List",
			// nav_menu: 'profile',
			// back: {text:'All Articles', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				DOM.create('div',{class:'align-middle', id:''},[
					DOM.create('button', {class:'primary',onclick:'onclick_list()'}, 'Load Data')
				]),
				DOM.EZ.spacer(20),
				DOM.create('div',{id:'list-container'}),
			],
			callback: () => {},
		};
		case 'compute': return {
			title: "Compute",
			// nav_menu: 'profile',
			// back: {text:'Back', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				DOM.EZ.p('Click one of the links below to access and/or download a PDF version of a Huracan Herald edition. Editions are listed in descending order with the most recent at the top.'),
				Widget.link_list.create('hh-downloads',[
					{type:'ic', href:'files/HH_3_2021-01_FINAL.pdf', attributes:{target:"_blank"}, innerHTML:'Edition #3 – JAN-FEB 2021'},
					{type:'ic', href:'files/HH_2_2020-06_FINAL.pdf', attributes:{target:"_blank"}, innerHTML:'Edition #2 – NOV-DEC 2020'},
					{type:'ic', href:'files/HH_1_2020-05_FINAL.pdf', attributes:{target:"_blank"}, innerHTML:'Edition #1 – SEP-OCT 2020'},
				])
			],
			callback: () => {

			},
		};
	}}
	return {
		title: "Page Not Found",
		content: [
			DOM.EZ.p('Sorry, but the page you are looking for does not exist. Please use the navigation menu at the bottom of the screen to help you find what you are looking for.'),
			DOM.EZ.spacer(10),
			DOM.create('div',{class:'align-middle'},[
				DOM.create('a',{href:'mailto:'+Site.adminEmail},[
					DOM.create('button', {class:'primary'}, 'Email Webmaster')
				])
			]),
		],
		callback: () => {},
	};
};

function onclick_list() {
	ajax('../../graph/nodes.csv',(response)=>{
		//DOM.append(get('#list-container'),DOM.EZ.p(response.responseText));
		var array = [
			["Router #1", "Router #2", "Speed", "Latency", "Bandwidth"]
		];
		for (var line of response.responseText.split('\n')) {
			if (line != "") {
				array.push(line.split(','));
			}
		}
		console.log(array);
		DOM.append(get('#list-container'),DOM.EZ.table(array,{},1,0));
		get('#list-container').removeChild('#list-container button')
	});
}
