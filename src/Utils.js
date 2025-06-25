/* global chrome */

import React from "react";
import { renderToStaticMarkup } from 'react-dom/server';


// 클립보드 데이터 파싱
// 클립보드에 스트링으로 저장 됨 
export const parsingClipboard = async () => {
    try {
        const clipboardContents = await navigator.clipboard.read();
        for (const item of clipboardContents) {
            for (const itemType of item.types) {
                if (itemType === "image/png") {
                    console.log('image/png')
                    const pngImage = new Image(); // Image constructor
                    pngImage.src = "image1.png";
                    pngImage.alt = "PNG image from clipboard";
                    const blob = await item.getType("image/png");
                    pngImage.src = URL.createObjectURL(blob);
                    console.log(pngImage);
                } else if (itemType === "text/html") {
                    console.log('text/html')
                    const blob = await item.getType("text/html");
                    const blobText = await blob.text();
                    await navigator.clipboard.writeText(blobText);
                    console.log(blobText);
                } else if (itemType === "text/plain") {
                    console.log('text/plain')
                    const blob = await item.getType("text/plain");
                    const blobText = await blob.text();
                    console.log(blobText);
                } else {
                    throw new Error(`${itemType} not supported.`);
                }
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};

// 클립보드에 있는 텍스트를 다시 변환하기 


// html, text 클립보드에 저장
export const parsingDataSetClipboard = async (blobText) => {
    const type = 'text/html';
    const blob = new Blob([blobText], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(data);
}

// 이미지 클립보드에 저장
export const parsingImgSetClipboard = async (img) => {
    const response = await fetch(process.env.PUBLIC_URL + img); // 이미지를 fetch
    const blob = await response.blob(); // blob으로 변환
    const data = [new ClipboardItem({ [blob.type]: blob })];
    await navigator.clipboard.write(data);
}

// 검증후 통과되면 클립보드 저장 후 리턴
export const validateParsingClipboardToText = async (showSnackbar) => {


    // 있어야할 class
    const isRequiredInvalid = el => {
        console.log(el)
        if (!el || el.length === 0) {
            showSnackbar({ show: true, message: '상단 삽입탭 - 도형 만 가능합니다.' })
            return true;
        }
        if (el.length > 1) {
            showSnackbar({ show: true, message: '하나의 도형 만 가능합니다.' })
            return true;
        }
        return false;

    }

    // 있으면 안돼는 class
    const isNotAllowedPresent = el => {
        if (el && el.length > 0) {
            showSnackbar({ show: true, message: '상단 삽입탭 - 도형 만 가능합니다.' })
            return true;
        }
        return false;
    }

    try {
        const clipboardContents = await navigator.clipboard.read();

        // 클립보드에 값이 없으시 
        if (!clipboardContents) {
            showSnackbar({ show: true, message: '삽입탭 - 도형을 복사해 주세요.' })
            return false;
        }
        // 클립보드에 값이 여러개 있으시 (혹시 몰라서)
        if (clipboardContents.length > 1) {
            showSnackbar({ show: true, message: '클립보드가 여러개 입니다. 하나만 복사해주세요.' })
            return false;
        }


        for (const item of clipboardContents) {

            const data = item.types.filter(type => type === "text/html")

            if (data.length !== 1) {
                showSnackbar({ show: true, message: '삽입탭 - 도형을 복사해 주세요.' })
                return false;
            }

            // 1. ClipboardItem에서 HTML Blob을 가져오기
            const blob = await item.getType("text/html");

            // 2. Blob을 텍스트(HTML 문자열)로 변환
            const htmlString = await blob.text();

            const htmlStringRemoveMeta = htmlString
                .replace(/<meta\s+charset=["'][^"']+["']\s*\/?>/gi, "")
                .replace(/<br\b[^>]*>(?:<\/br>)?/gi, '<br>');

            console.log(htmlStringRemoveMeta)

            // 3. DOMParser로 문자열을 문서 객체로 파싱
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlStringRemoveMeta, "text/html");
            if (
                isRequiredInvalid(doc.getElementsByClassName("slide_object")) ||
                isRequiredInvalid(doc.getElementsByClassName("dze_shape_main")) ||
                isRequiredInvalid(doc.getElementsByClassName("dze_shape_svg")) ||

                isNotAllowedPresent(doc.getElementsByClassName("dze_shape_placeholder")) ||
                isNotAllowedPresent(doc.getElementsByClassName("dze_table")) ||
                isNotAllowedPresent(doc.getElementsByClassName("text_holder")) ||
                isNotAllowedPresent(doc.getElementsByClassName("object_holder")) ||
                isNotAllowedPresent(doc.getElementsByClassName("highcharts-container "))
            ) {
                return false;
            }

            const svg = doc.querySelector("svg");

            svg.removeAttribute("width");
            svg.removeAttribute("height");

            return { displayValue: svg.outerHTML, value: htmlStringRemoveMeta }
        }
    } catch (error) {
        console.log(error.message);
    }
};

// 스트링 html 파서 
export const parseHtmlString = (elStr) => {
    console.log(elStr)

    const elements = [];

    const elStringList = elStr.split(/(?=<)/);

    let depth = 0;
    // 2차 배열로 변환해서 해당 트리구조 바꿔주기 
    //   r --------------- ㄱ
    //   | 순번 | 데이터 | ...|
    //   |  0  | {..} | ...|
    //   |  4  | {..} | ...|  
    //   |  6  | {..} | ...|
    //   ㄴ ----------------J
    //  이와 같은 배열이 만들어지고  해당순번은 child 데이터를 분석하는 시점의 순번이다.
    for (let i = 0; i < elStringList.length; i++) {
        //  계산 시점에 가르키는 sq
        // 위치:#1 에서 else인경우에만 sq값은 없으므로 0 처리
        const sq = elements?.[depth]?.[0] || 0;
        // 
        const str = elStringList[i];

        // tag네임 구하기 
        const m = str.match(/^<\s*\/?\s*([^\s/>]+)/);
        const tagNm = m[1];

        if (str.startsWith('</')) {
            depth--;
            elements[depth][0]++;
            continue;
        }

        // 1) 동적으로 태그 이름을 넣어 정규식 생성
        const regex = new RegExp(`<${tagNm}\\s+([^>]+)>`, 'i');
        // 2) 실제 문자열에서 여는 태그와 속성 문자열 추출
        const openTagMatch = str.match(regex);

        const attrString = openTagMatch ? openTagMatch[1] : '';

        //  class id 삭제 스타일속성 widht와 height삭제,
        const attrs = (() => {

            const attr = (() => {
                const data = parseAttributes(attrString);
                if (data.style) {
                    const entries = Object.entries(parseStyleString(data.style));
                    // const filterEntries = entries.filter(([key, value]) => !(['width', 'height'].includes(key)));
                    data.style = Object.fromEntries(entries);
                }
                // svg 가운데 중앙정렬 속성 넣어주기 
                if (tagNm === 'svg') data.preserveAspectRatio = "xMidYMid meet"
                return data
            })()
            console.log(attr)

            const entries = Object.entries(attr);
            const filterEntries = entries.filter(([key, value]) => tagNm === 'marker' || !(['id', 'class'].includes(key)));
            return Object.fromEntries(filterEntries);
        })() || {};

        console.log(attrs)

        // 부모 sq 
        const parents = depth > 0 ? elements[depth - 1][0] : null

        // 해당 리스트가 존재하면 위치:#1
        if (elements[depth] instanceof Array) {
            elements[depth][sq] = { tagNm, parents, attrs }
        }
        else {
            // index 0은 계산 시점에 가르키는 sq
            elements[depth] = [1, { tagNm, parents, attrs }]
        }

        if (tagNm === 'br' || str.endsWith('/>')) {
            elements[depth][0]++;
            continue;
        }

        depth++;
    }

    // createElement 해주기 

    console.log(elements)

    // 인덱스별로 child정보를 저장용
    let childList = []
    for (let i = elements.length - 1; i >= 0; i--) {
        let targetList = elements[i]
        childList[i] = [];
        for (let j = 0; j < targetList.length; j++) {

            const target = targetList[j];

            if (target.parents) {

                const targetChild = (() => {
                    if (i === elements.length - 1) return null;
                    // 여기서 j는 child에서 parents에 넣어놓은 인덱스 
                    return childList[i + 1][j]
                })()

                if (childList[i][target.parents] instanceof Array) {
                    childList[i][target.parents].push(React.createElement(target.tagNm, { ...target.attrs }, targetChild))
                }
                else {
                    childList[i][target.parents] = [React.createElement(target.tagNm, { ...target.attrs }, targetChild)]
                }
            }
        }
    }

    console.log(childList)
    console.log(elements)
    console.log(renderToStaticMarkup(React.createElement(elements[0][1].tagNm, { ...elements[0][1].attrs }, childList[1][1])))
    return React.createElement(elements[0][1].tagNm, { ...elements[0][1].attrs }, childList[1][1])
}

// 태그 속성파서 
const parseAttributes = (attrString) => {
    const result = {}
    const attrRegex = /([^\s=]+)\s*=\s*"([^"]*)"/g;
    let m2;
    while ((m2 = attrRegex.exec(attrString))) {
        const [, name, value] = m2;
        result[name] = value;
    }
    return result
}

// 태그의 속성에 style 파서
const parseStyleString = styleString => {
    return styleString
        .replace(/&quot;/g, '"')
        .split(';')                       // ["width: 116.667px", " height: 113.333px", ""]
        .map(s => s.trim())               // ["width: 116.667px", "height: 113.333px", ""]
        .filter(e => e)                  // 마지막 빈 문자열 제거
        .reduce((obj, rule) => {
            const [prop, val] = rule.split(':').map(s => s.trim());
            // kebab-case → camelCase
            const jsProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

            // 숫자(px 단위)면 숫자로 변환, 아니면 원래 문자열
            const numMatch = /^(\d+(\.\d+)?)(px)?$/.exec(val);
            obj[jsProp] = numMatch
                ? parseFloat(numMatch[1])
                : val;

            return obj;
        }, {});
}


// 도형의 키를 시간으로 저장 
export const getCurrentDateTimeNumberString = () => {
    const d = new Date();
    // padStart(2, '0')로 항상 2자리 보장
    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
}


export const searchItem = async () => {
    const { item } = await chrome.storage.local.get(['item']);
    return item || [];
}

export const saveItem = async (newItem) => {
    const { item } = await chrome.storage.local.get(['item']);

    const newData = [...(item || []), newItem];
    await chrome.storage.local.set({ item: newData });
}

export const deleteItem = async (key) => {
    const { item } = await chrome.storage.local.get(['item']);

    const newData = (item || []).filter(item => item.key !== key);
    await chrome.storage.local.set({ item: newData });
}

