const fs = require('fs');
const path = require('path');

class Learning {
	constructor(tech) {
		this.tech = tech;
	}

	static saveList(list) {
		return new Promise((resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '../data/learningList.json'),
				JSON.stringify(list),
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve(list);
					}
				}
			);
		});
	}

	static getList() {
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(__dirname, '../data/learningList.json'),
				'utf-8',
				(err, content) => {
					if (err) {
						reject(err);
					} else {
						resolve(JSON.parse(content));
					}
				}
			);
		});
	}

	async addTech() {
    const list = await Learning.getList();
		if (list.find(tech => tech.id === this.tech.id)) {
			return;
		} else {
			list.push(this.tech);
    Learning.saveList(list);
		}
  }

	static async deleteTech(id) {
		let list = await Learning.getList();
		list = list.filter(tech => tech.id !== id);
		Learning.saveList(list);
	}
}

module.exports = Learning;
