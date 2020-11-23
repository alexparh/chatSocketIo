const app = new Vue({
	el: "#app",
	data: {
		me: {},
		msgToUser: "",
		users: [],
		messages: [],
		msgText: "",
		selectedUser: { name: "Select chat" },
		selectedMessages: [],
		filteredUsers: [],
		active: "all",
		search: "",
		socket: null
	},
	methods: {
		sendMessage() {
			if (this.validateInput()) {
				const message = {
					from: this.me.id,
					to: this.selectedUser.id,
					name: this.me.name,
					date: new Date().toLocaleTimeString(),
					text: this.msgText
				};
				this.messages.push(message);
				this.selectedMessages.push(message);
				this.socket.emit("sendMsg", message);
				this.msgText = "";
			}
		},
		receivedMessage(message) {
			this.messages.push(message);
			if (message.from === this.selectedUser.id) {
				this.selectedMessages.push(message);
			}
		},
		validateInput() {
			return this.msgText.trim().length > 0;
		},
		updateUsers(users) {
			this.users = users;
			this.filteredUsers = users;
		},
		selectUser(user) {
			this.selectedUser = user;
			this.selectedMessages = this.messages.filter(message => {
				return message.to === user.id || message.from === user.id;
			});
		},
		selectAll() {
			this.active = "all";
			this.filteredUsers = this.users;
		},
		selectOnline() {
			this.active = "online";
			this.filteredUsers = this.users.filter(user => {
				return user.status === "online";
			});
		},
		connect(user) {
			if (user.id === this.socket.id) {
				this.me = user;
				console.log(this.me);
			}
		},
		disconnect(userId) {
			this.users.find(element => {
				if (element.id === userId) {
					element.status = "offline";
				}
			});
		}
	},
	computed: {
		filteredList() {
			return this.filteredUsers.filter(user => {
				return user.name.toLowerCase().includes(this.search.toLowerCase());
			});
		}
	},
	created() {
		this.socket = io("http://localhost:3000");
		this.socket.on("getMsg", message => {
			this.receivedMessage(message);
		});
		this.socket.on("usersList", users => {
			this.updateUsers(users);
		});
		this.socket.on("userConnect", user => {
			this.connect(user);
		});
		this.socket.on("userDisconnect", userId => {
			this.disconnect(userId);
		});
	}
});
