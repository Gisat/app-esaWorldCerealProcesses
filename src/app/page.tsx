"use client";

import Link from "next/link";
import {Button, Flex, List, Text} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useUserInfoFromIdentity } from "@features/(shared)/_hooks/user.useUserInfoFromIdentity";
import PageLoader from "@features/(shared)/_components/PageLoader";
import { ContentContainer } from "@features/(shared)/_layout/_components/Content/ContentContainer";
import { SectionHeader } from "@features/(shared)/_layout/_components/Content/SectionHeader";
import { TextParagraph } from "@features/(shared)/_layout/_components/Content/TextParagraph";
import { TextLink } from "@features/(shared)/_layout/_components/Content/TextLink";
import { SectionContainer } from "@features/(shared)/_layout/_components/Content/SectionContainer";

export default function Home() {

  const { isLoading, userInfoValue } = useUserInfoFromIdentity("api/auth/user-info")

  if (isLoading)
    return (
      <PageLoader />
    )

  return (
    <Flex direction="column" className="worldCereal-Home">
      {
        (!userInfoValue || !userInfoValue.email) ?
            <ContentContainer>
							<SectionHeader>Welcome to the WorldCereal Processing Hub!</SectionHeader>
							<SectionContainer>
								<TextParagraph>
									This application allows you to launch, monitor and download the result of WorldCereal processing jobs on the <TextLink url='https://dataspace.copernicus.eu/'>Copernicus Data Space Ecosystem</TextLink> (CDSE).
								</TextParagraph>
							</SectionContainer>
							<SectionContainer>
								<Text>We support two types of processes:</Text>
								<List>
									<List.Item>
										Download an official WorldCereal product for your area of interest	
									</List.Item>
									<List.Item>
										Generate a customized cropland product for your area and season of interest
									</List.Item>
								</List>
							</SectionContainer>
							<SectionContainer>
								<TextParagraph>
									WorldCereal uses <TextLink url='https://openeo.org/' color="var(--textPrimaryColor)">openEO</TextLink> as processing standard for all cloud-based processing.
								</TextParagraph>
							</SectionContainer>
							<SectionContainer>
								<Text>Need more information or help? Consult the following resources:</Text>
								<List>
									<List.Item>
										<TextLink url='https://worldcereal.github.io/worldcereal-documentation/processing/usage_cloud.html'>WorldCereal documentation portal</TextLink>
									</List.Item>
									<List.Item>
											<TextLink url='https://documentation.dataspace.copernicus.eu/APIs/openEO/openeo_deployment.html'>OpenEO documentation on CDSE</TextLink>
									</List.Item>
									<List.Item>
											<TextLink url=''>WorldCereal forum</TextLink>
									</List.Item>
								</List>
							</SectionContainer>
							<SectionContainer>
								<TextParagraph>
									This application requires logging in with your CDSE account. Don’t have an account yet? Register{" "}
									<TextLink url='https://dataspace.copernicus.eu/'>here</TextLink> (free)!
								</TextParagraph>
							</SectionContainer>
              {/* <Link href="/account/login" ><Button>Login</Button></Link> */}
              <Link href="/api/auth/iam">
								<Button
									className="worldCereal-Button"
									autoContrast
									leftSection={<IconUser size={18}/>}
									size="xl"
								>
									<Text fz={16} fw={"bold"}>Login</Text>
								</Button>
							</Link>
            </ContentContainer>
            : null
      }
    </Flex>
  );
}
