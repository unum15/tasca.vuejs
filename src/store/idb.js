const DB_NAME = 'tascadb';
const DB_VERSION = 6;
let DB;

export default {

	async getDb() {
	return new Promise((resolve, reject) => {

		if(DB) { return resolve(DB); }
            let request = window.indexedDB.open(DB_NAME, DB_VERSION);
			
			request.onerror = () => {
				reject('Error');
			};
	
			request.onsuccess = e => {
				DB = e.target.result;
				resolve(DB);
			};
			
			request.onupgradeneeded = e => {
				let db = e.target.result;
                if (e.oldVersion > 1) {
                    db.deleteObjectStore("user");
                }
				if (e.oldVersion > 5) {
					db.deleteObjectStore("filters");
				}
				db.createObjectStore("user");
				db.createObjectStore("filters");
			};
		});
	},
	async deleteUser() {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['user'],'readwrite');
			trans.oncomplete = () => {
				resolve();
			};

			let store = trans.objectStore('user');
			store.delete('user');
		});	
	},

	async saveUser(user) {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['user'],'readwrite');
			trans.oncomplete = () => {
				resolve();
			};

			let store = trans.objectStore('user');
			store.put(user,'user');

		});
	
	},
    
    async saveSettings(settings) {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['user'],'readwrite');
			trans.oncomplete = () => {
				resolve();
			};

			let store = trans.objectStore('user');
			store.put(settings,'settings');

		});
	
	},
    async getSettings() {

		let db = await this.getDb();

        return new Promise(resolve => {
			let trans = db.transaction(['user'],'readonly');
            trans.oncomplete = () => {
				resolve(settings);
			};
            let settings = {}
			let store = trans.objectStore('user');
            let request = store.get('settings')
            request.onsuccess = e => {
                settings = e.target.result;
            }
            
        });    
            
	},
	async deleteSettings() {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['user'],'readwrite');
			trans.oncomplete = () => {
				resolve();
			};

			let store = trans.objectStore('user');
			store.delete('settings');
		});	
	},
    async getUser() {

		let db = await this.getDb();

        return new Promise(resolve => {
			let trans = db.transaction(['user'],'readonly');
            trans.oncomplete = () => {
				resolve(user);
			};
            let user = {}
			let store = trans.objectStore('user');
            let request = store.get('user');
            request.onsuccess = e => {
                user = e.target.result;
            }
            
        });    
            
	},
	
	
	async saveFilters(filters,name) {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['filters'],'readwrite');
			trans.oncomplete = () => {
				resolve();
			};

			let store = trans.objectStore('filters');
			store.put(filters,name);

		});
	
	},
	
	async getFilters() {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['filters'],'readonly');
			trans.oncomplete = () => {
				resolve(filters);
			};
			let filters = {};
			let store = trans.objectStore('filters');
			let request = store.getAll();
            request.onsuccess = e => {
                filters = e.target.result;
            }

		});
	
	},
	async deleteFilters() {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['filters'],'readwrite');
			trans.oncomplete = () => {
				resolve();
			};

			let store = trans.objectStore('filters');
			store.delete('assets');
		});	
	},

}
