import firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';


class Shop {
    public readonly shopId: string;
    public readonly createUserId: string;
    public readonly shopName: string;
    public readonly shopSummary: string;
    public readonly shopImageUrl: string;
    public readonly shopLocation: number[] | null;
    public readonly shopPrefecture: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(
        shopId: string,
        createUserId: string,
        shopName: string,
        shopSummary: string,
        shopImageUrl: string,
        shopLocation: number[] | null,
        shopPrefecture: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.shopId = shopId;
        this.createUserId = createUserId;
        this.shopName = shopName;
        this.shopSummary = shopSummary;
        this.shopImageUrl = shopImageUrl;
        this.shopLocation = shopLocation;
        this.shopPrefecture = shopPrefecture
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static fromJson = (json: any) => {
        const { shopId, createUserId, shopName, shopSummary, shopImageUrl, shopLocation, shopPrefecture, createdAt, updatedAt, } = Object.assign({}, json);

        if (typeof shopId !== 'string') throw new Error('shopId must be a string');
        if (typeof createUserId !== 'string') throw new Error('createUserId must be a string');
        if (typeof shopName !== 'string') throw new Error('shopName must be a string');
        if (typeof shopSummary !== 'string') throw new Error('shopSummary must be a string');
        if (typeof shopImageUrl !== 'string') throw new Error('shopImageUrl must be a string');
        if (typeof shopPrefecture !== 'string') throw new Error('shopPrefecture must be a string');

        const createdAtDate = createdAt.toDate();
        const updatedAtDate = updatedAt.toDate();

        return new Shop(
            shopId,
            createUserId,
            shopName,
            shopSummary,
            shopImageUrl,
            shopLocation == null ? null : [shopLocation.latitude, shopLocation.longitude],
            shopPrefecture,
            createdAtDate,
            updatedAtDate,
        );
    }

    toJson() {
        return {

            'shopId': this.shopId,
            'createUserId': this.createUserId,
            'shopName': this.shopName,
            'shopSummary': this.shopSummary,
            'shopImageUrl': this.shopImageUrl,
            'shopLocation': this.shopLocation == null ? null : new firebase.firestore.GeoPoint(this.shopLocation[0], this.shopLocation[1]),
            'shopPrefecture': this.shopPrefecture,
            'createdAt': this.createdAt,
            'updatedAt': this.updatedAt,
        }
    }

    copyWith(shopId: string | null, createUserId: string | null, shopName: string | null, shopSummary: string | null, shopImageUrl: string | null, shopLocation: number[] | null, shopPrefecture: string | null, updatedAt: Date | null) {
        return new Shop(
            shopId ?? this.shopId,
            createUserId ?? this.createUserId,
            shopName ?? this.shopName,
            shopSummary ?? this.shopSummary,
            shopImageUrl ?? this.shopImageUrl,
            shopLocation ?? this.shopLocation,
            shopPrefecture ?? this.shopPrefecture,
            this.createdAt,
            updatedAt ?? this.updatedAt
        )
    }

    public static createShop(createUserId: string, shopName: string, shopSummary: string,) {
        return new Shop(
            uuidv4(),
            createUserId,
            shopName,
            shopSummary,
            '',
            null,
            '',
            new Date(),
            new Date(),
        )
    }

    public static initShop = () => {
        return new Shop(
            'init',
            '',
            'shopName',
            'summary',
            'imageUrl',
            null,
            '',
            new Date(),
            new Date(),
        )
    }
}

export default Shop