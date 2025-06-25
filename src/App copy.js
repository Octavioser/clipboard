import React, { useRef, useState } from 'react';


import AddItem from './AddItem';
import { getBox } from './Items';
import { Item, ImageListItem } from './Components';
import { parsingClipboard, parsingDataSetClipboard, parsingImgSetClipboard, parseHtmlString } from './Utils'

import redBox from './img/redBox.png'
import redCircle from './img/redCircle.png'
import bentArrow from './img/bentArrow.png'
import arrow from './img/arrow.png'
import redArrow from './img/redArrow.png'
import './App.css'



// const btnList = [
//     { type: 'images', img: redCircle, alt: 'Red Circle', labelText: '빨간 원', value: numberCircleList },
//     { type: 'html', img: redBox, alt: 'Red Box', labelText: '빨간선 박스', value: '<meta charset="utf-8"><div id="" class="slide_object" object_type="9" contenteditable="false" editable="1" style="left: 382px; top: 108px; z-index: 50006;"><div id="awrnbdlj4" class="dze_shape_main" shape_type="1" style="width:512.5px;height:398.334px;"><svg class="dze_shape_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 512.5 398.3336666666666" style="width:512.5px;height:398.334px;"><defs></defs><g transform="translate(0, 0) scale(1, 1)"><g style="fill:transparent;fill-opacity:1;"><path d="M 0 0 L 512.5 0 L 512.5 398.3336666666666 L 0 398.3336666666666 Z"></path></g><g style="fill:none;fill-opacity:0;stroke:rgb(255, 0, 0);stroke-opacity:1;stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;"><path d="M 0 0 L 512.5 0 L 512.5 398.3336666666666 L 0 398.3336666666666 Z"></path></g><g style="fill:none;fill-opacity:0;stroke:rgb(255, 255, 255);stroke-opacity:0;stroke-width:10;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;"><path d="M 0 0 L 512.5 0 L 512.5 398.3336666666666 L 0 398.3336666666666 Z"></path></g></g></svg><div class="dze_shape_textbox" default_font_size="18pt" style="margin:2px;width:508.5px;height:394.334px;left:0px;top:0px;"><div class="shape_textbox middle" contenteditable="false" style="color:rgb(255, 255, 255);"><p style="text-align:center;"><span style="font-size:18pt;"><br></span></p></div></div></div></div>' },
//     { type: 'html', img: redArrow, alt: 'red Arrow', labelText: '빨간 화살표', value: '<meta charset="utf-8"><div id="" class="slide_object" object_type="9" contenteditable="false" editable="1" style="left: 145px; top: 230px; z-index: 50006;"><div id="mq68xv46f" class="dze_shape_main" shape_type="16" arrow_type="1" style="width: 130.102px; height: 0px; transform: scaleY(-1) scaleX(-1);"><svg class="dze_shape_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 130.10199999999998 1" style="width: 130.102px; height: 1px;"><defs><marker id="arrow_head_mq68xv46f" orient="0deg" viewBox="0 0 5.333333333333333 4" refX="4" refY="2" markerWidth="5.333333333333333" markerHeight="4" fill="none" arrow_type="0" arrow_position="0"><path style="fill:rgb(255, 0, 0);fill-opacity:1;stroke:none;" d="M 0 0 L 5.333333333333333 2 L 0 4 L 1.7777777777777777 2 Z"></path></marker></defs><g transform="translate(0, 0) scale(1, 1)"><g style="fill:none;fill-opacity:1;"><path d="M 0 0 L 130.10199999999998 0 M 130.10199999999998 0 L 0 0 Z"></path></g><g style="fill:none;fill-opacity:0;stroke:rgb(255, 0, 0);stroke-opacity:1;stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;"><path d="M 0 0 L 130.10199999999998 0 M 130.10199999999998 0 L 0 0 Z"></path></g><g style="fill:none;fill-opacity:0;stroke:rgb(255, 255, 255);stroke-opacity:0;stroke-width:10;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;"><path d="M 0 0 L 130.10199999999998 0 M 130.10199999999998 0 L 0 0 Z"></path></g><g style="fill: none; fill-opacity: 0; stroke: rgb(255, 255, 255); stroke-opacity: 0; stroke-width: 6; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: none; marker-end: url(&quot;#arrow_head_mq68xv46f&quot;);"><path d="M 0 0 L 130.10199999999998 0 M 130.10199999999998 0 L 0 0 Z"></path></g></g></svg></div></div>' },
//     { type: 'html', img: arrow, alt: 'arrow', labelText: '화살표 직선', value: '<meta charset="utf-8"><div id="" class="slide_object" object_type="9" contenteditable="false" editable="1" style="left: 106px; top: 236px; z-index: 50014;"><div id="oibd0ne4e" class="dze_shape_main" shape_type="16" arrow_type="1" style="width:92.7419px;height:0px;transform:scalex(-1);"><svg class="dze_shape_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 92.74189999999999 1" style="width:92.7419px;height:1px;"><defs><marker id="arrow_head_oibd0ne4e" orient="0deg" viewBox="0 0 5.333333333333333 4" refX="4" refY="2" markerWidth="5.333333333333333" markerHeight="4" fill="none" arrow_type="0" arrow_position="0"><path style="fill:rgb(65, 113, 156);fill-opacity:1;stroke:none;" d="M 0 0 L 5.333333333333333 2 L 0 4 L 1.7777777777777777 2 Z"></path></marker></defs><g transform="translate(0, 0) scale(1, 1)"><g style="fill:none;fill-opacity:1;"><path d="M 0 0 L 92.74189999999999 0 M 92.74189999999999 0 L 0 0 Z"></path></g><g style="fill:none;fill-opacity:0;stroke:#41719c;stroke-opacity:1;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;"><path d="M 0 0 L 92.74189999999999 0 M 92.74189999999999 0 L 0 0 Z"></path></g><g style="fill:none;fill-opacity:0;stroke:rgb(255, 255, 255);stroke-opacity:0;stroke-width:10;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;"><path d="M 0 0 L 92.74189999999999 0 M 92.74189999999999 0 L 0 0 Z"></path></g><g style="fill: none; fill-opacity: 0; stroke: rgb(255, 255, 255); stroke-opacity: 0; stroke-width: 4; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: none; marker-end: url(&quot;#arrow_head_oibd0ne4e&quot;);"><path d="M 0 0 L 92.74189999999999 0 M 92.74189999999999 0 L 0 0 Z"></path></g></g></svg></div></div>' },
//     { type: 'html', img: bentArrow, alt: 'bentArrow', labelText: '꺾인 화살표', value: '<meta charset="utf-8"><div id="" class="slide_object" object_type="9" contenteditable="false" editable="1" style="left: 106px; top: 293px; z-index: 50014;"><div id="w9fw4ggfa" class="dze_shape_main" shape_type="17" arrow_type="1" style="width:94px;height:43px;transform:scalex(-1) scaley(-1);"><svg class="dze_shape_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 94 43" style="width:94px;height:43px;"><defs><marker id="arrow_head_w9fw4ggfa" orient="0deg" viewBox="0 0 5.333333333333333 4" refX="4" refY="2" markerWidth="5.333333333333333" markerHeight="4" fill="none" arrow_type="0" arrow_position="0"><path style="fill:#41719c;fill-opacity:1;stroke:none;" d="M 0 0 L 5.333333333333333 2 L 0 4 L 1.7777777777777777 2 Z"></path></marker></defs><g transform="translate(0, 0) scale(1, 1)"><g style="fill:none;fill-opacity:1;"><path d="M 0 0 L 47 0 L 47 43 L 94 43"></path></g><g style="fill:none;fill-opacity:0;stroke:rgb(65, 113, 156);stroke-opacity:1;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;"><path d="M 0 0 L 46.951599999999985 0 L 46.951599999999985 43 L 94 43"></path></g><g style="fill:none;fill-opacity:0;stroke:rgb(255, 255, 255);stroke-opacity:0;stroke-width:10;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;"><path d="M 0 0 L 46.951599999999985 0 L 46.951599999999985 43 L 94 43"></path></g><g style="fill: none; fill-opacity: 0; stroke: rgb(255, 255, 255); stroke-opacity: 0; stroke-width: 4; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: none; marker-end: url(&quot;#arrow_head_w9fw4ggfa&quot;);"><path d="M 0 0 L 46.951599999999985 0 L 46.951599999999985 43 L 94 43"></path></g></g></svg></div></div>' }
// ]

const App = () => {
    const [text, setText] = useState('');

    const [isAdd, setIsAdd] = useState(false);

    const [btnList, setBtnList] = useState([])

    const memoRef = useRef();

    return (
        <div className='panel'>
            <div className='title-area'>
                <h1 className='title'>Clipboard Extension</h1>
            </div>
            <div className='main-area'>
                <span className='description'>Click to copy an item</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="square-card">
                            <div className="input-icon">
                                {React.createElement(
                                    "svg",
                                    {
                                        width: "48",
                                        height: "48",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "1.5",
                                        className: "text-blue-500",
                                    },
                                    [
                                        React.createElement("path", {
                                            key: "path1",
                                            d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
                                        }),
                                        React.createElement("polyline", {
                                            key: "polyline1",
                                            points: "14,2 14,8 20,8",
                                        }),
                                        React.createElement("line", {
                                            key: "line1",
                                            x1: "16",
                                            y1: "13",
                                            x2: "8",
                                            y2: "13",
                                        }),
                                        React.createElement("line", {
                                            key: "line2",
                                            x1: "16",
                                            y1: "17",
                                            x2: "8",
                                            y2: "17",
                                        }),
                                    ],
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div className='item-area'>
                    <div>
                        <button onClick={parsingClipboard}>클립보드데이터를 텍스트로 클립보드에저장</button>
                        <button
                            onClick={async () => {
                                await parsingDataSetClipboard(getBox(
                                    500, 100, 'red', 'white'
                                ), 'text/html');
                            }}>
                            getBox
                        </button>
                        <button
                            onClick={async () => {
                                const clipboardContents = await navigator.clipboard.read();
                                const blob = await clipboardContents[0].getType("text/plain");
                                const blobText = await blob.text();
                                await parsingDataSetClipboard(blobText, 'text/html');
                            }}>
                            저장한 텍스트를 다시 사용할수있게 변환
                        </button>
                    </div>

                    <ImageListItem
                        key={'redCircle'}
                        img={redCircle}
                        alt={'Red Circle'}
                        label={'빨간 원'}
                        list={[
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
                        ]}
                        parsingImgSetClipboard={parsingImgSetClipboard}
                    />
                </div> */}

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
            </div>
            <div className='fav'>
                <button
                    className={`fab-btn ${isAdd ? 'close' : ''}`}
                    onClick={() => setIsAdd(prev => !prev)}
                >
                    <span className="plus-icon">+</span>
                </button>
            </div>
            <AddItem isAdd={isAdd} />
        </div >
    );
}

export default App;
