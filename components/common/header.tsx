import Head from 'next/head'
import { appName } from "../../service/styles_service";

type Props = {
    title: string;
}

export default function Header(props: Props) {
    const title = `${appName} | ${props.title}`

    return (
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/logos/favicon.png" />
        </Head>
    )
}