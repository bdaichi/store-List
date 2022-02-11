import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Button, Divider, Drawer, IconButton, Typography } from '@material-ui/core';
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MenuIcon from '@material-ui/icons/Menu';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';

import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext";
import { db } from "../service/firebase_service";
import Header from '../components/common/header';
import Request from "../entity/Request";
import RequestRoom from '../components/request_page/request_room';
import RequestListTile from '../components/request_page/request_list_tile';
import NavBar from '../components/common/nav_bar';
import { theme } from '../service/styles_service';

export default function RequestPage() {
    const { currentUser } = useContext(AuthContext)


    const [requests, setRequests] = useState<Request[] | null>(null)
    const [openRequest, setOpenrequest] = useState<Request | null>(null)
    const [open, setOpen] = useState(false);
    const [isOpenNavBar, setIsOpenNavBar] = useState(false)

    const fetchrequests = async () => {
        if (!currentUser) {
            console.log('Not LoggedIn !!')
            return
        }
        try {
            db.collection('requests').where('createUserId', '==', currentUser.userId).orderBy('upDatedAt', 'desc').onSnapshot(
                snapshot => {
                    console.log('MyrequestConext listenMyrequest')
                    if (snapshot.size) {
                        setRequests(snapshot.docs.map((doc) => Request.fromJSON(doc.data())));
                        console.log('fetch data')
                    } else {
                        console.log('No data!')
                        setRequests(null)
                    }
                }
            )
        } catch (e) {
            console.log('MyrequestConext listenMyrequest Error: ', e)
        }
    }

    const openrequestRoom = async (request: Request) => {
        try {
            console.log('openrequestRoom')
            setOpenrequest(request)
        } catch (e) {
            console.log('openrequestRoom Error: ', e)
        }
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const openNavBar = () => {
        if (isOpenNavBar) {
            setIsOpenNavBar(false)
        } else {
            setIsOpenNavBar(true)
        }
    }

    const closeNavBar = () => {
        setIsOpenNavBar(false)
    }

    useEffect(() => {
        fetchrequests()
    }, [currentUser])

    return (
        <>
            <Header title='依頼ページ' />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <div className='fixed top-0 z-20' style={{ backgroundColor: !isOpenNavBar ? '' : 'white', height: !isOpenNavBar ? 0 : 100, width: !isOpenNavBar ? 0 : '100%', minWidth: !isOpenNavBar ? 0 : 410, maxWidth: !isOpenNavBar ? 0 : 1000, }}>{isOpenNavBar &&
                    <div className='z-30 md:z-50'>
                        <IconButton onClick={closeNavBar} style={{ width: 60, height: 30, }}>
                            <ExpandLessIcon style={{ width: 40, height: 40, color: '#00a6af' }} />
                        </IconButton>
                        <NavBar />
                    </div>
                }</div>
                <AppBar
                    className='z-10'
                    position="fixed"
                >
                    <Toolbar>
                        <IconButton
                            className='md:hidden ... z-10'
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon style={{ height: 40, width: 40, color: '#00a6af' }} />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div>
                    {open == true ?
                        <Drawer
                            className='grid z-10 md:w-64'
                            variant="permanent"
                            anchor="left"
                            open={open}
                        >
                            <div className='z-10'>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'ltr' ? <ChevronLeftIcon style={{ width: 40, height: 40, color: '#00a6af' }} /> : <ChevronRightIcon />}
                                </IconButton>
                                <IconButton onClick={openNavBar} style={{ width: 60, }}>
                                    <MenuIcon style={{ width: 40, height: 40, color: '#00a6af', }} />
                                </IconButton>
                            </div>
                            <Divider />
                            <List>
                                {!requests ?
                                    <div className='mt-24 mx-8'>
                                        <p style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>メッセージはありません</p>
                                    </div>
                                    :
                                    <div className='my-8 px-4 z-10'>{requests.map((request) =>
                                        <div key={request.shopId}>
                                            <Button onClick={() => openrequestRoom(request)} >
                                                <RequestListTile request={request} />
                                            </Button>
                                        </div>
                                    )}</div>
                                }
                            </List>
                        </Drawer>
                        :
                        <div className='z-10'>
                            <Drawer
                                className='hidden z-10 md:grid md:z-10'
                                variant="permanent"
                                anchor="left"
                                open={open}
                            >
                                <Divider />
                                <List className='z-10'>
                                    <div className='z-10'>
                                        <IconButton onClick={openNavBar} style={{ width: 120, height: 80, }} >
                                            <MenuIcon style={{ width: 50, height: 50, color: '#00a6af' }} />
                                        </IconButton>
                                    </div>
                                    {!requests ?
                                        <div className='mt-24 mx-8'>
                                            <p style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>メッセージはありません</p>
                                        </div>
                                        :
                                        <div className='px-6'>{requests.map((request) =>
                                            <div key={request.shopId} className='py-4'>
                                                <Button onClick={() => openrequestRoom(request)}>
                                                    <RequestListTile request={request} />
                                                </Button>
                                            </div>
                                        )}</div>
                                    }
                                </List>
                            </Drawer>
                        </div>
                    }
                </div>
                <div className="z-0" >
                    {openRequest ?
                        <div className="">
                            <RequestRoom request={openRequest} />
                        </div>
                        :
                        <div className='ml-24 mt-72 text-xl md:ml-96'>
                            <h1 style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>お店を選んでください</h1>
                        </div>
                    }
                </div>
            </Box>

        </>
    )

}