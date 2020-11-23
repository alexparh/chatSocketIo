import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import bots from "./models/bots";

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger("AppGateway");

	private users = [];
	private messages = [];

	@SubscribeMessage("sendMsg")
	handleMessage(socket: Socket, data): void {
		if (data.to.includes("bot")) {
			const bot = bots.find(bot => {
				return bot.id === data.to;
			});
			if (!bot.hasOwnProperty("chat")) {
				return;
			}
			const message = {
				from: bot.id,
				name: bot.name,
				date: new Date().toLocaleTimeString(),
				text: bot.chat(data.text)
			};
			socket.emit("getMsg", message);
			return;
		}

		const message = {
			from: socket.id,
			name: data.name,
			date: data.date,
			text: data.text
		};

		this.messages.push(message);

		socket.to(data.to).emit("getMsg", message);
	}

	afterInit(server: Server) {
		this.logger.log("Init");

		this.users.push(...bots);
	}

	handleDisconnect(socket: Socket) {
		this.logger.log(`Client disconnected: ${socket.id}`);
		for (let i = 0; i < this.users.length; i++) {
			if (this.users[i].id === socket.id) {
				this.users[i].status = "offline";
			}
		}
		this.server.emit("userDisconnect", socket.id);
	}

	handleConnection(socket: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${socket.id}`);

		const user = {
			id: socket.id,
			name: "u." + socket.id,
			status: "online",
			imgUrl: "https://www.lewesac.co.uk/wp-content/uploads/2017/12/default-avatar.jpg",
			messages: [{ from: "", to: "", text: "" }]
		};
		this.users.push(user);
		socket.emit("userConnect", user);

		this.users.forEach(toUser => {
			this.server.to(toUser.id).emit(
				"usersList",
				this.users.filter(user => {
					return user.id !== toUser.id;
				})
			);
		});
	}
}
