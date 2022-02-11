import { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { AuthContext } from '../context/AuthContext';
import { authSendSignInLinkToEmail } from '../service/auth_service'
import Header from '../components/common/header';

export default function SendEmailLink() {
    const router = useRouter()
    const { currentUser } = useContext(AuthContext)

    const emailInputRef = useRef<HTMLTextAreaElement>(null);
    const [email, setEmail] = useState<string>('')
    const [emailInputError, setEmailInputError] = useState(false);
    const [hasSentEmail, setHasSentEmail] = useState(false);


    const emailHandler = (e: any) => {
        if (emailInputRef.current) {
            const ref = emailInputRef.current;
            if (ref != null && !ref.validity.valid) {
                setEmailInputError(true);
            } else {
                setEmailInputError(false);
                setEmail(e.target.value)
            }
        }
    }

    const sendSignInLinkToEmail = async () => {
        if (email == '' || emailInputError) {
            console.log('Email is invalid')
            return;
        }
        try {
            await authSendSignInLinkToEmail(email)
            // メール送信後は画面表示を変えるため、フラグ変更
            setHasSentEmail(true)
        } catch (e) {
            console.log('Error in sendSignInLinkToEmail: ', e)
        }
    }

    useEffect(() => {
        if (currentUser) {
            // ログイン済みの場合はマイページへ
            console.log('Already sign in !!')
            router.push('/shop_list_page')
        }
    }, []);

    return (
        <>
            <Header title='サインイン' />
            <main>
                <div className='flex flex-col justify-center'>
                    <p className='text-2xl flex justify-center mt-24 my-12' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }} >メールアドレス認証</p>
                    {!hasSentEmail ?
                        <>
                            <div className='flex justify-center mb-8'>
                                <TextField
                                    className="md:w-2/5 w-3/4"
                                    id="email"
                                    label="メールアドレス"
                                    color="primary"
                                    variant="outlined"
                                    type="email"
                                    error={emailInputError}
                                    inputProps={{ pattern: "^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$" }}
                                    inputRef={emailInputRef}
                                    helperText={emailInputError && '有効なメールアドレスを入力してください'}
                                    onChange={(e) => emailHandler(e)}
                                />
                            </div>
                            <div className='flex justify-center mb-8'>
                                <Button
                                    variant="contained"
                                    style={{ color: 'white', backgroundColor: '#00a6af' }}
                                    onClick={sendSignInLinkToEmail}
                                    disabled={email == '' || emailInputError}
                                >
                                    確認メールを送信
                                </Button>
                            </div>
                        </> :
                        <>
                            <p className='flex justify-center font-bold text-text-done text-base mx-6 my-1' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                                確認メールをお送りしました。
                            </p>
                            <p className='flex justify-center font-bold text-text-done text-base mx-6' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                                メールボックスを確認してください。
                            </p>
                            <p className='flex justify-center font-bold text-text-default text-base mx-6 my-1' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                                メールが届かない場合、
                            </p>
                            <p className='flex justify-center font-bold text-text-done text-base mx-6' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                                迷惑メールフォルダに振り分けられている
                            </p>
                            <p className='flex justify-center font-bold text-text-done text-base mx-6 my-1' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                                可能性があります。
                            </p>
                        </>}
                </div>
            </main>
        </>
    )
}