const bots = [
	{
		id: "bot-0",
		name: "Echo bot",
		status: "online",
		imgUrl:
			"https://www.iconarchive.com/download/i108305/google/noto-emoji-smileys/10101-alien.ico",
		chat: message => {
			return message;
		}
	},
	{
		id: "bot-1",
		name: "Reverse bot",
		status: "online",
		imgUrl:
			"https://igroutka.net/uploads/posts/2016-12/1483085247_igra-spanch-bob-kto-umnee-ty-ili-patrik_star.jpg",
		chat: async message => {
			await new Promise(resolve => setTimeout(resolve, 3000));
			return [...message].reverse().join("");
		}
	},
	{
		id: "bot-2",
		name: "Spam bot",
		status: "online",
		imgUrl: "https://i.pinimg.com/originals/da/7d/57/da7d573723ea84ef0555b46b51567280.jpg",
		message: "spam",
		getRandomInterval: () => {
			return Math.random() * 110000 + 10000;
		}
	},
	{
		id: "bot-3",
		name: "Ignore bot",
		status: "online",
		imgUrl: "https://preview.free3d.com/img/2015/06/2146721034236069446/rers5wkn-900.jpg"
	}
];

export default bots;
