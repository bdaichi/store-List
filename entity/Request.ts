class Request {
    public readonly requestName: string;
    public readonly shopId: string;
    public readonly createUserId: string;
    public readonly createdAt: Date;
    public readonly latestMessage: string;
    public readonly upDatedAt: Date;

    constructor(
        requestName: string,
        shopId: string,
        createUserId: string,
        createdAt: Date,
        latestMessage: string,
        upDatedAt: Date,
    ) {
        this.requestName = requestName;
        this.shopId = shopId;
        this.createUserId = createUserId
        this.createdAt = createdAt;
        this.latestMessage = latestMessage;
        this.upDatedAt = upDatedAt
    }

    public static fromJSON = (json: any) => {
        const { requestName, shopId, createUserId, createdAt, latestMessage, upDatedAt } = Object.assign({}, json);

        if (typeof requestName !== 'string') throw new Error('requestName must be a string');
        if (typeof shopId !== 'string') throw new Error('shopId must be a string');
        if (typeof createUserId !== 'string') throw new Error('requestName must be a string');
        if (typeof latestMessage !== 'string') throw new Error('latestMessage must be a string');

        const createdAtDate = createdAt.toDate();
        const upDatedAtDate = upDatedAt.toDate();

        return new Request(
            requestName,
            shopId,
            createUserId,
            createdAtDate,
            latestMessage,
            upDatedAtDate,
        );
    };

    toJson() {
        return {
            'requestName': this.requestName,
            'shopId': this.shopId,
            'createUserId': this.createUserId,
            'createdAt': this.createdAt,
            'latestMessage': this.latestMessage,
            'upDatedAt': this.upDatedAt
        }
    }

    copyWith(requestName: string | null, shopId: string | null, createUserId: string | null, latestMessage: string | null) {
        return new Request(
            requestName ?? this.requestName,
            shopId ?? this.shopId,
            createUserId ?? this.createUserId,
            this.createdAt,
            latestMessage ?? this.latestMessage,
            new Date(),
        )
    }

    public static createRequest = (
        requestName: string,
        shopId: string,
        createUserId: string,
        latestMessage: string,
    ) => {
        return new Request(
            requestName,
            shopId,
            createUserId,
            new Date(),
            latestMessage,
            new Date(),
        )
    }
}

export default Request;