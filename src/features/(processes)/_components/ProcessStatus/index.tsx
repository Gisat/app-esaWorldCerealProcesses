import { Chip, rem } from '@mantine/core';
import { IconX, IconCheck, IconDots, IconChecks } from '@tabler/icons-react';
import './style.css';

type Props = {
    status: string
};

const ProcessStatus = ({ status }: Props) => {
    let color;
    let icon = null;
    switch (status) {
        case 'pending':
            color = "var(--base500)";
            icon = <IconDots style={{ width: rem(16), height: rem(16) }} />
            break;
        case 'error':
            color = "var(--errorColor)";
            icon = <IconX style={{ width: rem(16), height: rem(16) }} />
            break;
        case 'finished':
            color = "var(--successColor)";
            icon = <IconChecks style={{ width: rem(16), height: rem(16) }} />
            break;
        case 'created':
            color = "var(--base500)";
            icon = <IconCheck style={{ width: rem(16), height: rem(16) }} />
            break;
    }
    return <Chip className="worldCereal-ProcessStatus" defaultChecked color={color}
        variant="filled"
        icon={icon}
        size="sm">{status}</Chip>
}

export default ProcessStatus;