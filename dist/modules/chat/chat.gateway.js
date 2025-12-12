"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const ai_service_1 = require("../../core/ai/ai.service");
const message_service_1 = require("../message/message.service");
const configService = new config_1.ConfigService();
let ChatGateway = class ChatGateway {
    jwtService;
    configService;
    aiService;
    messageService;
    server;
    constructor(jwtService, configService, aiService, messageService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.aiService = aiService;
        this.messageService = messageService;
    }
    handleConnection(client, ...args) {
        const token = this.extractTokenFromHandshake(client);
        if (!token) {
            client.disconnect(true);
            return;
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            client.user = { _id: payload.sub, username: payload.username };
            console.log(`User ${payload.username} connected via WebSocket`);
        }
        catch (err) {
            console.warn('Invalid JWT in WebSocket handshake', err);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        client.disconnect(true);
        console.log('Client disconnected');
    }
    extractTokenFromHandshake(client) {
        const authHeader = client.handshake.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return client.handshake.query?.token;
    }
    async handleMessage(client, data) {
        if (!client.user) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        const { content, aiModel } = data;
        const userId = client.user._id;
        await this.messageService.create(userId, 'user', content, aiModel);
        client.emit('typing', { aiModel });
        let aiResponse = '';
        try {
            const provider = this.aiService.getProvider(aiModel);
            aiResponse = await provider.generateResponse(content);
        }
        catch (error) {
            client.emit('error', {
                message: `Failed to get response from ${aiModel}: ${error}`,
            });
            return;
        }
        await this.messageService.create(userId, 'ai', aiResponse, aiModel);
        client.emit('message', {
            role: 'ai',
            content: aiResponse,
            aiModel,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: configService.get('ENABLE_CORS'),
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        ai_service_1.AiService,
        message_service_1.MessageService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map