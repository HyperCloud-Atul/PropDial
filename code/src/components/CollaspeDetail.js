import React, { useState } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';

const CollaspeDetail = () => {
    const [openItemIndex, setOpenItemIndex] = useState(null);

    const handleAccordionItemClick = (index) => {
        setOpenItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <Accordion>
            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton onClick={() => handleAccordionItemClick(0)}>
                        What harsh truths do you prefer to ignore?
                    </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    <p>
                        Exercitation in fugiat est ut ad ea cupidatat ut in cupidatat
                        occaecat ut occaecat consequat est minim minim esse tempor
                        laborum consequat esse adipisicing eu reprehenderit enim.
                    </p>
                </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton onClick={() => handleAccordionItemClick(1)}>
                        Is free will real or just an illusion?
                    </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    <p>
                        In ad velit in ex nostrud dolore cupidatat consectetur ea in
                        ut nostrud velit in irure cillum tempor laboris sed adipisicing
                        eu esse duis nulla non.
                    </p>
                </AccordionItemPanel>
            </AccordionItem>
        </Accordion>
    );
};

export default CollaspeDetail;
