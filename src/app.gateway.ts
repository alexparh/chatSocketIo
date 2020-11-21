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

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger("AppGateway");

	private users = [];

	@SubscribeMessage("sendMsg")
	handleMessage(socket: Socket, message): void {
		socket.to(message.to).emit("getMsg", {
			from: socket.id,
			name: message.toName,
			// to: message.to,
			date: new Date().toLocaleTimeString(),
			text: message.text
		});
	}

	afterInit(server: Server) {
		this.logger.log("Init");
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
