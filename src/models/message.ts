class Message {
	from: string;
	to: string;
	text: string;
	time: string;

	constructor(from: string, to: string, text: string) {
		this.from = from;
		this.text = text;
		this.time = new Date().toString().slice(15, 24);
	}
}

module.exports = () => {
	return Message;
};
