import React, { useEffect, useRef } from "react";
import jsBarcode from 'jsbarcode';

const Barcode = ({
    value,
    format,
    width,
    height,
    displayValue = true,
    text,
    fontOptions,
    font,
    textAlign,
    textPosition,
    textMargin,
    fontSize,
    background,
    lineColor,
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    flat,
    ean128,
    elementTag = 'svg',
}) => {
    const barcodeRef = useRef(null);

    useEffect (() => {
        const settings = {
            value,
            format,
            width,
            height,
            displayValue,
            text,
            fontOptions,
            font,
            textAlign,
            textPosition,
            textMargin,
            fontSize,
            background,
            lineColor,
            margin,
            marginTop,
            marginBottom,
            marginLeft,
            marginRight,
            flat,
            ean128,
            valid: (valid) => {

            },
            elementTag,
        };

        removeUndefinedProps(settings);
        jsBarcode(barcodeRef.current, value, settings);
    }, [value, format, width, height, displayValue, text, fontOptions, font, textAlign, textPosition, textMargin, fontSize, background, lineColor, margin, marginTop, marginBottom, marginLeft, marginRight, flat, ean128, elementTag]);
    
    const removeUndefinedProps = (obj) => {
        Object.keys(obj).forEach(key =>{
            if (obj[key] == undefined) {
                delete obj[key];
            }
        });
    };
    return React.createElement(elementTag, { ref: barcodeRef });
};

export default Barcode;