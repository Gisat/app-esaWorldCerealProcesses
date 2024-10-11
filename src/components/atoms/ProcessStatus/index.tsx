import {Chip, rem} from '@mantine/core';
import { IconX, IconCheck, IconDots } from '@tabler/icons-react';
import './style.scss';

type Props = {
    status: string
};

const ProcessStatus = ({status}: Props) => {
    let color;
    let icon = null;
    switch (status) {
        case 'pending':
            color = "#6c6c6c";
            icon = <IconDots style={{width: rem(16), height: rem(16)}}/>
            break;
        case 'failed':
            color = "#8c2e2e";
            icon = <IconX style={{width: rem(16), height: rem(16)}}/>
            break;
        case 'done':
            color = "#327c4f";
            icon = <IconCheck style={{width: rem(16), height: rem(16)}}/>
            break;
    }
    return <Chip className="worldCereal-ProcessStatus" defaultChecked color={color}
                 variant="filled"
                 icon={icon}
                 size="sm">{status}</Chip>
}

export default ProcessStatus;