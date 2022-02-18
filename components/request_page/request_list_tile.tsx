import Request from "../../entity/Request";

type Props = {
    request: Request
}

export default function RequestListTile(props: Props) {

    return (
        <>
            <div className='p-4 rounded-md' style={{ borderWidth: 1, borderColor: '#00a6af', width: 250, }}>
                <p className='text-xl' style={{ color: '#00363a', textTransform: 'none', }}>{props.request.requestName}</p>
                <p className='text-base border-t pt-2' style={{ color: '#006978', borderColor: '#00363a', textTransform: 'none', }}>{props.request.latestMessage}</p>
            </div>
        </>
    )
}