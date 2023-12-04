
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
				DOM.create('div',{class:'align-middle', id:'list-loading'},[
					DOM.EZ.p('Loading... (this may take up to five minutes)')
				]),
				DOM.create('div',{id:'list-container'}),
			],
			callback: () => {
				if (get('#list-container').children.length == 0) {
					ajax('../../graph/nodes.csv',(response)=>{
						//DOM.append(get('#list-container'),DOM.EZ.p(response.responseText));
						var array = [
							["Row #", "Source Router", "Destination Router", "Speed (Mbps)", "Latency (s)", "Bandwidth (Mbps)"]
						];

						db.lines = response.responseText.split('\n');

						//console.log(array);
						DOM.append(get('#list-container'),[
							DOM.EZ.table(array,{id:'list'},1,0),
							DOM.EZ.spacer(20),
							DOM.create('div',{class:'align-middle'},[
								DOM.create('p',{id:'list-count'},"Showing 0 of "+db.lines.length+" lines"),
								DOM.create('button',{onclick:'load_more()'},"Load More")
							]),
						]);
						get('main').removeChild(get('#list-loading'));
					});
				}
			},
		};
		case 'compute': return {
			title: "Compute",
			// nav_menu: 'profile',
			// back: {text:'Back', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				Widget.expandable.create('computation-settings','Computation Settings',true,[
					Widget.form.create('computation-settings-form',[
						{label:'Source', props:[
							{type:'number', min:0, max:255, placeholder:255},
							{type:'number', min:0, max:255, placeholder:255},
							{type:'number', min:0, max:255, placeholder:255},
							{type:'number', min:0, max:255, placeholder:255},
						]},
						{label:'Destination', props:[
							{type:'number', min:0, max:255, placeholder:255},
							{type:'number', min:0, max:255, placeholder:255},
							{type:'number', min:0, max:255, placeholder:255},
							{type:'number', min:0, max:255, placeholder:255},
						]},
						{label:'Measurement', props:{type:'select',options:[
							['Speed','speed'],
							['Latency','latency'],
							['Bandwidth','bandwidth']],selectedIndex:'speed'}},
					],() => {
						var id = "#computation-settings-form";
						var source = "", destination = "";
						var measurement = get(id+'-measurement').value;

						for (var j = 0; j < 4; j++) {
							source += get(id+'-source-'+j).value;
							destination += get(id+'-destination-'+j).value;
							if (j < 3) {
								source += '.';
								destination += '.';
							}
						}

						var element = DOM.create('div',{},DOM.text(source+" "+destination+" "+measurement));
						DOM.append(get('#computation-result'),element);

						ajax('../content/scripts/input.php?source='+source+'&destination='+destination+'&measurement='+measurement,(response)=>{
							var element = DOM.create('div',{},DOM.text(response.responseText));
							DOM.append(get('#computation-result'),element);

							ajax('../../graph/output.cgi',(response)=>{
								var element = DOM.create('div',{},DOM.text(response.responseText));
								DOM.append(get('#computation-result'),element);
							});
						});
					})
				]),
				Widget.expandable.create('computation-results','Computation Results',true,[
					DOM.create('p',{},[
						DOM.create('strong',{},DOM.text('Result: ')),
						DOM.create('code',{id:'computation-result'})
					]),
					DOM.create('button',{onclick:'get("#computation-result").innerHTML=""'},DOM.text('Clear'))
				]),
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

function load_more() {
	var numberToLoad = 1000;
	var base = get('#list tbody').childElementCount;
	for (var i = base; i < base+numberToLoad; i++) {
		line = db.lines[i].split(',');
		//console.log(i,line);
		if (line != "") {
			DOM.append(get('#list tbody'),DOM.create('tr',{},[
				DOM.create('td',{},i+1),
				DOM.create('td',{},line[0]),
				DOM.create('td',{},line[1]),
				DOM.create('td',{},line[2]),
				DOM.create('td',{},line[3]),
				DOM.create('td',{},line[4]),
			]));
		}
	}
	get('#list-count').innerText = "Showing "+(base+numberToLoad)+" of "+db.lines.length+" lines";
}