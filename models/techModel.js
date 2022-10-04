const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

class Tech {
	constructor(techName, duration, image) {
		this.techName = techName;
		this.duration = duration;
		this.image = image;
		this.id = uuid.v4();
	}

	static saveToStack(stack) {
		return new Promise((resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '../data/stack.json'),
				JSON.stringify(stack),
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve(stack);
					}
				}
			);
		});
	}

	async saveAddedTech() {
		const stack = await Tech.getAll();
		const tech = {
			techName: this.techName,
			duration: this.duration,
			image: this.image,
			id: this.id,
		};
		stack.push(tech);

		Tech.saveToStack(stack);
	}

	static async update(tech) {
		const stack = await Tech.getAll();

		const index = stack.findIndex((el) => el.id === tech.id);
		stack[index] = tech;
		Tech.saveToStack(stack);
	}

	static getAll() {
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(__dirname, '../data/stack.json'),
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

	static async getById(id) {
		const stack = await Tech.getAll();
		return stack.find((el) => el.id === id);
	}
}

module.exports = Tech;
