import { useState, Fragment } from 'react';
import { validateParsingClipboardToText, getCurrentDateTimeNumberString, parseHtmlString, saveItem, searchItem } from './Utils';
import { CommonSnackbar } from './Components';

import './AddItem.css';




const AddItem = ({ isAdd, close, setIsWord }) => {

    const [currentPage, setCurrentPage] = useState(1);

    const [titleInput, setTitleInput] = useState("");

    const [addItem, setAddItem] = useState({ value: '', displayValue: '', isWord: null });

    const [displayItem, setDisplayItem] = useState(<></>);

    const [snackbar, setSnackbar] = useState({ show: false, message: '' });

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
                                        const { displayValue, value, isWord } = await validateParsingClipboardToText((e) => { setSnackbar(e); });
                                        if (value) {
                                            setAddItem({ displayValue, value, isWord });
                                            setDisplayItem(parseHtmlString(displayValue));
                                            setCurrentPage(2);
                                        }
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
                                    setCurrentPage(1);
                                    setTitleInput('');
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
                                <div className="input-icon2">
                                    {displayItem}
                                </div>
                                <h2 className="input-title">제목을 입력해주세요</h2>
                                <div className="input-group">
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

                                <div className="button-group2">
                                    <button
                                        disabled={!titleInput.trim()}
                                        className="save-button"
                                        onClick={async () => {
                                            if (!titleInput) {
                                                setSnackbar({ show: true, message: '제목을 입력해주세요.' });
                                                return;
                                            }
                                            const key = getCurrentDateTimeNumberString();

                                            const data = await searchItem(addItem.isWord) || [];

                                            if (data.length >= 30) {
                                                setSnackbar({ show: true, message: `최대 30개까지 저장가능합니다. (해당 도형: ${addItem.isWord ? '워드' : '슬라이드'})` });
                                                return;
                                            }

                                            await saveItem(addItem.isWord, { key, value: addItem.value, displayValue: addItem.displayValue, title: titleInput, isWord: addItem.isWord });
                                            setIsWord(addItem.isWord);
                                            setSnackbar({ show: true, message: '저장되었습니다.' });
                                            setTimeout(() => {
                                                setCurrentPage(1);
                                                setTitleInput("");
                                                setAddItem({ value: '', displayValue: '', isWord: null });
                                                setDisplayItem(<></>);
                                                setSnackbar({ show: false, message: '' });
                                                close();
                                            }, 400);
                                        }}
                                    >
                                        저장하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <CommonSnackbar snackbar={snackbar} close={() => { setSnackbar({ show: false, message: '' }); }} />
        </Fragment>
    );

};
export default AddItem;