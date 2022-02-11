type Props = {
    imageUrl: string
    size: string | number
}

export default function ShopImage(props: Props) {
    const defaultImageUrl = 'https://kotobank.jp/image/dictionary/daijisen/media/104696.jpg'

    return (
        <>
            <div className='felx justify-center shadow-xl'>
                <img src={props.imageUrl == '' ? defaultImageUrl : props.imageUrl}
                    style={{ height: props.size, width: props.size, minHeight: 200, minWidth: 300, maxHeight: 200, maxWidth: 600, }}
                />
            </div>
        </>

    )

}