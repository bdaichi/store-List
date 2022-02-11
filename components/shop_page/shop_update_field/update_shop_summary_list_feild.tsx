import { Button, TextField } from "@material-ui/core";
import { useState } from "react";

import Shop from "../../../entity/Shop";
import ShopSummaryList from "../shop_data_field/shop_summary_list";
import { updateShopData } from "../../../service/shop_service";

type Props = {
    shop: Shop
    setIsReloadData: any
}

export default function UpdateShopSummaryListFeild(props: Props) {
    const [editingSummaryList, setEditingSummaryList] = useState('')
    const [isEditingSummaryList, setIsEditingSummaryList] = useState(false)

    const editSummaryList = () => {
        setIsEditingSummaryList(true)
    }

    const updateSummaryList = async () => {
        try {
            if (editingSummaryList == '') {
                console.log('editingSummaryList is empty');
                return;
            }
            const updateShop = props.shop.copyWith(null, null, null, editingSummaryList, null, null, null, new Date())
            await updateShopData(updateShop)
            setIsEditingSummaryList(false)
            props.setIsReloadData(false)
        } catch (e) {
            console.log("Error in updateSummaryList: ", e)
        }
    }

    return (
        <>{!isEditingSummaryList ?
            <div>
                <div className='flex justify-center my-8' style={{ alignItems: 'center', }}>
                    <ShopSummaryList shopSummary={props.shop.shopSummary} />
                </div>
                <div className='flex justify-center'>
                    <Button
                        variant='contained'
                        style={{ backgroundColor: '#00a6af', color: 'white', }}
                        onClick={editSummaryList}
                    >
                        <p className='text-lg' style={{ fontFamily: '筑紫A丸ゴシック', }}>メモを編集する</p>
                    </Button>
                </div>
            </div>
            :
            <div className='flex flex-col'>
                <TextField
                    style={{ height: 'auto', width: 250, }}
                    multiline={true}
                    rows={3}
                    defaultValue={props.shop.shopSummary}
                    variant="outlined"
                    label="メモ"
                    onChange={(e) => setEditingSummaryList(e.target.value)}
                />
                <Button
                    variant='contained'
                    style={{ backgroundColor: '#00a6af', color: 'white', margin: 20, }}
                    onClick={updateSummaryList}
                >
                    <p style={{ fontFamily: '筑紫A丸ゴシック' }}>保存する</p>
                </Button>
            </div>
        }</>
    )
}