import { useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { AuthContext } from '../context/AuthContext';
import { authIsSignInWithEmailLink, authSignInWithEmailLink } from '../service/auth_service'
import Header from '../components/common/header';

export default function SignIn() {
    const router = useRouter()
    const { currentUser } = useContext(AuthContext)
    const emailInputRef = useRef<HTMLTextAreaElement>(null);

    const [email, setEmail] = useState<string>('')
    const [emailInputError, setEmailInputError] = useState(false);
    const [signInError, setSignInError] = useState(false);

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

    const signInWithEmailLink = async () => {
        if (email == '' || emailInputError) {
            console.log('Email is invalid')
            return;
        }
        try {
            const userId = await authSignInWithEmailLink(email, window.location.href)
            setSignInError(false)
        } catch (e) {
            setSignInError(true)
            console.log('Error in signInWithEmailLink: ', e)
        }
    }

    useEffect(() => {
        if (currentUser) {

            console.log('Already sign in !!')
            router.push('/shop_list_page')
        } else if (!authIsSignInWithEmailLink(window.location.href)) {
            console.log('Invalid Link !!')
            router.push('/send_email_link')
        }
    }, [currentUser]);

    return (
        <>
            <Header title='サインイン' />
            <main>
                <div className="flex-grow bg-bg-base pt-10 pb-32">
                    <div className="shadow-lg md:mx-24 mx-2 pt-20 pb-16 bg-white rounded-md flex flex-col items-center space-y-10">
                        <div className="flex flex-col items-center space-y-4">
                            <p className="text-text-default text-2xl font-bold" style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>メールアドレス認証</p>
                            <p className='text-text-default text-sm mx-6' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>確認のため、メールアドレスを再度入力してください。</p>
                        </div>
                        <TextField
                            style={{ width: 200 }}
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
                        {signInError &&
                            <p className='mx-2 text-sm text-red-400 mx-6' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>認証に失敗しました。恐れ入りますが、再度お試しください。</p>
                        }
                        <Button
                            variant="contained"
                            style={{ color: 'white', backgroundColor: '#00a6af' }}
                            disabled={email == '' || emailInputError}
                            onClick={signInWithEmailLink}
                        >
                            認証する
                        </Button>
                    </div>
                </div>

            </main>
        </>
    )
}