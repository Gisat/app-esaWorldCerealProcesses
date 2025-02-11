import { ActionIcon, Button, Flex, Modal, Table, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronUp,
  IconDownload,
  IconPlayerPlay,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import "./style.css";

import ProcessStatus from "@features/(processes)/_components/ProcessStatus";
import useSWR from "swr";
import Details from "../Details";

const fetcher = (url: string) => {
  return fetch(`${url}`).then((r) => r.json());
};

type Props = {
  bbox?: Array<number>;
  costs?: number;
  createdIso?: Date;
  duration?: number;
  id?: string;
  type?: string;
  name?: string;
  oeoCollection?: string;
  resultFileFormat?: string;
  results?: Array<{ source_link: string }>;
  status?: string;
  timeRange?: Array<Date>;
  updatedIso?: Date;
  forceReloadList?: () => void;
};

const StartJobButton = ({
  jobId,
  forceReloadList,
}: {
  jobId?: string;
  forceReloadList?: () => void;
}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const url = `/api/jobs/start/${jobId}`;

  const { data, isLoading } = useSWR(shouldFetch ? [url] : null, () =>
    fetcher(url)
  );

  if (shouldFetch && data) {
    setShouldFetch(false);
  }

  if (data?.result?.jobId && forceReloadList) {
    setTimeout(() => {
      forceReloadList();
    }, 50);
  }

  function handleClick() {
    setShouldFetch(true);
  }

  return data?.result?.jobId ? null : (
    <Tooltip label="Start process" openDelay={500}>
      <ActionIcon
        size="lg"
        radius="xl"
        component="a"
        target="_blank"
        variant="subtle"
        onClick={handleClick}
        loading={isLoading}
      >
        <IconPlayerPlay size={16} color="var(--startColor)" />
      </ActionIcon>
    </Tooltip>
  );
};

type RemoveJobButtonProps = {
  oeoCollection?: string;
  resultFileFormat?: string;
  timeRange?: Array<Date>;
  bbox?: Array<number>;
  jobId?: string;
  forceReloadList?: () => void;
};

const RemoveJobButton = ({
  jobId,
  forceReloadList,
  bbox,
  timeRange,
  resultFileFormat,
  oeoCollection,
}: RemoveJobButtonProps) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const url = `/api/jobs/delete/${jobId}`;

  const { data, isLoading } = useSWR(shouldFetch ? [url] : null, () =>
    fetcher(url)
  );

  if (shouldFetch && data) {
    close();
    setShouldFetch(false);
  }

  if (data?.numberOfDeletedJobs && forceReloadList) {
    setTimeout(() => {
      forceReloadList();
    }, 50);
  }

  function handleClick() {
    setShouldFetch(true);
  }

  return (
    <>
      <Modal
        className="worldCereal-Modal"
        opened={opened}
        onClose={close}
        radius={0}
        closeOnClickOutside={true}
        withCloseButton={false}
        size={"xl"}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Details
          bbox={bbox}
          startDate={timeRange?.[0]}
          endDate={timeRange?.[1]}
          resultFileFormat={resultFileFormat}
          oeoCollection={oeoCollection}
        />
        <Flex
          mih={50}
          gap="lg"
          justify="flex-end"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          <Button
            className="worldCereal-Button is-secondary is-ghost"
            size="sm"
            component="a"
            target="_blank"
            onClick={close}
            variant="outline"
            disabled={isLoading}
          >
            Decline
          </Button>
          <Button
            className="worldCereal-Button"
            size="sm"
            component="a"
            target="_blank"
            onClick={handleClick}
            loading={isLoading}
          >
            Confirm delete
          </Button>
        </Flex>
      </Modal>

      <Tooltip label="Delete process" openDelay={500}>
        <ActionIcon
          size="lg"
          radius="xl"
          component="a"
          target="_blank"
          variant="subtle"
          onClick={open}
        >
          <IconTrash size={16} color="var(--deleteColor)" />
        </ActionIcon>
      </Tooltip>
    </>
  );
};

const Record = ({
  id,
  type,
  createdIso,
  status,
  results,
  bbox,
  timeRange,
  resultFileFormat,
  oeoCollection,
  forceReloadList,
}: // details
Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const className = `worldCereal-ProcessesTable-row${
    isExpanded ? " is-expanded" : ""
  }`;

  return (
    <>
      <Table.Tr key={id} className={className}>
        <Table.Td className="smallTextCell">{id}</Table.Td>
        <Table.Td className="highlightedCell">{type}</Table.Td>
        <Table.Td>
          {createdIso && new Date(createdIso).toLocaleString()}
        </Table.Td>
        <Table.Td>{status ? <ProcessStatus status={status} /> : null}</Table.Td>
        <Table.Td className="shrinkedCell alignRight">
          <RemoveJobButton
            jobId={id}
            forceReloadList={forceReloadList}
            bbox={bbox}
            timeRange={timeRange}
            resultFileFormat={resultFileFormat}
            oeoCollection={oeoCollection}
          />
          {status === "created" ? (
            <StartJobButton jobId={id} forceReloadList={forceReloadList} />
          ) : null}
          {results?.[0] ? (
            <Tooltip label="Go to downloads" openDelay={500}>
              <ActionIcon
                radius="lg"
                size="lg"
                variant="subtle"
                aria-label="Settings"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <IconDownload color="var(--textAccentedColor)" size={16} />
              </ActionIcon>
            </Tooltip>
          ) : null}
          <Tooltip label="Show details" openDelay={500}>
            <ActionIcon
              radius="lg"
              size="lg"
              variant="subtle"
              aria-label="Settings"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <IconChevronUp color="var(--iconPrimaryColor)" size={16} />
              ) : (
                <IconChevronDown color="var(--iconPrimaryColor)" size={16} />
              )}
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
      {isExpanded && (
        <Table.Tr className={className}>
          <Table.Td colSpan={7}>
            <Details
              bbox={bbox}
              startDate={timeRange?.[0]}
              endDate={timeRange?.[1]}
              resultFileFormat={resultFileFormat}
              oeoCollection={oeoCollection}
              results={results}
            />
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
};

export default Record;
