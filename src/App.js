import React, { useRef, useState, useEffect } from 'react';


import AddItem from './AddItem';

import { parsingClipboard, parsingDataSetClipboard, parsingImgSetClipboard, parseHtmlString, searchItem, deleteItem } from './Utils'

import redCircle from './img/redCircle.png'
import './App.css'

const App = () => {

    const [copyFlag, setCopyFlag] = useState('')

    const [text, setText] = useState('');

    const [isAdd, setIsAdd] = useState(false);

    const [btnList, setBtnList] = useState([])

    const [deleteMode, setDeleteMode] = useState(false)

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
        console.log('useEffect!!')
        // 닫을때 다시 불러오기위함 
        if (isAdd) return;

        (async () => {
            const data = await searchItem() || [];
            console.log(data)
            setBtnList(data)
        })()

    }, [isAdd, setBtnList])


    return (
        <div className="container">
            <h1 className="main-title">Clipboard Extension</h1>
            <div className="guide-header">
                <p className="guide-text">Click to copy an item</p>
                <button className="edit-button" onClick={() => setDeleteMode(!deleteMode)}>
                    {deleteMode ? "완료" : "편집"}
                </button>
            </div>
            <div>
                {/* <button onClick={parsingClipboard}>클립보드데이터를 텍스트로 클립보드에저장</button>
                <button
                    onClick={async () => {
                        const clipboardContents = await navigator.clipboard.read();
                        const blob = await clipboardContents[0].getType("text/plain");
                        const blobText = await blob.text();
                        await parsingDataSetClipboard(blobText);
                    }}>
                    저장한 텍스트를 다시 사용할수있게 변환
                </button> */}
            </div>
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
                                    {displayValue && parseHtmlString(displayValue)}
                                </div>
                                <span className="button-title">{copyFlag === key ? 'Copied!' : title}</span>
                            </button>
                            {deleteMode && (
                                <button
                                    className="delete-x-button"
                                    onClick={async () => {
                                        await deleteItem(key);
                                        setBtnList(await searchItem() || [])
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
                    className={`fab-btn ${isAdd ? 'close' : ''}`}
                    onClick={() => setIsAdd(prev => !prev)}
                >
                    <span className="plus-icon">+</span>
                </button>
            </div>
            <AddItem isAdd={isAdd} close={() => setIsAdd(prev => !prev)} />
        </div>
    )
}

export default App;
