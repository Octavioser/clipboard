import { useState } from "react"
import './App.css'

// // 이미지 컴포넌트
export const ImageListItem = ({ img, alt, label, list, parsingImgSetClipboard }) => {
    const [copyFlag, setCopyFlag] = useState('')
    const [hoverFg, setHoverFg] = useState(false)
    return (
        <div className='item-panel'>
            <div
                className='click-panel-circle'
                onMouseOver={() => { setHoverFg(true) }}
            >
                {hoverFg &&
                    <div className='circle-area'
                        onMouseLeave={() => { setHoverFg(false) }}
                    >
                        {list.map(e => (
                            <div key={e.value}
                                className='circle-panel'
                                onClick={async () => {
                                    await parsingImgSetClipboard(e.value);
                                    setCopyFlag(e.name)
                                }}
                                onMouseLeave={() => { copyFlag !== '' && setCopyFlag('') }}
                            >
                                <span>{copyFlag === e.name ? 'Copied!' : e.name}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className='item-box'>
                <div className='img-box'>
                    <img src={img} alt={alt} />
                </div>
                <span>{label}</span>
            </div>
        </div>
    )
}


// html, text 컴포넌트
export const Item = ({ img, alt, label, copyItem, parsingDataSetClipboard }) => {
    const [copyFlag, setCopyFlag] = useState(false)
    return (
        <div className='item-panel'>
            <div className='click-panel'
                onClick={async () => {
                    await parsingDataSetClipboard(copyItem, 'text/html');
                    setCopyFlag(true)
                }}
                onMouseLeave={() => { copyFlag && setCopyFlag(false) }}
            >
                <span>{copyFlag ? 'Copied!' : 'Copy'}</span>
            </div>
            <div className='item-box'>
                <div className='img-box'>
                    <img src={img} alt={alt} />
                </div>
                <span>{label}</span>
            </div>
        </div>
    )
}

export const CommonSnackbar = ({ snackbar = { show: false, message: '' }, close }) => {


    if (!snackbar.show) return <></>

    setTimeout(() => { close() }, 3000)

    return (
        <div className="snackbar-container">
            <div className='snackbar snackbar-warning' style={{ bottom: `10px` }}>
                <div className="snackbar-content">
                    <div className="snackbar-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                    <span className="snackbar-message">{snackbar.message}</span>
                    <button onClick={() => { close() }} className="snackbar-close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* 진행 바 */}
                <div className="snackbar-progress">
                    <div
                        className="snackbar-progress-bar"
                        style={{
                            animationDuration: '3000ms',
                            animationName: "progress",
                        }}
                    />
                </div>
            </div>
        </div>
    )
}