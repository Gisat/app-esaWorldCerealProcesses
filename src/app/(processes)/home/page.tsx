"use client"

import React from 'react';
import { List } from '@mantine/core';
import { ContentContainer } from '@features/(shared)/_layout/_components/Content/ContentContainer';
import { SectionHeader } from '@features/(shared)/_layout/_components/Content/SectionHeader';
import { TextParagraph } from '@features/(shared)/_layout/_components/Content/TextParagraph';
import { TextHighlight } from '@features/(shared)/_layout/_components/Content/TextHighlight';
import { SectionContainer } from '@features/(shared)/_layout/_components/Content/SectionContainer';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';

const Home: React.FC = () => {
    return (
        <ContentContainer>
					<SectionContainer>
            <SectionHeader>Welcome to the WorldCereal Processing Hub!</SectionHeader>
            <TextParagraph>Use the different tabs on top to switch between different functionalities of the Hub.</TextParagraph>
						<List>
							<List.Item>
								<TextParagraph>
									<TextHighlight bold>Download official products:</TextHighlight>
									{" "}WorldCereal publishes several official, <TextLink url='https://esa-worldcereal.org/en/products/global-maps'>global products</TextLink>. Here you can easily download one or multiple of these products for your area of interest.
								</TextParagraph>	
							</List.Item>
							<List.Item>
								<TextParagraph>
									<TextHighlight bold>Generate custom products:</TextHighlight>
									{" "}Generate a cropland mask for your area and season of interest using the default WorldCereal cropland model.
								</TextParagraph>	
							</List.Item>
							<List.Item>
								<TextParagraph>
									<TextHighlight bold>Your processes:</TextHighlight>
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
							<TextLink url='https://worldcereal.github.io/worldcereal-documentation/processing/usage_cloud.html'>WorldCereal documentation portal</TextLink><br />
							<TextLink url='https://openeo.org/'>OpenEO documentation on CDSE</TextLink> <br />
							<TextLink url=''>WorldCereal forum</TextLink>
						</TextParagraph>
					</SectionContainer>
					<SectionContainer>
            <SectionHeader>WorldCereal offical products values description</SectionHeader>
						<List>
							<List.Item>
								value 0 represents the &quot;negative class&quot; (e.g. no-cropland in temporarycrops product, not maize in maize product).
							</List.Item>
							<List.Item>
								value 100 represents the &quot;positive class&quot;. (e.g. active in activecropland product, irrigated in irrigation product).
							</List.Item>
							<List.Item>
								value 254 represents &quot;no cropland&quot; class in seasonal products
							</List.Item>
							<List.Item>
								value 255 is the no-data value
							</List.Item>
						</List>
					</SectionContainer>
        </ContentContainer>
    );
};

export default Home;