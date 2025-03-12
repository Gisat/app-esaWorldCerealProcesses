"use client"

import React from 'react';
import { List } from '@mantine/core';
import { ContentContainer } from '@features/(shared)/_layout/_components/Content/ContentContainer';
import { SectionHeader } from '@features/(shared)/_layout/_components/Content/SectionHeader';
import { TextParagraph } from '@features/(shared)/_layout/_components/Content/TextParagraph';
import { TextHighlight } from '@features/(shared)/_layout/_components/Content/TextHighlight';
import { SectionContainer } from '@features/(shared)/_layout/_components/Content/SectionContainer';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';
import { pages } from "@features/(processes)/_constants/app";
import Link from "next/link";

const Home: React.FC = () => {
    return (
        <ContentContainer>
					<SectionContainer>
            <SectionHeader>Welcome to the WorldCereal Processing Hub!</SectionHeader>
            <TextParagraph>Use the different tabs on top to switch between different functionalities of the Hub.</TextParagraph>
						<List>
							<List.Item>
								<TextParagraph>
									<Link href={pages.downloadOfficialProducts.url}>
										<TextHighlight bold>Download official products:</TextHighlight>
									</Link>
									{" "}WorldCereal publishes several official, <TextLink url='https://esa-worldcereal.org/en/products/global-maps'>global products</TextLink>. Here you can easily download one or multiple of these products for your area of interest.
								</TextParagraph>	
							</List.Item>
							<List.Item>
								<TextParagraph>
									<Link href={pages.generateCustomProducts.url}>
										<TextHighlight bold>Generate custom products:</TextHighlight>
									</Link>
									{" "}Generate a cropland mask for your area and season of interest using the default WorldCereal cropland model.
								</TextParagraph>	
							</List.Item>
							<List.Item>
								<TextParagraph>
									<Link href={pages.processesList.url}>
										<TextHighlight bold>Your processes:</TextHighlight>
									</Link>
									{" "}Get an overview of the status of all your OpenEO processing jobs and download the resulting maps here.
								</TextParagraph>	
							</List.Item>
						</List>
					</SectionContainer>
					<SectionContainer>
						<SectionHeader>About Processing Hub</SectionHeader>
						<TextParagraph>
							This application allows you to launch, monitor and download the result of WorldCereal processing jobs on the <TextLink url="https://dataspace.copernicus.eu/">Copernicus Data Space Ecosystem</TextLink> (CDSE).
						</TextParagraph>	
						<TextParagraph>
							We support two types of processes: <br />
							Download an official WorldCereal product for your area of interest <br />
							Generate a customized cropland product for your area and season of interest
						</TextParagraph>
						<TextParagraph>
							WorldCereal uses <TextLink url='https://openeo.org/' color='var(--text-color)'>openEO</TextLink> as processing standard for all cloud-based processing.
						</TextParagraph>
						<TextParagraph>
							Need more information or help? Consult the following resources: <br />
							<TextLink url='https://worldcereal.github.io/worldcereal-documentation/vdm/launch.html'>WorldCereal documentation portal</TextLink><br />
							<TextLink url='https://documentation.dataspace.copernicus.eu/APIs/openEO/openEO.html'>OpenEO documentation on CDSE</TextLink> <br />
							<TextLink url='https://forum.esa-worldcereal.org/t/worldcereal-processing-hub/63'>WorldCereal forum</TextLink>
						</TextParagraph>
					</SectionContainer>
        </ContentContainer>
    );
};

export default Home;