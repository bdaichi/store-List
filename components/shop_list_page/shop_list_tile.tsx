import ShopImage from "../shop_page/shop_data_field/shop_image";
import ShopNameField from "../shop_page/shop_data_field/shop_name_field";

type Props = {
    imageUrl: string
    shopName: string
    color: string
}

export default function ShopListTile(props: Props) {

    return (
        <>
            <div className='flex flex-col justify-center shadow-2xl transform -skew-y-2 pl-4 mx-12 my-8 rounded-xl px-5 bg-white md:flex-row py-4' style={{ borderTopWidth: 2, borderLeftWidth: 2, borderBottomWidth: 4, borderRightWidth: 7, borderColor: props.color, }}>
                <div className='shadow-xl border-r-8 border-b-4 border-gray-300 border-opacity-25'>
                    <ShopImage imageUrl={props.imageUrl} size={100} />
                </div>
                <div className='flex justify-center transform -rotate-2 pr-2 text-2xl my-8 mx-8 md:w-64 items-center' style={{ color: 'black', }}>
                    <ShopNameField shopName={props.shopName} />
                </div>
            </div>
        </>
    )
}