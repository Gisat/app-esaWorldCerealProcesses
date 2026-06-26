import { Chip, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import './style.css';
import {Statuses} from "@features/(shared)/_logic/models.statuses";

type Props = {
    status: string
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ProcessStatus = ({ status }: Props) => {
    let color;
    let icon = null;
    switch (status) {
        case Statuses.pending:
            color = "var(--base500)";
            break;
        case Statuses.error:
            color = "var(--errorColor)";
            break;
        case Statuses.done:
            color = "var(--successColor)";
            icon = <IconCheck style={{ width: rem(16), height: rem(16) }} />
            break;
        case Statuses.created:
            color = "var(--base500)";
            break;
    }

    const label = status === Statuses.error ? 'Failed' : status === Statuses.done ? 'Done' : capitalize(status);

    return <Chip className="worldCereal-ProcessStatus" defaultChecked color={color}
        variant="filled"
        icon={icon}
        size="sm">{label}</Chip>
}

export default ProcessStatus;
