


// 가운데  h:360 w: 1280


export const getBox = (width, height, color, borderColor) =>
    `<div class="slide_object" object_type="9" contenteditable="false" editable="1"
    style="left: 443px; top: 207px; z-index: 50002;">
    <div class="dze_shape_main" shape_type="1" style="width: ${width}px; height: ${height}px;">
        <svg class="dze_shape_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1" viewBox="0 0 ${width} ${height}" style="width: ${width}px; height: ${height}px;">
            <defs></defs>
            <g transform="translate(0, 0) scale(1, 1)">
                <g style="fill: ${color}; fill-opacity: 1;">
                    <path d="M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z"></path>
                </g>
                <g
                    style="fill: none; fill-opacity: 0; stroke: #2F528F; stroke-opacity: 1; stroke-width: 1; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: none;">
                    <path d="M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z"></path>
                </g>
                <g
                    style="fill: none; fill-opacity: 0; stroke: ${borderColor}; stroke-opacity: 0; stroke-width: 10; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: none;">
                    <path d="M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z"></path>
                </g>
            </g>
        </svg>
        <div class="dze_shape_textbox" default_font_size="18pt"
            style="margin: 2px; width: 397.668px; height: 297.667px; left: 0px; top: 0px;">
            <div class="shape_textbox middle" contenteditable="false" style="color: rgb(255, 255, 255);">
                <p style="text-align: center;"><span style="font-size: 18pt;"><br></span></p>
            </div>
        </div>
    </div>
</div>
`
