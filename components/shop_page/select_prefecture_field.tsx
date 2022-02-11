import * as React from 'react';
import { ChangeEvent } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

type Props = {
    id: string,
    name: string,
    value: string,
    options: string[],
    onChange: (e: ChangeEvent<{}>, options: string | null) => void
}

export default function SelectPrefectureFeild(props: Props) {
    return (
        <Autocomplete
            id={props.id}
            value={props.value}
            disableClearable={true}
            onChange={(e, value) => props.onChange(e, value)}
            options={props.options}
            getOptionLabel={(option) => option}
            style={{ width: "120%", height: '20%', textAlignLast: 'center', }}
            multiple={false}
            noOptionsText={`指定した${props.name}が見つかりません`}
            renderInput={(params) =>
                <TextField
                    style={{ fontFamily: '筑紫A丸ゴシック' }}
                    {...params}
                    label={props.name}
                    variant="outlined"
                    className="bg-white"
                />
            }
        />
    )
}