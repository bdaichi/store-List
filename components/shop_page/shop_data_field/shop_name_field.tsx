type Props = {
    shopName: string
}

export default function ShopNameField(props: Props) {

    return (
        <p className='overflow-y-scroll h-8' style={{ fontFamily: 'Hannotate SC', textTransform: 'none', }}>{props.shopName}</p>
    )
}
