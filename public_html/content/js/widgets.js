const Widget = {
	boxes: {
		create: (id,content) => {
			var widget = DOM.create('section',{class:'widget-boxes', id:id||''});
			content.map(box_i => {
				var box = DOM.create('section',{onclick:"navigateTo('"+box_i.link+"')"},[
					DOM.create('ion-icon',{name:box_i.icon}),
					DOM.create('h2',{},[DOM.text(box_i.heading)]),
					DOM.create('p',{},[DOM.text(box_i.desc)])
				]);
				DOM.append(widget,box);
			});
			return widget;
		},
	},

	img_w_capt: {
		 create: (id,src,capt) => {
			var widget = DOM.create('section',{class:'widget-img_w_capt', id:id, onmouseover:"Widget.img_w_capt.onmouseover('#"+id+"')", onmouseout:"Widget.img_w_capt.onmouseout(\'#"+id+"\')"},[
				DOM.create('img',{src:Site.root+Site.src.root+'images/'+src, alt:capt}),
				DOM.create('div',{class:'capt'},[
					DOM.create('div',{class:'border'}),
					DOM.create('span',{},[DOM.text(capt)])
				])
			]);
			return widget;
		},

		onmouseover: (id) => {
			get(id+' .capt').style.display = 'block';
		},
		onmouseout: (id) => {
			get(id+' .capt').style.display = 'none';
		}
	},

	calendar: {
		create: (id='',events,startView,displayStart,displayEnd) => {
			for (var j = 0; j < events.length; j++) {
				if (events[j].startDate===undefined && events[j].endDate===undefined) {
					console.error("Event must have a start and end date",events[j]);
					return DOM.create('section',{class:'widget-calendar', id:id},[DOM.EZ.p("An error occurred.")]);
				}
			}
			displayStart = displayStart || new Date(new Date().getFullYear()-2,0,1);
			displayEnd = displayEnd || new Date(new Date().getFullYear()+2,11,31);
			var y = startView.getFullYear(), m = startView.getMonth();
			var yMax = displayEnd.getFullYear(), yMin = displayStart.getFullYear(), mMax = displayEnd.getMonth(), mMin = displayStart.getMonth();
			var select_y = []; for (var i = 0; i <= yMax-yMin; i++) {select_y[i] = yMax-i;}
			var select_m = []; for (var i = 0; i < 12; i++) {if (yMax>yMin || (mMax>=i&&mMin<=i)) {select_m[i] = [Months[i],i];}}

			Widget.calendar.state[id] = {events:events, y:y, m:m, yMax:yMax, yMin:yMin, mMax:mMax, mMin:mMin};
			var [calendar,heading,cal_nav_arrows] = Widget.calendar.changeDisplay(id,y,m,true);

			// Create full widget
			var widget = DOM.create('section',{class:'widget-calendar', id:id},[
				DOM.create('div',{class:'inputs-container'},[
					DOM.EZ.select('select-cal-y-'+id, {onchange:'Widget.calendar.changeDisplay("'+id+'", parseInt(this.selectedOptions[0].value), Widget.calendar.state["'+id+'"].m,false)'}, select_y, y),
					DOM.EZ.select('select-cal-m-'+id, {onchange:'Widget.calendar.changeDisplay("'+id+'", Widget.calendar.state["'+id+'"].y, parseInt(this.selectedOptions[0].value),false)'}, select_m, m),
				]),
				DOM.create('div',{class:'calendar-heading'},[
					DOM.create('span',{class:'l'+cal_nav_arrows.l,innerHTML:'&larr;',onclick:'Widget.calendar.changeDisplay("'+id+'",Widget.calendar.state["'+id+'"].y,Widget.calendar.state["'+id+'"].m-1,false)'}),
					DOM.EZ.h3(heading),
					DOM.create('span',{class:'r'+cal_nav_arrows.r,innerHTML:'&rarr;',onclick:'Widget.calendar.changeDisplay("'+id+'",Widget.calendar.state["'+id+'"].y,Widget.calendar.state["'+id+'"].m+1,false)'}),
				]),
				calendar,
				DOM.create('div',{class:'info-container'},[
					DOM.create('h3','Event Information'),
					DOM.create('span',{class:'soggy',innerHTML:'No event selected'}),
					DOM.create('div',{},[
						DOM.create('h4',{class:'title'},[
							//DOM.create('strong','Event Title: '),
							DOM.create('span')
						]),
						DOM.create('p',{class:'startDate'},[
							DOM.create('strong','Event starts: '),
							DOM.create('span')
						]),
						DOM.create('p',{class:'endDate'},[
							DOM.create('strong','Event ends: '),
							DOM.create('span')
						]),
						DOM.create('p',{class:'desc'},[
							//DOM.create('strong','Description: '),
							DOM.create('span')
						]),
						DOM.create('p',{class:'location'},[
							DOM.create('strong','Location: '),
							DOM.create('span')
						]),
						DOM.create('p',{class:'categories'},[
							DOM.create('strong','Categories: '),
							DOM.create('span')
						]),
					])
				]),
			]);
			return widget;
		},

		changeDisplay: (id,y,m,isReturn) => {
			var state = Widget.calendar.state[id];
			var events = state.events, yMax = state.yMax, yMin = state.yMin, mMax = state.mMax, mMin = state.mMin;

			var cal_nav_arrows = {l:'', r:''};
			if (m < 0) {m = 11; y--;} else if (m > 11) {m = 0; y++;}
			if (y < yMin || (m<=mMin && y==yMin)) {
				m = mMin; y = yMin; cal_nav_arrows.l = ' soggy';
			}
			if (y > yMax || (m>=mMax && y==yMax)) {
				m = mMax; y = yMax; cal_nav_arrows.r = ' soggy';
			}
			Widget.calendar.state[id].y = y;
			Widget.calendar.state[id].m = m;
			var beginningDayOfViewMonth = (new Date(y,m,1)).getDay(), d = 1;

			// Create calendar table
			var cal_array = [['Sun','Mon','Tue','Wed','Thu','Fri','Sat']];
			while (d <= getLastDayofMonth(m)) {
				var row = cal_array.length;
				cal_array[row] = [];
				for (var i = 0; i < 7; i++) {
					cal_array[row][i] = [];
					if ((d>1 || d+beginningDayOfViewMonth==i+1) && d<=getLastDayofMonth(m)) {
						cal_array[row][i][0] = DOM.create('span',{class:'date', innerHTML:d});
						for (var j = 0; j < events.length; j++) {
							var sd = {y:y, m:m, d:getLastDayofMonth(m)}, ed = {y:y, m:m, d:1};
							if (events[j].startDate !== undefined) {sd.y = events[j].startDate.getFullYear(); sd.m = events[j].startDate.getMonth(); sd.d = events[j].startDate.getDate();}
							if (events[j].endDate !== undefined) {ed.y = events[j].endDate.getFullYear(); ed.m = events[j].endDate.getMonth(); ed.d = events[j].endDate.getDate();}
							if (events[j].startDate === undefined) {sd = ed;}
							if (events[j].endDate === undefined) {ed = sd;}
							if (sd.d<=d && sd.y<=y && sd.m<=m && ed.d>=d && ed.y>=y && ed.m>=m) {
								var time = ''; if (events[j].startDate.getDate()==d) {time = getClockTime(events[j].startDate,false)}
								cal_array[row][i][cal_array[row][i].length] = DOM.create('span',{class:'event', index:j, innerHTML:'<strong>'+time+'</strong> '+(events[j].abbr||events[j].title), onclick:'Widget.calendar.select("'+id+'",this)'});
								//console.log(cal_array[row][i][cal_array[row][i].length]);
							}
						}
						d++;
					}
				}
			}
			var table = DOM.EZ.table(cal_array,{},1,0), heading = Months[m]+' '+y;
			if (isReturn == true) {return [table,heading,cal_nav_arrows];}
			else {
				DOM.replaceChildren(get('#'+id+' table'),table);
				get('#'+id+' .calendar-heading h3').innerHTML = heading;
				Widget.calendar.select(id,'none');
				get('#select-cal-y-'+id).selectedIndex = yMax - y;
				get('#select-cal-m-'+id).selectedIndex = m - mMin;
				DOM.modify(get('#'+id+' .calendar-heading .l'),{class:'l'+cal_nav_arrows.l});
				DOM.modify(get('#'+id+' .calendar-heading .r'),{class:'r'+cal_nav_arrows.r});
			}
		},

		select: (id, selected) => {
			if (selected === 'none') {
				id = '#'+id;
				DOM.modify(get(id+' .info-container .soggy'), {style:'display:block;'});
				DOM.modify(get(id+' .info-container div'), {style:'display:none;'});
			} else {
				var event_j = Widget.calendar.state[id].events[selected.getAttribute('index')];
				id = '#'+id;
				// Highlight selected event
				var listings = get(id+' .event');
				if (listings.length >= 0) {
					for (var i = 0; i < listings.length; i++) {
						if (listings[i].getAttribute('index')===selected.getAttribute('index')) {DOM.modify(listings[i],{class:'event selected'});}
						else {DOM.modify(listings[i],{class:'event'});}
					}
				} else {
					DOM.modify(listings,{class:'event selected'});
				}

				DOM.modify(get(id+' .info-container .soggy'), {style:'display:none;'});
				DOM.modify(get(id+' .info-container div'), {style:'display:block;'});

				// Chage title and description
				Object.keys(event_j).map(key => {
					var bool = (key==='link' || key==='abbr');
					if (event_j[key] === undefined && !bool) {DOM.modify(get(id+' .'+key),{style:'display:none;'})}
					else if (!bool) {DOM.modify(get(id+' .'+key),{style:'display:block;'})}
					switch (key) {
						case 'link': case 'abbr': break;
						case 'location': DOM.modify(get(id+' .'+key+' span'), {innerHTML:((event_j.link === undefined) ? event_j.location : '<a href="'+event_j.link+'">'+event_j.location+'</a>')}); break;
						case 'startDate': case 'endDate': {
							if (event_j[key] === undefined) {
								DOM.modify(get(id+' .'+key+' span'), '');
							} else {
								DOM.modify(get(id+' .'+key+' span'), {class:'',innerHTML:event_j[key].toDateString()+', '+getClockTime(event_j[key],true)});
							}
						} break;
						default: DOM.modify(get(id+' .'+key+' span'), {innerHTML:event_j[key]}); break;
					}
				});
			}
		},

		state: {}
	},

	listings: {
		create: (id,content) => {
			var widget = DOM.create('section',{class:'widget-listings', id:id||''});
			content.map(box_i => {
				var box = DOM.create('section',{onclick:"navigateTo('"+box_i.link+"')"},[
					DOM.create('img',{src:'images/attractions/'+box_i.img}),
					DOM.create('h2',{},box_i.name),
					DOM.create('p',{class:'desc'},[DOM.text(box_i.desc)]),
					DOM.create('p',{class:'address'},[DOM.text('Address: '+box_i.address)]),
				]);
				DOM.append(widget,box);
			});
			return widget;
		},
	},

	expandable: {
		create: (id,heading,showOnLoad,content) => {
			var display = (showOnLoad === true) ? ' open' : '';
			var widget = DOM.create('section',{class:'widget-expandable'+display, id:id||''},[
				DOM.create('h3',{onclick:"get('#"+id+"').classList.toggle('open')"},[
					DOM.text(heading),
					DOM.create('span',{class:'down', innerHTML:"&#9650;"}),
					DOM.create('span',{class:'up', innerHTML:"&#9660;"}),
				]),
				DOM.create('div',{},content),
			]);
			return widget;
		},
	},

	works_cited: {
		create: (id,content) => {
			var entries = [];
			for (var i = 0; i < content.length; i++) {
				entries[i] = DOM.create('li',{},[
					DOM.create('span',content[i].title+' &ndash; '),
					DOM.create('a',{innerHTML:content[i].link, href:content[i].link}),
				]);
			}
			var widget = DOM.create('ul',{class:'widget-works_cited', id:id||''},entries);
			return widget;
		}
	},

	news: {
		feed: {
			create: (id,path0,repository,unreadDateDiff=2) => {
				var widget = DOM.create('section',{class:'widget-news-feed', id:id||''});
				Widget.news.state[id] = {starred:[]};

				var date_array = [], j = 0;
				Object.keys(repository).map(key => {
					date_array[j++] = {key:key, date:repository[key].date.getTime(), starred:(repository[key].starred==true) ? 1 : 0};
				});

				date_array.sort((a, b) => {return b.date-a.date});
				date_array.sort((a, b) => {return b.starred-a.starred});

				var now = new Date();

				for (var i = 0; i < date_array.length; i++) {
					var doc_i = repository[date_array[i].key];
					var star = (doc_i.starred === true) ? DOM.create('span',{class:'star'}) : '';
					var unread = (getDayDiff(doc_i.date,now) < unreadDateDiff) ? DOM.create('span',{class:'unread'}) : '';
					var box = DOM.create('section',{onclick:"navigateTo('"+path0+"/"+date_array[i].key+"')"},[
						DOM.create('h2',{},[
							star,
							unread,
							DOM.text(trimToLength(doc_i.title,80))
						]),
						DOM.create('img',{src:Site.root+Site.src.root+'images/profile-pictures/'+doc_i.authorPic}),
						DOM.create('span',{class:'author article-foot'},DOM.text(doc_i.author)),
						DOM.create('span',{class:'timestamp', innerHTML:doc_i.edition+' &ndash; '+getComparisonTimestamp(doc_i.date, false)}),
						DOM.EZ.p(trimToLength(textToDOM(doc_i.content).textContent,120))
					]);
					DOM.append(widget,box);
				}
				setTimeout(() => {
					var stars = get('#'+id+' .star');
					if (Array.isArray(stars) === true) {
						for (var i = 0; i < stars.length; i++) {
							serveLocalIcon('','star',stars[i]);
						}
					} else {
						serveLocalIcon('','star',stars);
					}
				},10);
				return widget;
			}
		},

		article: {
			create: (id,repository,path0,path1,includeTitle) => {
				var article = repository[path1], widget;
				if (isObject(article) == true) {
					var title = (includeTitle === true) ? DOM.EZ.h2(article.title) : DOM.text('');
					widget = DOM.create('section', {class:'widget-news-article', id:(id||'')+'-article-'+path1},[
						title,
						DOM.create('img',{src:Site.root+Site.src.root+'images/profile-pictures/'+article.authorPic}),
						DOM.create('span',{class:'author article-foot'},DOM.text(article.author)),
						DOM.create('span',{class:'timestamp', innerHTML:article.edition+' &ndash; '+getComparisonTimestamp(article.date, false)}),
						DOM.create('div',{innerHTML:article.content}),
					]);
				} else {
					widget = DOM.create('section',{class:'widget-news-article-notfound'},[
						DOM.EZ.p('Sorry, but the article you are looking for does not exist. Please use the navigation menu at the bottom of the screen to help you find what you are looking for.'),
						DOM.EZ.spacer(10),
						DOM.create('div',{class:'align-middle'},[
							DOM.create('button', {class:'primary', onclick:'navigateTo("mailto:editor@huracan-herald.rockstarryan.net")'}, DOM.text('Email Webmaster')),
						]),
					]);
				}

				return widget;
			},

			title: (repository,path1) => {
				return (isObject(repository[path1])) ? repository[path1].title : "Article Not Found";
			}
		},
		state: {}
	},

	form: {
		create: (id,inputs,onsubmit) => {
			var array = [];
			for (var i = 0; i < inputs.length; i++) {
				array[i] = [DOM.create('label',{for:id+'-'+inputs[i].label.toLowerCase()+'-'+j},DOM.text(inputs[i].label)), DOM.create('div')];
				if (Array.isArray(inputs[i].props) === true) {
					for (var j = 0; j < inputs[i].props.length; j++) {
						DOM.append(array[i][1], Widget.form.newInput(id+'-'+inputs[i].label.toLowerCase()+'-'+j, inputs[i].props[j]));
					}
				} else {
					DOM.append(array[i][1], Widget.form.newInput(id+'-'+inputs[i].label.toLowerCase(), inputs[i].props));
				}
			}
			var button = DOM.create('button',{class:'primary'},DOM.text('Submit'));
			button.addEventListener('click',onsubmit);
			return DOM.create('section',{class:'widget-form', id:id||''}, [
				DOM.create('form',{}, DOM.EZ.table(array,{},0,0)),
				DOM.create('div',{class:'align-middle'},button)
			]);
		},

		newInput: (id,object) => {
			var element, type = object.type; delete object.type;
			switch (type) {
				case 'select': {
					element = DOM.EZ.select(id, object.attributes||{}, object.options, object.selectedIndex);
				} break;
				case 'textarea': {
					element = DOM.modify(DOM.create('textarea', object), {id:id, rows:object.rows||8, cols:object.cols||40});
				} break;
				case 'text': default: {
					element = DOM.modify(DOM.create('input', object), {id:id, type:type});
				} break;
			}
			return element;
		}
	},

	link_list: {
		create: (id,links) => {
			var list = DOM.create('ol');
			links.map(link => {
				if (link.type === undefined) {link.type = 'e';}
				DOM.append(list, DOM.create('li',{},[
					DOM.EZ.a(link.type, link.href, link.attributes, link.innerHTML)
				]));
			});
			return DOM.create('section',{class:'widget-link_list', id:id||''},list);
		},
	},
}
