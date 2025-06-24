

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
export const parsingDataSetClipboard = async (blobText, blobtype) => {
    const type = blobtype;
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

            parseHtmlString(htmlStringRemoveMeta)

            // 3. DOMParser로 문자열을 문서 객체로 파싱
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");
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

            return { type: '1', value: svg.outerHTML }
        }
    } catch (error) {
        console.log(error.message);
    }
};

// 스트링 html 파서 
export const parseHtmlString = (elStr) => {

    const elements = [];

    const elStringList = elStr.split(/(?=<)/);
    console.log(elStringList)

    let depth = 0;

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

        // 부모 sq 
        const parents = depth > 0 ? elements[depth - 1][0] : null;

        // 부모값 업데이트 
        if (depth > 0) {
            elements[depth - 1][parents].hasChild = true;
        }

        // 해당 리스트가 존재하면 위치:#1
        if (elements[depth] instanceof Array) {
            elements[depth][sq] = { tagNm, hasChild: false, parents }
        }
        else {
            // index 0은 계산 시점에 가르키는 sq
            elements[depth] = [1, { tagNm, hasChild: false, parents }]
        }

        if (tagNm === 'br' || str.endsWith('/>')) {
            elements[depth][0]++;
            continue;
        }

        depth++;

        console.log(elements)
    }

    console.log(elements)
}

