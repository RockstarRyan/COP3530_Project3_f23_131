var db = {
	lines: [
		"155.159.163.68,150.62.35.164,297.3,37.0,354.0"
	]
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
