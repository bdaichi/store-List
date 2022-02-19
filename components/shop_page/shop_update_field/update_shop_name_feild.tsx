import { Button, TextField } from "@material-ui/core";
import { useState } from "react";

import Request from "../../../entity/Request";
import Shop from "../../../entity/Shop";
import { updateRepuestName } from "../../../service/request_service";
import { updateShopData } from "../../../service/shop_service";

type Props = {
    request: Request[]
    shop: Shop
    setIsReloadData: any
}

export default function UpdateShopNameFeild(props: Props) {
    const [editingName, setEditingName] = useState('')

    const [isEditingName, setIsEditingName] = useState(false)

    const editName = () => {
        setIsEditingName(true)
    }

    const updateName = async () => {
        try {
            if (editingName == '') {
                console.log('editingName is empty');
                return;
            }
            const updateShop = props.shop.copyWith(null, null, editingName, null, null, null, null, new Date())
            await updateShopData(updateShop)
            if (props.request && (props.request[0] != null)) {
                const updateRequest = props.request[0].copyWith(editingName, null, null, null)
                await updateRepuestName(props.shop.shopId, updateRequest)
            }
            setIsEditingName(false)
            props.setIsReloadData(false)
        } catch (e) {
            console.log("Error in updateName: ", e)
        }
    }

    return (
        <>
            {!isEditingName ?
                <div>
                    <p className='flex justify-center my-8 text-2xl' style={{ fontFamily: 'Hannotate SC', }} >{props.shop.shopName}</p>
                    <div className='flex justify-center'>
                        <Button
                            variant='contained'
                            style={{ backgroundColor: '#00a6af', color: 'white', fontFamily: '筑紫A丸ゴシック' }}
                            onClick={editName}
                        >
                            <p className='text-lg'>名前を変更する</p>
                        </Button>
                    </div>
                </div>
                :
                <div>
                    <TextField
                        className='w-60'
                        defaultValue={props.shop.shopName}
                        id='shopName'
                        label='表示名'
                        color='primary'
                        onChange={(e) => setEditingName(e.target.value)}
                    />
                    <Button
                        variant='contained'
                        style={{ backgroundColor: '#00a6af', color: 'white', fontFamily: '筑紫A丸ゴシック' }}
                        onClick={updateName}
                    >
                        保存する
                    </Button>
                </div>
            }
        </>
    )
}