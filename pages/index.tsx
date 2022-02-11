import type { NextPage } from 'next'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/shop_list_page')
  })

  return (
    <></>
  )
}

export default Home
