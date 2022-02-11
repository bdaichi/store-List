class User {

    public readonly userName: string;
    public readonly userId: string;
    public favoritesCount: number;
    public readonly createdAt: Date;

    constructor(
        userName: string,
        userId: string,
        favoritesCount: number,
        createdAt: Date,
    ) {
        this.userName = userName;
        this.userId = userId;
        this.favoritesCount = favoritesCount;
        this.createdAt = createdAt;
    }

    public static fromJSON = (json: any) => {
        const { userName, userId, favoritesCount, createdAt } = Object.assign({}, json);

        if (typeof userName !== 'string') throw new Error('userName must be a string');
        if (typeof userId !== 'string') throw new Error('userId must be a string');
        if (typeof favoritesCount !== 'number') throw new Error('userId must be a number');

        const createdAtDate = createdAt.toDate();

        return new User(
            userName,
            userId,
            favoritesCount,
            createdAtDate,
        );
    };

    toJson = () => {
        return {
            'userName': this.userName,
            'userId': this.userId,
            'favoritesCount': this.favoritesCount,
            'createdAt': this.createdAt,
        }
    }

    copyWith(userName: string | null, userId: string | null, favoritesCount: number | null) {
        return new User(
            userName ?? this.userName, // ?? の左側がnull undefined　のときに右の値を返す
            userId ?? this.userId,
            favoritesCount ?? this.favoritesCount,
            this.createdAt
        )
    }

    public static createUser = (userName: string, userId: string) => {
        return new User(
            userName,
            userId,
            0,
            new Date(),
        );
    }

    public static initUser = () => {
        return new User(
            '',
            'init',
            0,
            new Date()
        );
    }

}

export default User;