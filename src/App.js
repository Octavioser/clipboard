import React, { useRef, useState, useEffect } from 'react';


import AddItem from './AddItem';

import { CommonDialog, CommonSnackbar } from './Components';

import { parsingClipboard, parsingDataSetClipboard, parsingImgSetClipboard, parseHtmlString, searchItem, deleteItem } from './Utils'

import redCircle from './img/redCircle.png'
import './App.css'

const App = () => {

    const [isWord, setIsWord] = useState(false)

    const [copyFlag, setCopyFlag] = useState('')

    const [text, setText] = useState('');

    const [isAdd, setIsAdd] = useState(false);

    const [btnList, setBtnList] = useState([])

    const [deleteMode, setDeleteMode] = useState(false)

    const [showDownloadDialog, setShowDownloadDialog] = useState(false)
    const [showUploadDialog, setShowUploadDialog] = useState(false)

    const [snackbar, setSnackbar] = useState({ show: false, message: '' })

    const memoRef = useRef();

    const buttons = [
        { key: 1, title: "홈", displayValue: null, value: '<></>' },
        { key: 2, title: "사용자", displayValue: null, value: '<></>' },
        { key: 3, title: "설정", displayValue: null, value: '<></>' },
        { key: 4, title: "메일", displayValue: null, value: '<></>' },
        { key: 5, title: "전화", displayValue: null, value: '<></>' },
        { key: 6, title: "캘린더", displayValue: null, value: '<></>' },
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
                <div className="button-group">
                    <button className="icon-button" onClick={() => setShowDownloadDialog(true)} title="다운로드">
                        💾
                    </button>
                    <button className="icon-button" onClick={() => setShowUploadDialog(true)} title="업로드">
                        📥
                    </button>
                    <button className="icon-button" onClick={() => { triggerRefresh() }} title="전환">
                        🔄
                    </button>
                    <button className="icon-button" onClick={() => setDeleteMode(!deleteMode)}>
                        {deleteMode ? '✔️' : '🗑️'}
                    </button>
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
                    {btnList.map(({ key, title, displayValue, value }) => (
                        <div key={key} className="button-wrapper">
                            <button
                                onClick={async () => {
                                    await parsingDataSetClipboard(value);
                                    setCopyFlag(key)
                                    setTimeout(() => { setCopyFlag('') }, 1000)
                                }}
                                className="square-button"
                            >
                                <div className="input-icon">
                                    {parseHtmlString(displayValue)}
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
                    ))}

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

                    }}
                    title={'데이터 다운로드'}
                    contentLabel={'클립보드 데이터를 파일로 다운로드합니다.'}
                >
                </CommonDialog>
            }
            {showUploadDialog &&
                <CommonDialog
                    close={() => { setShowUploadDialog(false) }}
                    title={'데이터 업로드'}
                    contentLabel={'클립보드 데이터 파일을 업로드합니다.'}
                >
                    <div className="upload-area">
                        <input
                            type="file"
                            id="file-upload"
                            accept=".json,.txt"
                            onChange={() => { }}
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
