type Props = {
    shopName: string
}

export default function ShopNameField(props: Props) {

    return (
        <p style={{ fontFamily: 'Hannotate SC', }}>{props.shopName}</p>
    )
}