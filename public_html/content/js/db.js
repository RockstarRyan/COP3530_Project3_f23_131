var db = {
	articles: {
		"welcome": {title:"Welcome!", author:'Event Staff', authorPic:'tipisa.png', date:new Date(2021, 8, 9), edition:"Online", starred:true, content:'<p>Welcome to the 75th Anniversary Fall Fellowship! All updates to the Event Passport will be posted here.</p>'},
	},
};


function getDBData(collName,docKey,fieldName) {
	if (collName == 'currentUser') {
		return db.currentUser;
	} else {
		if (isDefined(fieldName) == true) {
			return db[collName][docKey][fieldName];
		} else if (isDefined(docKey) == true) {
			return db[collName][docKey];
		} else {
			return db[collName];
		}
	}
}

function getDocsWithFieldCond(collName,conditions) {
	var coll = getDBData(collName), newColl = {};
	Object.keys(coll).map(key => {
		var match = true;
		Object.keys(conditions).map(field => {
			switch (conditions[field][0]) {
				case '<=': if (coll[key][field] > conditions[field][1]) {match = false;} break;
			}
		});
		if (match == true) {
			newColl[key] = Object.assign({},coll[key]);
		}
	});
	return newColl;
}
