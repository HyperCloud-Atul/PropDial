
//Convert Amount to Words - Starts

import { useState } from "react";

const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function chunkToWords(chunk) {
    const hundredDigit = Math.floor(chunk / 100);
    const remainder = chunk % 100;

    let result = '';
    if (hundredDigit > 0) {
        result += `${units[hundredDigit]} hundred`;
    }

    if (remainder > 0) {
        if (result !== '') {
            result += ' and ';
        }

        if (remainder < 10) {
            result += units[remainder];
        } else if (remainder < 20) {
            result += teens[remainder - 10];
        } else {
            const tenDigit = Math.floor(remainder / 10);
            const oneDigit = remainder % 10;

            result += tens[tenDigit];
            if (oneDigit > 0) {
                result += `-${units[oneDigit]}`;
            }
        }
    }

    return result;
}

function indexToPlace(index) {
    const places = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];
    return places[index];
}
export const useCommon = () => {

    const [response, setResponseValue] = useState()

    // Function to format the phone number (add your own formatting logic)
    const formatPhoneNumber = async (number) => {
        // Example: Add dashes
        return number.replace(/(\d{2})(\d{5})(\d{5})/, '$1 - $2 - $3');
    }

    // Function to format the phone number (add your own formatting logic)
    const formatAmount = async (amount) => {
        // Example: Add dashes
        return amount.toLocaleString('en-US');
    }

    const camelCase = async (inputStr) => {
        let str = inputStr.toLowerCase();
        return (
            str
                .replace(/\s(.)/g, function (a) {
                    return a.toUpperCase();
                })
                // .replace(/\s/g, '')
                .replace(/^(.)/, function (b) {
                    return b.toUpperCase();
                })
        );
    }

    // Simple email validation regex
    const validateEmail = async (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };


    const amountToWords = async (amount) => {
        if (amount === 0) {
            return 'zero';
        }

        // Split the number into groups of three digits
        const chunks = [];
        while (amount > 0) {
            chunks.push(amount % 1000);
            amount = Math.floor(amount / 1000);
        }

        // Convert each chunk to words
        const chunkWords = chunks.map((chunk, index) => {
            if (chunk === 0) {
                return '';
            }

            const chunkText = chunkToWords(chunk);
            const suffix = index === 0 ? '' : ` ${indexToPlace(index)}`;
            return `${chunkText}${suffix}`;
        });

        // Combine the chunk words        
        return chunkWords.reverse().join(' ').trim();
    }

    return { formatPhoneNumber, formatAmount, camelCase, validateEmail, amountToWords, response }
}