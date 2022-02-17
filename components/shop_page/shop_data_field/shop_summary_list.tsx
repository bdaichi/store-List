type Props = {
    shopSummary: string
}

export default function ShopSummaryList(props: Props) {

    return (
        <div>
            <p className='text-xl mr-48 my-3 lg:text-3xl' style={{ fontFamily: 'Hannotate SC' }}>概要欄</p>
            <div className='rounded-md shadow-2xl text-xl h-44 w-72 p-4 md:w-96 md:h-52  lg:text-2xl' style={{ borderWidth: 2, borderColor: '#00a6af', }}>
                <p className='whitespace-pre-wrap' style={{ fontFamily: '筑紫A丸ゴシック' }}>{props.shopSummary}</p>
            </div>
        </div>
    )
}
