
/*
 * "JSPress" framework by Ryan Gross (grossr@ufl.edu)
 * Copyright &copy; 2021-2023 Ryan Gross. All rights reserved.
 * Permission given for Fall 2023 COP 3530 Project 3 Team #131
 *     to use and modify the framework as seen fit.
 */

const Site = {

	title: "COP 3530 Project 3",
	root: root_uri,
	adminEmail: "grossr@ufl.edu",

	useDarkTheme: window.matchMedia('(prefers-color-scheme: dark)').matches,

	src: {
		root: "content/", // Write "" for Site.root directory
		js: {
			local: [
				{src:'js/dom_framework',loadFirst:true},
				{src:'js/utilities',loadFirst:true},
				{src:'js/widgets',loadFirst:true},
				{src:'js/db',loadFirst:true},
				{src:'js/pages',loadFirst:true},
			],
			cdn: [
				//{type:'module',src:'https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js'},
				//{nomodule:'',src:'https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.js'},
				//{src:'https://code.jquery.com/jquery-3.5.1.min.js',integrity:'sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=',crossorigin:'anonymous'}
			]
		},
		css: {
			local: [
				"css/style"
			],
			cdn: [

			]
		}
	},

	cmpnts: {
		nav: [
			{title:'Home', icon:'home-outline', link:''}, // mail-unread-outline
			{title:'List', icon:'list-outline'},
			{title:'Compute', icon:'calculator-outline',}
			//{title:'Events', icon:'calendar-outline'},
			//{title:'Downloads', icon:'download-outline'},
			//{title:'Admin', icon:'cog-outline'}
		]
	}
}

const InitializeApp = (full_path) => {
	// Load resources
	var lastLocalScript = LoadEssentialResources();
	//console.log(lastLocalScript);
	var loading = setInterval(() => {
		try {
			if (lastLocalScript.isConnected === true && DOM instanceof Object && Widget instanceof Object && get instanceof Function && db instanceof Object) {
				clearInterval(loading);
				LoadResources();

				// Set up path variable
				var path = ReturnPath(full_path);

				// Build app
				//Site.useDarkTheme = getDBData('users',db.currentUser,'color_scheme');
				BuildApp(path);
				navigateTo(path.page,true);
			}
		} catch (exception) {
			//console.log(exception);
		}
	},5);
}

const ReturnPath = (full_path) => {
	var path = {
		full: full_path,
		sub: splitAndTrim(full_path,'/'),
		page: "" // added in next block
	}
	var rootLength = splitAndTrim(Site.root,'/').length;
	for (var i = 0; i < path.sub.length-rootLength; i++) {
		if (i != 0) {path.page += '/';}
		path.page += path.sub[rootLength+i];
	}
	//console.log(path);
	return path;
}

const LoadEssentialResources = () => {
	// Local scripts
	var lastLocalScript;
	for (var i = 0; i < Site.src.js.local.length; i++) {
		if (Site.src.js.local[i].loadFirst == true) {
			var script, src = Site.root+Site.src.root+Site.src.js.local[i].src+'.js';
			try {
				script = DOM.create('script',{type:'text/javascript',src:src});
				try {
					DOM.append(get('head'),script);
					//console.log('a');
				} catch {
					DOM.append(document.getElementsByTagName('HEAD')[0],script);
					//console.log('b');
				}
			} catch {
				script = document.createElement('SCRIPT');
				script.type = 'text/javascript';
				script.src = src;
				document.getElementsByTagName('HEAD')[0].appendChild(script);
				//console.log('c');
			}
			lastLocalScript = script;
		}
	}
	return lastLocalScript;
}
const LoadResources = () => {
	// Local scripts with !loadFirst flag
	for (var i = 0; i < Site.src.js.local.length; i++) {
		if (Site.src.js.local[i].loadFirst == false) {
			DOM.append(get('head'), DOM.create('script', {type:'text/javascript', src:Site.root + Site.src.root + Site.src.js.local[i].src + '.js'}));
		}
	}

	// CDN/Framework scripts
	for (var i = 0; i < Site.src.js.cdn.length; i++) {
		DOM.append(get('head'), DOM.create('script', Site.src.js.cdn[i]));
	}

	// Local styles
	for (var i = 0; i < Site.src.css.local.length; i++) {
		DOM.append(get('head'), DOM.create('link', {type:'text/css', rel:'stylesheet', href:Site.root+Site.src.root+Site.src.css.local[i]+'.css'}));
	}

	// CDN/Framework styles
	for (var i = 0; i < Site.src.css.cdn.length; i++) {
		DOM.append(get('head'), DOM.create('link', {type:'text/css', rel:'stylesheet', href:Site.src.css.cdn[i]}));
	}
}

const BuildApp = (path) => {
	// Set dynamic content
	var nav_ul = DOM.create('ul');
	for (var i = 0; i < Site.cmpnts.nav.length; i++) {
		serveLocalIcon('', Site.cmpnts.nav[i].icon, '#navlink-'+i+'-icon-container');
		var link = (Site.cmpnts.nav[i].link!==undefined) ? Site.cmpnts.nav[i].link : Site.cmpnts.nav[i].title;
		DOM.append(nav_ul, DOM.create('li', {onclick:"navigateTo('"+link+"')", class:'navlink', navigateto:link.toLowerCase()},[
			DOM.create('div',{id:'navlink-'+i+'-icon-container'}),
			DOM.create('span',{},DOM.text(Site.cmpnts.nav[i].title))
		]));
	}
	serveLocalIcon('','chevron-back-outline','#back-button .back-button');

	// Create app
	var app = DOM.create('div',{id:'app'},[
		DOM.create('div',{id:'main-wrap'},[
			// Page
			DOM.create('div',{id:'content-container'},[
				// Header
				DOM.create('header',{},[
					DOM.create('div',{class:'header-fixed'},[
						DOM.create('button',{id:'back-button',class:'stock'},[
							DOM.create('div',{class:'back-button'}),
							DOM.EZ.span('Back')
						]),
						DOM.create('h1',{onclick:"get('#main-wrap').scrollTo({top:0, behavior:'smooth'})", innerHTML:Site.title})
					]),
					DOM.create('div',{class:'header-top'},[
						DOM.create('h1',{innerHTML:Site.title})
					])
				]),
				// Content
				DOM.create('main',{id:'content'})
			]),
		]),
		// Nav
		DOM.create('nav',{},[
			nav_ul
		])
	]);

	var container = get('body');
	while (container.firstChild) {container.removeChild(container.lastChild);}
	DOM.append(get('body'),app);

	// Universal callback functions - ON APP LOAD
	window.onscroll = headerScrollHandler;
	get('#main-wrap').onscroll = headerScrollHandler;
	window.addEventListener('popstate', function(event) {
		var path = ReturnPath(location.pathname);
		ReplaceContent(path.page);
	}, false);
}

function headerScrollHandler() {
	var activePage = '#content-container ';
	var main_wrapST = get('#main-wrap').scrollTop, windowY = window.pageYOffset;
	//console.log(parseInt(get('.header-top h1').style.fontSize.split('px')[0]), main_wrapST, windowY);

	if (main_wrapST==0 && windowY<=0 && windowY>=-40) {
		get(activePage+'.header-top h1').style.fontSize = ((windowY / -8) + 40)+'px';
	} else if (windowY==0 && main_wrapST<=0 && main_wrapST>=-40) {
		get(activePage+'.header-top h1').style.fontSize = ((main_wrapST / -8) + 40)+'px';
	}

	var h_diff = get(activePage+'header').clientHeight-get(activePage+'.header-fixed').clientHeight;
	if (main_wrapST > h_diff) {
		get(activePage+'header').classList.add("fixed");
		get(activePage+'header').style.backgroundColor = '';
		get(activePage+'.header-fixed').style.backgroundColor = '';
		get(activePage+'.header-top h1').style.fontSize = '';
	} else if (main_wrapST <= h_diff && main_wrapST > 0) {
		var bg_rgb = hexToRGB(getCSSVar('--cp-bg')), nav_rgb = hexToRGB(getCSSVar('--cp-acc1')), brdr_rgb = hexToRGB(getCSSVar('--cp-hf-brdr'));
		var mid_rgb_bg = mid_rgb_brdr = 'rgb(';
		for (var i = 0; i < bg_rgb.length; i++) {
			mid_rgb_bg += ((bg_rgb[i] - nav_rgb[i]) * ((h_diff - main_wrapST) / h_diff)) + nav_rgb[i];
			mid_rgb_brdr += ((bg_rgb[i] - brdr_rgb[i]) * ((h_diff - main_wrapST) / h_diff)) + brdr_rgb[i];
			if (i != bg_rgb.length - 1) {mid_rgb_bg += ', '; mid_rgb_brdr += ', ';}
		}
		mid_rgb_bg += ')'; mid_rgb_brdr += ')';
		get(activePage+'header').style.backgroundColor = mid_rgb_bg;
		get(activePage+'header').style.borderBottomColor = mid_rgb_brdr;
		get(activePage+'.header-fixed').style.backgroundColor = mid_rgb_bg;
		get(activePage+'.header-top h1').style.fontSize = '';
		get(activePage+'header').classList.remove("fixed");
	} else {
		get(activePage+'header').classList.remove("fixed");
		get(activePage+'header').style.backgroundColor = '';
		get(activePage+'header').style.borderBottomColor = '';
		get(activePage+'.header-fixed').style.backgroundColor = '';
	}
}

const ReplaceContent = (page_name) => {
	// Replace (or add) page content & title
	var container = get('#content');
	while (container.firstChild) {container.removeChild(container.lastChild);}
	var path = page_name.split('/'), page = Pages(path);
	DOM.append(container,page.content);
	get('#page-title').innerHTML = page.title+' &ndash; '+Site.title;
	get('.header-fixed h1').innerHTML = trimToLength(page.title,30);
	get('.header-top h1').innerHTML = page.title;

	// Universal callback functions - ON PAGE CHANGE
	get('#main-wrap').scrollTo({top:0, behavior:'auto'});
	var navlinks = get('.navlink');
	for (var i = 0; i < navlinks.length; i++) {
		DOM.modify(navlinks[i], {class:'navlink'+((navlinks[i].getAttribute('navigateto') == (page.nav_menu||path[0])) ? ' active' : '')});
	}
	if (isObject(page.back) == true) {
		get('#back-button').style.display = 'flex';
		DOM.modify(get('#back-button'),{onclick:page.back.onclick});
		get('#back-button span').innerHTML = page.back.text;
	} else {
		get('#back-button').style.display = 'none';
	}

	// Page-specific callback functions
	setTimeout(page.callback, 10);
};

function navigateTo(page_name,forceOverwrite=false,eventA) {
	if (eventA instanceof Event) {
		eventA.preventDefault();
	}
	if (page_name.indexOf('http') >= 0) {
		window.open(page_name);
	} else {
		var currentURL = location.href;
		var url = location.origin + Site.root + page_name.toLowerCase();
		if (url.substring(url.length-1)!='/' && url.indexOf('?')==-1) {url += '/';}
		if (currentURL!=url || forceOverwrite==true) {
			history.pushState({id: "100"},'',url);
			ReplaceContent(page_name.toLowerCase());
		}
	}
}

// Input variables included here for simplicity
var title, content;
