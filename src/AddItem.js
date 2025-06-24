import React, { useRef, useState, Fragment } from 'react';
import { validateParsingClipboardToText } from './Utils';
import { CommonSnackbar } from './Components';
import type1 from './img/type1.png'
import type2 from './img/type2.png'
import type3 from './img/type3.png'
import type4 from './img/type4.png'
import type5 from './img/type5.png'
import type7 from './img/type7.png'
import type8 from './img/type8.png'
import type9 from './img/type9.png'
import type10 from './img/type10.png'
import type12 from './img/type12.png'
import type13 from './img/type13.png'
import type14 from './img/type14.png'
import type15 from './img/type15.png'
import type16 from './img/type16.png'
import type161 from './img/type161.png'
import type162 from './img/type162.png'
import type17 from './img/type17.png'
import type172 from './img/type172.png'
import type18 from './img/type18.png'
import type181 from './img/type181.png'
import type182 from './img/type182.png'
import './App.css'




const AddItem = ({ isAdd }) => {

    const [currentPage, setCurrentPage] = useState(1)

    const [titleInput, setTitleInput] = useState("")

    const [addItem, setAddItem] = useState({ type: '', value: '' })

    const [snackbar, setSnackbar] = useState({ show: false, message: '' })

    return (
        <Fragment>
            <div className={`overlay ${isAdd ? "show" : ""}`}>
                <div className="overlay-content">
                    <div className="content-wrapper">
                        {/* 첫 번째 페이지 - 클립보드 추가 */}
                        <div className={`page page-1 ${currentPage === 2 ? "flip-out" : ""}`}>
                            <div className="paste-area">
                                <div className="paste-icon">
                                    <svg
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="text-gray-400"
                                    >
                                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                        <path d="M12 11h4" />
                                        <path d="M12 16h4" />
                                        <path d="M8 11h.01" />
                                        <path d="M8 16h.01" />
                                    </svg>
                                </div>
                                <h2 className="paste-title">원피스 슬라이드의 도형을 </h2>
                                <h2 className="paste-title2">복사해주세요. </h2>
                                <h6 className="paste-title3">(상단 삽입탭 - 도형 만 가능합니다.)</h6>

                                <div className="keyboard-shortcut">
                                    <span className="key">Ctrl</span>
                                    <span className="plus">+</span>
                                    <span className="key">C</span>
                                </div>
                                <p className="paste-instruction">복사 후 밑에 버튼을 클릭 해주세요.</p>
                                <button className="paste-button"
                                    onClick={async () => {
                                        await validateParsingClipboardToText((e) => { setSnackbar(e) })
                                        // const { type, value } = await validateParsingClipboardToText((e) => { setSnackbar(e) })
                                        // if (type && value) {
                                        //     setAddItem({ type, value })
                                        //     setCurrentPage(2)
                                        // }
                                    }}
                                >
                                    클립보드에서 도형 추출하기
                                </button>
                            </div>
                        </div>
                        {/* 두 번째 페이지 - 제목 입력 */}
                        <div className={`page page-2 ${currentPage === 2 ? "flip-in" : ""}`}>

                            <button className="back-arrow-button"
                                onClick={() => {
                                    setCurrentPage(1)
                                    setTitleInput('')

                                }} >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M19 12H5" />
                                    <path d="M12 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="title-input-area">
                                <div className="input-icon">
                                    <iframe
                                        srcDoc={addItem.value} // 클립보드에서 가져온 htmlString
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            border: 'none',
                                            background: 'transparent',
                                            borderRadius: 20,
                                            display: 'block',
                                        }}
                                        sandbox=""
                                        title="Clipboard Preview"
                                    />
                                </div>
                                <p>% 실제 복사한 도형에 따라 </p>
                                <h2 className="input-title">제목을 입력해주세요</h2>
                                <div className="input-group">
                                    <label htmlFor="title-input" className="input-label">제목</label>
                                    <input
                                        id="title-input"
                                        type="text"
                                        value={titleInput}
                                        onChange={(e) => setTitleInput(e.target.value)}
                                        placeholder="여기에 제목을 입력하세요"
                                        className="title-input"
                                        autoFocus
                                    />
                                </div>

                                <div className="button-group">
                                    <button
                                        onClick={() => {

                                        }}
                                        disabled={!titleInput.trim()}
                                        className="save-button"
                                    >
                                        저장하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <CommonSnackbar snackbar={snackbar} close={() => { setSnackbar({ show: false, message: '' }) }} />
        </Fragment>
    )

}
export default AddItem;