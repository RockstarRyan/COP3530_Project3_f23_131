
const Pages = (path) => {
	if (path.length == 1) {switch (path[0]) {
		case '': return {
			title: "Fall Fellowship",
			// nav_menu: 'home',
			// back: {text:'Back', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				DOM.create('div',{class:'align-middle'},[
					DOM.create('h2',{},"Welcome to the 75th Anniversary Fall Fellowship!")
				]),
				DOM.EZ.spacer(20),
				DOM.create('div',{class:'large-text'},[
					DOM.EZ.p(''),
					DOM.create('p',{},[
						"Download the ",DOM.EZ.a('ic',"ff-2021-event-passport.pdf",{},'event passport'),". Updates are posted ",DOM.EZ.a('i','updates',{},'here'),".",
					]),
					DOM.create('p',{},[
						"Questions? View ",DOM.EZ.a('i','leadership',{},'contact information')," for the weekend leadership team.",
					]),
				]),
				DOM.create('p',{class:'article-foot'},DOM.text('Event Staff')),
			],
			callback: () => {},
		};
		case 'updates': return {
			title: "Updates",
			// nav_menu: 'profile',
			// back: {text:'All Articles', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				Widget.news.feed.create('newsfeed',path[0],getDocsWithFieldCond('articles',{}),1)
			],
			callback: () => {},
		};
		case 'leadership': return {
			title: "Leadership",
			// nav_menu: 'profile',
			// back: {text:'All Articles', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				Widget.expandable.create('weekend-leadership','Weekend Leadership',true,[
					DOM.EZ.table([
						["Position",							"Name",						"Email"],
						["Weekend / Quest Event Chair",			"Liv Foster",				DOM.EZ.a("m","secondvicechief@tipisa.org")],
						["Fundraising / Expo Chair",			"Drew Jansen",				DOM.EZ.a("m","")],
						["75th Committee Advisor",				"Howard Gross",				DOM.EZ.a("m","")],
						["75th Weekend Advisor",				"Matt Rowe",				DOM.EZ.a("m","")],
						["Lodge Chief/Advisor Reunion Advisor",	"Greg Raymond",				DOM.EZ.a("m","")],
						["Registration Chair",					"Ryan Gross",				DOM.EZ.a("m","secretary@tipisa.org")],
						["Brotherhood Chair",					"Marc Homburger Jacobs",	DOM.EZ.a("m","firstvicechief@tipisa.org")],
						["King’s Cup Chair",					"Clinton Kuropkat",			DOM.EZ.a("m","historian@tipisa.org")],
					],{},1,0)
				]),
				Widget.expandable.create('lodge-leadership','Lodge Leadership',true,[
					DOM.EZ.table([
						["Position",			"Name",				"Email"],
						["Lodge Chief",			"Andrew Kerns",		DOM.EZ.a("m","chief@tipisa.org")],
						["Lodge Advisor",		"Dawn Gross",		DOM.EZ.a("m","advisor@tipisa.org")],
						["OA Staff Advisor",	"Henry Knowles",	DOM.EZ.a("m","")],
					],{},1,0)
				]),
			],
			callback: () => {},
		};
		case 'events': return {
			title: "Upcoming Events",
			// nav_menu: 'profile',
			// back: {text:'Back', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				Widget.calendar.create('upcoming-events', objectToArray(getDocsWithFieldCond('events',{})), new Date()),
			],
			callback: () => {},
		};
		case 'downloads': return {
			title: "Downloads",
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
		case 'post-article': return {
			title: "Admin Console",
			// nav_menu: 'profile',
			// back: {text:'Back', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				Widget.expandable.create('create-event','Create an Event',false,[
				]),
				Widget.expandable.create('post-article','Post an Article',true,[
					Widget.form.create('post-article-form',[
						{label:'path1', props:{placeholder:'Article Path'}},
						{label:'Title', props:{placeholder:'Article Title'}},
						{label:'Author', props:{type:'select',options:['Ryan Gross','Peter Fox'],selectedIndex:'Ryan Gross'}},
						{label:'Date', props:[
							{type:'text', size:'4', value:new Date().getFullYear()},
							{type:'text', size:'2', value:new Date().getMonth()},
							{type:'text', size:'2', value:new Date().getDate()},
							{type:'text', size:'2', placeholder:0},
						]},
						{label:'Edition', props:{type:'select',options:[['#1 – 2020-05','#1'],['#2 – 2020-06','#2'],['#3 – 2021-01','#3'],['Online','Online']],selectedIndex:'#1'}},
						{label:'Unread', props:{type:'checkbox'}},
						{label:'Content', props:{type:'textarea'}},
					],() => {
						var id = "#post-article-form";
						var inputs = ['title','author','authorPic','date','edition','unread','content'];

						result = '"'+get(id+'-path1').value+'": {';
						for (var i = 0; i < inputs.length; i++) {
							result += inputs[i].substring(0,1).toLowerCase() + inputs[i].substring(1) + ':';
							switch (inputs[i]) {
								case 'date': {
									result += 'new Date(';
									for (var j = 0; j < 4; j++) {
										result += get(id+'-'+inputs[i].toLowerCase()+'-'+j).value;
										if (j < 2) {result += ', ';}
									}
									result += ')';
								} break;
								case 'unread': result += (get(id+'-'+inputs[i].toLowerCase()).checked); break;
								case 'author': result += "'"+db.users[get(id+'-author').value].title+"'"; break;
								case 'authorPic': result += "'"+db.users[get(id+'-author').value].picture+"'"; break;
								case 'content': {
									result += "'";
									var lines = get(id+'-'+inputs[i].toLowerCase()).value.split('\n');
									for (var j = 0; j < lines.length; j++) {
										if (lines[j].indexOf('img_w_capt') >= 0) {
											var props = lines[j].split('  ');
											result += DOM.create('div',{class:'align-middle', innerHTML:Widget.img_w_capt.create(props[1].split('.')[0],props[1],props[2]).outerHTML}).outerHTML;
										} else {
											result += DOM.create('p',{innerHTML:lines[j]}).outerHTML;
										}
									}
									result += "'";
								} break;
								default: result += '"'+get(id+'-'+inputs[i].toLowerCase()).value+'"'; break;
							}
							if (i < inputs.length-1) {result += ', ';}
						}
						result += '},';
						var element = DOM.create('div'); element.innerText = result;
						DOM.append(get('#post-article-result'),element);
					}),
					DOM.create('p',{},[
						DOM.create('strong',{},DOM.text('Result: ')),
						DOM.create('code',{id:'post-article-result'})
					]),
					DOM.create('button',{onclick:'get("#post-article-result").innerHTML=""'},DOM.text('Clear'))
				]),
			],
			callback: () => {

			},
		};
	}} else if (path.length == 2) {switch (path[0]) {
		case 'updates': return {
			title: Widget.news.article.title(getDocsWithFieldCond('articles',{}),path[1]),
			// nav_menu: 'profile',
			back: {text:'All Articles', onclick:'navigateTo("'+path[0]+'")'},
			content: [
				Widget.news.article.create('newsfeed',getDocsWithFieldCond('articles',{}),path[0],path[1],false)
			],
			callback: () => {},
		};
	}}
	return {
		title: "Page Not Found",
		content: [
			DOM.EZ.p('Sorry, but the page you are looking for does not exist. Please use the navigation menu at the bottom of the screen to help you find what you are looking for.'),
			DOM.EZ.spacer(10),
			DOM.create('div',{class:'align-middle'},[
				DOM.create('a',{href:'mailto:'+Site.adminEmail}, [
					DOM.create('button', {class:'primary'}, 'Email Webmaster')
				])
			]),
		],
		callback: () => {},
	};
};
