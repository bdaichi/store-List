import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import { db } from "../../service/firebase_service";
import Request from "../../entity/Request";
import Message from "../../entity/Message";

type Props = {
    request: Request
}

export default function RequestRoom(props: Props) {
    const { currentUser } = useContext(AuthContext)

    const [messages, setMessages] = useState<Message[]>([])

    async function fetchrequestRoomData() {
        try {
            db.collection('requests').doc(props.request.shopId).collection('messages').orderBy('createdAt', 'asc').onSnapshot(
                snapshot => {
                    if (snapshot.size) {
                        console.log('fetchMessageData!!')
                        setMessages(snapshot.docs.map((doc) => Message.fromJSON(doc.data())));
                    }
                }
            )
        } catch (e) {
            console.log('MyrequestConext listenMyrequest Error: ', e)
        }
    }

    useEffect(() => {
        fetchrequestRoomData()
    }, [props.request])

    return (
        <>{currentUser &&
            <div className='flex felx-col overscroll-y-auto'>
                <div className='absolute left-0 my-24 pb-56'>{messages.map((message) =>
                    <div key={message.messageId} className='mx-8 my-4 md:ml-96'>
                        <AccountCircleIcon style={{ width: 40, height: 40, color: '#006978' }} />
                        <p className='rounded-md p-2 my-2' style={{ color: '#00363a', borderWidth: 1, borderColor: '#006978', width: 'auto', maxWidth: 363, textTransform: 'none', }}>{message.message}</p>
                    </div>
                )}</div>
            </div >
        }</>
    )
}