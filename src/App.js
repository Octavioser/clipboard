import React, { useRef, useState, useEffect } from 'react';


import AddItem from './AddItem';

import { CommonDialog, CommonSnackbar } from './Components';

import { parsingClipboard, parsingDataSetClipboard, parsingImgSetClipboard, parseHtmlString, searchItem, deleteItem, saveItem } from './Utils'

import redCircle from './img/redCircle.png'
import './App.css'

const App = () => {

    const [isWord, setIsWord] = useState(false)

    const [copyFlag, setCopyFlag] = useState('')

    const [showDropdown, setShowDropdown] = useState(false)

    const [text, setText] = useState('');

    const [isAdd, setIsAdd] = useState(false);

    const [btnList, setBtnList] = useState([])

    const [deleteMode, setDeleteMode] = useState(false)

    const [showDownloadDialog, setShowDownloadDialog] = useState(false)
    const [showUploadDialog, setShowUploadDialog] = useState(false)

    const [snackbar, setSnackbar] = useState({ show: false, message: '' })

    const memoRef = useRef();

    const testValue = '<div id="b116d5-40" class="slide_object" object_type="9" contenteditable="false" editable="1" style="left: 64px; top: 38px; z-index: 50022;"><div id="b116d5-40" class="dze_shape_main" shape_type="1" style="width: 116.667px; height: 113.333px;"><svg class="dze_shape_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 116.667 113.333" style="width: 116.667px; height: 113.333px;"><defs></defs><g transform="translate(0, 0) scale(1, 1)"><g style="fill: rgb(255, 255, 255); fill-opacity: 1;"><path d="M 0 0 L 116.667 0 L 116.667 113.333 L 0 113.333 Z"></path></g><g style="fill: none; fill-opacity: 0; stroke: rgb(237, 125, 49); stroke-opacity: 1; stroke-width: 1; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: none;"><path d="M 0 0 L 116.667 0 L 116.667 113.333 L 0 113.333 Z"></path></g><g style="fill: none; fill-opacity: 0; stroke: rgb(255, 255, 255); stroke-opacity: 0; stroke-width: 10; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: none;"><path d="M 0 0 L 116.667 0 L 116.667 113.333 L 0 113.333 Z"></path></g></g></svg><div class="dze_shape_textbox" default_font_size="18pt" style="margin: 2px; width: 112.667px; height: 109.333px; left: 0px; top: 0px;"><div class="shape_textbox middle" contenteditable="false" style="color: rgb(0, 0, 0);"><p style="text-align: center;"><span style="font-size: 18pt;"><br></span></p></div></div></div></div>'
    const testDisplayValue = '<svg class="dze_shape_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 116.667 113.333" style="width: 116.667px; height: 113.333px;"><defs></defs><g transform="translate(0, 0) scale(1, 1)"><g style="fill: rgb(255, 255, 255); fill-opacity: 1;"><path d="M 0 0 L 116.667 0 L 116.667 113.333 L 0 113.333 Z"></path></g><g style="fill: none; fill-opacity: 0; stroke: rgb(237, 125, 49); stroke-opacity: 1; stroke-width: 1; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: none;"><path d="M 0 0 L 116.667 0 L 116.667 113.333 L 0 113.333 Z"></path></g><g style="fill: none; fill-opacity: 0; stroke: rgb(255, 255, 255); stroke-opacity: 0; stroke-width: 10; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: none;"><path d="M 0 0 L 116.667 0 L 116.667 113.333 L 0 113.333 Z"></path></g></g></svg>'

    const buttons = [
        { key: 1, title: "홈", displayValue: testDisplayValue, value: testValue },
        { key: 2, title: "사용자", displayValue: testDisplayValue, value: testValue },
        { key: 3, title: "설정", displayValue: testDisplayValue, value: testValue },
        { key: 4, title: "메일", displayValue: testDisplayValue, value: testValue },
        { key: 5, title: "전화", displayValue: testDisplayValue, value: testValue },
        { key: 6, title: "캘린더", displayValue: testDisplayValue, value: testValue },
    ]

    useEffect(() => {
        // 닫을때 다시 불러오기위함 
        if (isAdd) return;

        (async () => {
            const data = await searchItem(isWord) || [];
            console.log(data)
            setBtnList(data)
            // setBtnList(buttons)
        })()

    }, [isWord, isAdd, setBtnList])

    const containerRef = useRef();

    // 새로고침 효과 트리거 함수
    const triggerRefresh = () => {
        const el = containerRef.current;
        if (!el) return;
        el.classList.remove("shimmer"); // 다시 붙이기 위한 초기화
        el.classList.add("shimmer");
        setTimeout(() => { el.classList.remove("shimmer"); }, 1200)
        setTimeout(() => { setIsWord(!isWord) }, 1000)
    };

    return (
        <div className="container" ref={containerRef}>
            <div className="title-container">
                <h1 className={`main-title ${isWord ? "blue-theme" : ""}`}>Clipboard Extension</h1>
                <span className="subtitle">{`${isWord ? "워드" : "슬라이드"}`}</span>
            </div>
            <div className="guide-header">
                <p className="guide-text">Click to copy an item</p>
                <div className="dropdown-container">
                    <button className="dropdown-button" onClick={() => setShowDropdown(!showDropdown)}>
                        {`메뉴  ${showDropdown ? '▲' : '▼'}`}
                    </button>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setShowDownloadDialog(true)
                                    setShowDropdown(false)
                                }}
                            >
                                다운로드
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setShowUploadDialog(true)
                                    setShowDropdown(false)
                                }}
                            >
                                업로드
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setDeleteMode(!deleteMode)
                                    setShowDropdown(false)
                                }}
                            >
                                {deleteMode ? "제거 완료" : "제거"}
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    triggerRefresh()
                                    setShowDropdown(false)
                                }}
                            >
                                {`${isWord ? "슬라이드 모드" : "워드 모드"}`}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* <div>
                <button onClick={parsingClipboard}>클립보드데이터를 텍스트로 클립보드에저장</button>
                <button
                    onClick={async () => {
                        const clipboardContents = await navigator.clipboard.read();
                        const blob = await clipboardContents[0].getType("text/plain");
                        const blobText = await blob.text();
                        await parsingDataSetClipboard(blobText);
                    }}>
                    저장한 텍스트를 다시 사용할수있게 변환
                </button>
            </div> */}
            <div className="scroll-container">
                <div className="button-grid">
                    <div className="special-button-wrapper">
                        <button className="square-button special-button">
                            <div className="input-icon">
                                <img src={redCircle} alt="선택 아이콘" className="icon-image" />
                            </div>
                            <span className="button-title">숫자 빨간 원</span>
                        </button>
                        <div className="number-dropdown">
                            <div className="number-grid">
                                {[
                                    { name: '1', value: '/images/reCircle/circle1.png' },
                                    { name: '2', value: '/images/reCircle/circle2.png' },
                                    { name: '3', value: '/images/reCircle/circle3.png' },
                                    { name: '4', value: '/images/reCircle/circle4.png' },
                                    { name: '5', value: '/images/reCircle/circle5.png' },
                                    { name: '6', value: '/images/reCircle/circle6.png' },
                                    { name: '7', value: '/images/reCircle/circle7.png' },
                                    { name: '8', value: '/images/reCircle/circle8.png' },
                                    { name: '9', value: '/images/reCircle/circle9.png' },
                                    { name: '10', value: '/images/reCircle/circle10.png' },
                                    { name: '11', value: '/images/reCircle/circle11.png' },
                                    { name: '12', value: '/images/reCircle/circle12.png' },
                                    { name: '13', value: '/images/reCircle/circle13.png' },
                                    { name: '14', value: '/images/reCircle/circle14.png' },
                                    { name: '15', value: '/images/reCircle/circle15.png' },
                                    { name: '16', value: '/images/reCircle/circle16.png' }
                                ].map(({ value, name }) => (
                                    <button
                                        key={value}
                                        onClick={async () => {
                                            await parsingImgSetClipboard(value);
                                            setCopyFlag(name)
                                            setTimeout(() => { setCopyFlag('') }, 1000)
                                        }}
                                        className="number-button">
                                        {copyFlag === name ? 'Copied!' : name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {btnList.map(({ key, title, displayValue, value }) => {
                        const svgBtn = parseHtmlString(displayValue)
                        if (!svgBtn) return null;
                        return (
                            <div key={key} className="button-wrapper">
                                <button
                                    onClick={async () => {
                                        if (deleteMode) return;
                                        await parsingDataSetClipboard(value);
                                        setCopyFlag(key)
                                        setTimeout(() => { setCopyFlag('') }, 1000)
                                    }}
                                    className="square-button"
                                >
                                    <div className="input-icon">
                                        {svgBtn}
                                    </div>
                                    <span className="button-title">{copyFlag === key ? 'Copied!' : title}</span>
                                </button>
                                {deleteMode && (
                                    <button
                                        className="delete-x-button"
                                        onClick={async () => {
                                            await deleteItem(isWord, key);
                                            setBtnList(await searchItem(isWord) || [])
                                        }}>
                                        ✕
                                    </button>
                                )}
                            </div>
                        )
                    }).filter(e => e)}

                </div>
            </div>
            <div className='meno-area'>
                <span>Memo</span>
                <textarea
                    ref={memoRef}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                        e.target.style.height = 'auto'; //height 초기화
                        e.target.style.height = (e.target.scrollHeight + 1) + 'px';
                    }}
                    placeholder="Enter your notes"
                    rows="4"
                    cols="50"
                />
            </div>
            <div className='fav'>
                <button
                    className={`fab-btn ${isAdd ? 'close' : ''} ${isWord ? "blue-theme" : ""}`}
                    onClick={() => setIsAdd(prev => !prev)}
                >
                    <span className="plus-icon">+</span>
                </button>
            </div>
            {showDownloadDialog &&
                <CommonDialog
                    close={() => { setShowDownloadDialog(false) }}
                    confirm={async () => {
                        const data = await searchItem(isWord) || [];
                        if (data.length < 1) {
                            setSnackbar({ show: true, message: '저장된 데이터가 없습니다.' })
                            return;
                        }
                        const jsonStr = JSON.stringify(data, null, 2);
                        // 2. Blob 객체로 생성
                        const blob = new Blob([jsonStr], { type: "application/json" });
                        // 3. 임시 URL 생성
                        const url = URL.createObjectURL(blob);

                        // 4. a 태그로 다운로드 트리거
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = (() => {
                            const now = new Date();
                            const yyyy = now.getFullYear();                        // 2025
                            const mm = String(now.getMonth() + 1).padStart(2, '0'); // 01~12
                            const dd = String(now.getDate()).padStart(2, '0');      // 01~31
                            return `clipboardExtension-${isWord ? 'word' : 'slide'}-${yyyy}${mm}${dd}.json`; // 예: "20250625.json"
                        })();
                        document.body.appendChild(a); // (필수: Firefox 호환)
                        a.click();
                        document.body.removeChild(a);

                        // 5. 메모리 해제
                        URL.revokeObjectURL(url);

                        setShowDownloadDialog(false)

                    }}
                    title={'데이터 다운로드'}
                    contentLabel={'저장된 도형 데이터를 파일로 다운로드합니다.'}
                >
                </CommonDialog>
            }
            {showUploadDialog &&
                <CommonDialog
                    close={() => { setShowUploadDialog(false) }}
                    title={'데이터 업로드'}
                    contentLabel={'도형 데이터 파일을 업로드합니다.'}
                >
                    <div className="upload-area">
                        <input
                            type="file"
                            id="file-upload"
                            accept=".json"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = async (event) => {
                                        try {
                                            const fileContent = JSON.parse(event.target.result);
                                            const validateKey = (() => {
                                                // 키검사 
                                                for (const content of fileContent) {
                                                    if (!content.hasOwnProperty('displayValue')) return true;
                                                    if (!content.hasOwnProperty('key')) return true;
                                                    if (!content.hasOwnProperty('title')) return true;
                                                    if (!content.hasOwnProperty('value')) return true;
                                                    if (!content.hasOwnProperty('isWord')) return true;
                                                }

                                                return false;
                                            })()

                                            if (validateKey) {
                                                setSnackbar({ show: true, message: '잘못된 파일입니다.' })
                                                return;
                                            }

                                            for (const { key, value, displayValue, title, isWord: targetIsWord } of fileContent) {
                                                await saveItem(targetIsWord, { key, value, displayValue, title, isWord: targetIsWord })
                                            }

                                            setSnackbar({ show: true, message: '저장되었습니다.' })
                                            setShowUploadDialog(false)
                                            setBtnList(await searchItem(isWord) || [])

                                        } catch (error) {
                                            console.error("Error parsing JSON:", error);
                                        }
                                    };
                                    reader.readAsText(file);
                                }
                            }}
                            className="file-input"
                        />
                        <label htmlFor="file-upload" className="file-label">
                            📁 파일 선택
                        </label>
                    </div>
                </CommonDialog>
            }
            <AddItem isAdd={isAdd} setIsWord={setIsWord} close={() => setIsAdd(prev => !prev)} />
            <CommonSnackbar snackbar={snackbar} close={() => { setSnackbar({ show: false, message: '' }) }} />
        </div>
    )
}

export default App;
