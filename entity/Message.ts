class Message {
    public readonly message: string;
    public readonly messageId: string;
    public readonly createdAt: Date;

    constructor(
        message: string,
        messageId: string,
        createdAt: Date,
    ) {
        this.message = message;
        this.messageId = messageId;
        this.createdAt = createdAt;
    }
    public static fromJSON = (json: any) => {
        const { message, messageId, createdAt } = Object.assign({}, json);

        if (typeof message !== 'string') throw new Error('message must be a string');
        if (typeof messageId !== 'string') throw new Error('messageId must be a string');

        const createdAtDate = createdAt.toDate();

        return new Message(
            message,
            messageId,
            createdAtDate,
        );
    };

    toJson() {
        return {
            'message': this.message,
            'messageId': this.messageId,
            'createdAt': this.createdAt,
        }
    }

    public static createMessage = (
        message: string,
        messageId: string,
    ) => {
        return new Message(
            message,
            messageId,
            new Date(),
        )
    }
}

export default Message;