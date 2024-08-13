import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RedisService } from "../../common/redis/redis.service";

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly redisService: RedisService) {
        this.subscribeToRedis();  // 클래스 초기화 시 구독 수행
    }

    private async subscribeToRedis() {
        await this.redisService.subscribe('notifications', (message: string) => {
            this.server.emit('notifications', JSON.parse(message));
        });
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    sendNotification(notification: any) {
        this.server.emit('notifications', notification);
    }
}
