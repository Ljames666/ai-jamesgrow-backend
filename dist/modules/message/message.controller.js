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
exports.ChatController = exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const message_service_1 = require("./message.service");
const ai_service_1 = require("../../core/ai/ai.service");
let MessageController = class MessageController {
    messageService;
    constructor(messageService) {
        this.messageService = messageService;
    }
    async findAll(req, aiModel) {
        const userId = req.user._id;
        return this.messageService.findAllByUser(userId, aiModel);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('aiModel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "findAll", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
class ChatRequestDto {
    content;
    aiModel;
}
let ChatController = class ChatController {
    messageService;
    aiService;
    constructor(messageService, aiService) {
        this.messageService = messageService;
        this.aiService = aiService;
    }
    async sendMessage(req, dto) {
        console.log('ChatController sendMessage called with dto:', dto);
        console.log('User ID:', req.user._id);
        const userId = req.user._id;
        await this.messageService.create(userId, 'user', dto.content, dto.aiModel);
        let aiResponse = '';
        try {
            const provider = this.aiService.getProvider(dto.aiModel);
            aiResponse = await provider.generateResponse(dto.content);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new common_1.HttpException(`AI model ${dto.aiModel} failed: ${errorMessage}`, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        await this.messageService.create(userId, 'ai', aiResponse, dto.aiModel);
        return {
            userMessage: dto.content,
            aiResponse,
            aiModel: dto.aiModel,
        };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChatRequestDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        ai_service_1.AiService])
], ChatController);
//# sourceMappingURL=message.controller.js.map