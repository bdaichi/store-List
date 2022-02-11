import { auth } from "../service/firebase_service";
import 'firebase/auth'

import { createContext, FC, useEffect, useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

import { fetchUser, fetchUserOrCreateUserIfFirst } from "../service/user_service";
import User from "../entity/User";

type AuthContextProps = {
    currentUser: User | null
    reloadCurrentUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
    currentUser: null,
    reloadCurrentUserData: () => { throw new Error('Disabled reloadCurrentUserData() on AuthContext') },
});


const AuthProvider: FC = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    async function reloadCurrentUserData() {
        if (currentUser != null) {
            setCurrentUser(await fetchUser(currentUser.userId))
            console.log('AuthContext reloadCurrentUserData ! !')
        } else {
            console.log('AuthContext reloadCurrentUserData null')
        }
    }

    useEffect(() => {

        auth.onAuthStateChanged(async (user) => {
            if (user != null) {
                try {
                    console.log('userId>>>>', user.uid)
                    setCurrentUser(await fetchUserOrCreateUserIfFirst(user.uid))
                    console.log('onAuthstateChanged fetchUser!!')
                } catch (e) {
                    if (e === 'No User') {
                        console.log('Sign Out because No user');
                        auth.signOut();
                    }
                }
            } else {
                setCurrentUser(null)
                console.log('onAuthstateChanged user null')
            }
        })
    }, []);
    return (
        <AuthContext.Provider value={{ currentUser: currentUser, reloadCurrentUserData: reloadCurrentUserData, }}>
            {currentUser == null || (currentUser != null)
                ? children
                : <div><CircularProgress color="primary" /></div>
            }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }