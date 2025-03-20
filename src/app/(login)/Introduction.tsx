"use client";

import PageLoader from "@features/(shared)/_components/PageLoader";
import { ContentContainer } from "@features/(shared)/_layout/_components/Content/ContentContainer";
import { SectionContainer } from "@features/(shared)/_layout/_components/Content/SectionContainer";
import { SectionHeader } from "@features/(shared)/_layout/_components/Content/SectionHeader";
import { TextLink } from "@features/(shared)/_layout/_components/Content/TextLink";
import { TextParagraph } from "@features/(shared)/_layout/_components/Content/TextParagraph";
import { swrFetcher } from "@features/(shared)/_logic/utils";
import { Button, Flex, List, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
import useSWR from "swr";

/**
 * Introduction component for the WorldCereal Processing Hub.
 * 
 * This component renders the welcome page for the application. It displays information
 * about the WorldCereal Processing Hub, its capabilities, and resources for users.
 * 
 * The component uses SWR to fetch user information and conditionally renders content:
 * - Shows a loading indicator while fetching user data
 * - If user is not logged in (no email), shows the welcome content with information about:
 *   - The application's purpose for launching and monitoring WorldCereal processing jobs
 *   - Types of processes supported
 *   - Information about using openEO as processing standard
 *   - Links to additional resources
 *   - CDSE login instructions
 * - If user is logged in, renders nothing (empty flex container)
 * 
 * @returns {JSX.Element} The Introduction component
 */
export default function Introduction() {

  const { data: userInfoValue, isLoading } = useSWR("/api/auth/user-info", swrFetcher);

  if (isLoading) return <PageLoader />;

  return (
    <Flex direction="column" className="worldCereal-Home">
      {!userInfoValue || !userInfoValue.email ? (
        <ContentContainer>
          <SectionHeader>
            Welcome to the WorldCereal Processing Hub!
          </SectionHeader>
          <SectionContainer>
            <TextParagraph>
              This application allows you to launch, monitor and download the
              result of WorldCereal processing jobs on the{" "}
              <TextLink url="https://dataspace.copernicus.eu/">
                Copernicus Data Space Ecosystem
              </TextLink>{" "}
              (CDSE).
            </TextParagraph>
          </SectionContainer>
          <SectionContainer>
            <Text>We support two types of processes:</Text>
            <List>
              <List.Item>
                Download an official WorldCereal product for your area of
                interest
              </List.Item>
              <List.Item>
                Generate a customized cropland product for your area and season
                of interest
              </List.Item>
            </List>
          </SectionContainer>
          <SectionContainer>
            <TextParagraph>
              WorldCereal uses{" "}
              <TextLink
                url="https://openeo.org/"
                color="var(--textPrimaryColor)"
              >
                openEO
              </TextLink>{" "}
              as processing standard for all cloud-based processing.
            </TextParagraph>
          </SectionContainer>
          <SectionContainer>
            <Text>
              Need more information or help? Consult the following resources:
            </Text>
            <List>
              <List.Item>
                <TextLink url="https://worldcereal.github.io/worldcereal-documentation/processing/usage_cloud.html">
                  WorldCereal documentation portal
                </TextLink>
              </List.Item>
              <List.Item>
                <TextLink url="https://documentation.dataspace.copernicus.eu/APIs/openEO/openeo_deployment.html">
                  OpenEO documentation on CDSE
                </TextLink>
              </List.Item>
              <List.Item>
                <TextLink url="https://forum.esa-worldcereal.org/t/worldcereal-processing-hub/63">WorldCereal forum</TextLink>
              </List.Item>
            </List>
          </SectionContainer>
          <SectionContainer>
            <TextParagraph>
              This application requires logging in with your CDSE account. Don’t
              have an account yet? Register{" "}
              <TextLink url="https://dataspace.copernicus.eu/">here</TextLink>{" "}
              (free)!
            </TextParagraph>
          </SectionContainer>
          {/* <Link href="/account/login" ><Button>Login</Button></Link> */}
          <Link href="/api/auth/iam">
            <Button
              className="worldCereal-Button"
              autoContrast
              leftSection={<IconUser size={18} />}
              size="xl"
            >
              <Text fz={16} fw={"bold"}>
                Login
              </Text>
            </Button>
          </Link>
        </ContentContainer>
      ) : null}
    </Flex>
  );
}
