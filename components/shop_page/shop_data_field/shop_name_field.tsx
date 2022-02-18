type Props = {
    shopName: string
}

export default function ShopNameField(props: Props) {

    return (
        <p className='whitespace-pre-wrap' style={{ fontFamily: 'Hannotate SC', textTransform: 'none', }}>{props.shopName}</p>
    )
}
