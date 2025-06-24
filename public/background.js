
/*global chrome*/
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "writeToClipboard") {
//         console.log(request)
//         const blob = new Blob([request.blobText], { type: request.blobType });
//         const data = [new ClipboardItem({ [request.blobType]: blob })]
//         console.log('111111')
//         navigator.clipboard.write(data)
//             .then(() => sendResponse({ status: 'success' }))
//             .catch(err => {
//                 console.error('Error writing to clipboard:', err);
//                 sendResponse({ status: 'failure', error: err });
//             });

//     }
//     return true; // to allow asynchronous sendResponse
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

//     if (request.action === "writeToClipboard") {
//         console.log('클리보드 액션 시작')
//         // 현재 활성 탭에 스크립트 실행 요청
//         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//             console.log('쿼리 실행')
//             setTimeout(() => {
//                 chrome.tabs.update(tabs[0].id, { active: true }, function () {
//                     const blobText = request.blobText;
//                     const blobType = request.blobType;
//                     console.log('update 실행')
//                     console.log(tabs[0].id)
//                     chrome.scripting.executeScript({
//                         target: { tabId: tabs[0].id },
//                         function: async (blobText, blobType) => {
//                             try {
//                                 console.log('실행!!1')
//                                 const blob = new Blob([blobText], { type: blobType });
//                                 const data = [new ClipboardItem({ [blobType]: blob })];
//                                 await navigator.clipboard.write(data);
//                                 return { status: 'success' };
//                             } catch (error) {
//                                 return { status: 'failure', error: error.toString() }; // 에러 정보를 반환
//                             }
//                         },
//                         args: [blobText, blobType] // args 배열을 통해 파라미터 전달
//                     }, (injectionResults) => {
//                         console.log('실행결과==>', injectionResults)
//                         if (chrome.runtime.lastError) {
//                             console.error('Script injection failed:', chrome.runtime.lastError.message);
//                         }
//                         if (injectionResults && injectionResults[0]) {
//                             console.log('Injection successful:', injectionResults[0].result);
//                         } else {
//                             console.error('Injection failed');
//                         }
//                     });
//                 })
//             }, 500);  // 500ms 대기 후 클립보드 작업 실행
//         });
//     }
//     return true; // 비동기적 응답을 허용
// });

