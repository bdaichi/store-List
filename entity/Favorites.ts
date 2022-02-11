class Favorite {
    public readonly memoColumn: string;
    public readonly shopId: string;
    public readonly createdAt: Date;

    constructor(
        memoColumn: string,
        shopId: string,
        createdAt: Date,

    ) {
        this.memoColumn = memoColumn;
        this.shopId = shopId;
        this.createdAt = createdAt;
    }

    public static fromJson = (json: any) => {
        const { memoColumn, shopId, createdAt } = Object.assign({}, json);

        if (typeof memoColumn !== 'string') throw new Error('memoColum must be a string');
        if (typeof shopId !== 'string') throw new Error('shopId must be a string');

        const createdAtDate = createdAt.toDate();

        return new Favorite(
            memoColumn,
            shopId,
            createdAtDate,
        )
    }

    toJson() {
        return {
            'memoColumn': this.memoColumn,
            'shopId': this.shopId,
            'createdAt': this.createdAt,
        }
    }

    copyWith(memoColumn: string | null, shopId: string | null,) {
        return new Favorite(
            memoColumn ?? this.memoColumn,
            shopId ?? this.shopId,
            this.createdAt,
        )
    }

    public static createFavorite(shopId: string) {
        return new Favorite(
            '',
            shopId,
            new Date(),
        )
    }

    public static initFavorite() {
        return new Favorite(
            '',
            '',
            new Date(),
        )
    }
}

export default Favorite