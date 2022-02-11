import { Button, Icon, Modal } from "@material-ui/core";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { Crop } from "react-image-crop"
import Resizer from "react-image-file-resizer"
import { useState } from "react";

type Props = {
    setCroppedShopImage: any
    onClickFunction: () => Promise<void>
}

export default function ShopImageUpdateField(props: Props) {
    const [crop, setCrop] = useState<Crop>();

    const [shopImageFile, setShopImageFile] = useState<string>('');
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
    const [isOpenedCropModal, setIsOpenedCropModal] = useState(false)
    const [maxShopImageSize, setMaxShopImageSize] = useState<number>(0);

    const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setCrop({
            unit: "px",
            x: 0,
            y: 0,
            width: 350,
            height: 200,
            aspect: 16 / 9
        })
        if (e.target.files !== null) {
            console.log('handleImage: ', crop)
            const imageFile = await resizeFile(e.target.files[0])
            const image = new Image();
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result !== 'string') throw new Error('reader.result must be a string');
                setShopImageFile(reader.result)

                image.src = reader.result;
                image.onload = function () {

                    setMaxShopImageSize(400)
                    setMaxShopImageSize(700)
                }
            };
            reader.readAsDataURL(imageFile);
            setIsOpenedCropModal(true)
            e.target.value = ''
        }
    };

    const onCropChange = (crop: Crop) => {
        setCrop(crop);
    };

    const onCropComplete = (crop: any) => {
        if (imageRef && crop.width && crop.height) {
            const canvas = document.createElement("canvas")
            const scaleX = imageRef.naturalWidth / imageRef.width;
            const scaleY = imageRef.naturalHeight / imageRef.height;
            canvas.width = crop.width
            canvas.height = crop.height
            const ctx = canvas.getContext("2d")
            if (ctx !== null) {
                ctx.drawImage(
                    imageRef,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width,
                    crop.height
                )
            }
            canvas.toBlob(blob => {
                if (blob != null) {
                    props.setCroppedShopImage(blob)
                }
            });
        }
    };

    const onImageLoaded = (image: HTMLImageElement) => {
        setImageRef(image);
    };

    const resizeFile = (file: Blob): Promise<Blob> => {
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                500,
                500,
                'JPEG',
                100,
                0,
                (uri) => {
                    resolve(uri as Blob)
                },
                'blob'
            )
        })
    }

    const onClickFunction = () => {
        props.onClickFunction();
        setIsOpenedCropModal(false)
    }

    return (
        <>
            <div className='flex flex-row items-center ml-4'>
                <Button>
                    <label htmlFor="file" className='flex flex-row jutify-center'>
                        <p className='flex items-center text-2xl ms' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>画像選択</p>
                        <Icon className='flex items-center '>
                            <AddPhotoAlternateIcon style={{ color: '#00a6af', width: 22, height: 30, }} />
                        </Icon>
                        <input
                            id="file"
                            accept="image/*"
                            type="file"
                            onChange={handleChangeImage}
                            hidden
                        />
                    </label>
                </Button>
            </div>
            <Modal
                open={isOpenedCropModal}
            >
                <div style={{ top: '50%', left: '50%' }} className="md:mx-16 rounded-xl bg-bg-base mb-4 p-4 flex flex-col justify-center items-center my-2 space-y-6">
                    {crop && <ReactCrop
                        src={shopImageFile}
                        crop={crop}
                        onImageLoaded={onImageLoaded}
                        onComplete={onCropComplete}
                        onChange={onCropChange}
                        circularCrop={false}
                        maxHeight={maxShopImageSize}
                        maxWidth={maxShopImageSize}
                        minHeight={250}
                        minWidth={400}
                    />}
                    <div className="flex flex-row rounded bg-white">
                        <Button
                            style={{ margin: 20, borderWidth: 3, }}
                            variant="outlined"
                            color="primary"
                            onClick={() => setIsOpenedCropModal(false)}>
                            キャンセル
                        </Button>
                        <Button
                            style={{ margin: 20, }}
                            variant="contained"
                            color="primary"
                            onClick={onClickFunction}
                        >
                            登録する
                        </Button>
                    </div>
                </div>
            </Modal>
        </>

    )
}