import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
let internalRequire = null;
const ensureRequire = ()=> (!internalRequire) && (
    internalRequire = mod.createRequire(import.meta.url)
);
let ThisWorker = null;
if(isBrowser || isJsDom){
    window.workersReady = {};
    const Worker = function(script, options={}){
        if(options.inheritMap){
            const mapEls = [...document.head.getElementsByTagName('script')].filter(
                (el)=> el.getAttribute('type') === 'importmap'
            );
            options.map = JSON.parse(mapEls[0].innerHTML);
        }
        if(options.map){
            const iframe = document.createElement('iframe');
            const callbackId = `cb${Math.floor(Math.random()*1000000000)}`;
            const terminateId = `tm${Math.floor(Math.random()*1000000000)}`;
            const worker = {};
            window.workersReady[terminateId] = function(window){
                iframe.remove();
            };
            worker.ready = new Promise((resolve, reject)=>{
                window.workersReady[callbackId] = function(window){
                    resolve();
                };
            });
            const html = `<html><head>
                <script type="importmap">${JSON.stringify(options.map)}</script>
            </head><body onload="parent.workersReady.${callbackId}(this.window)"><script>
                window.self = {};
                window.self.postMessage = (e)=>{
                    return parent.postMessage(e);
                };
                window.onmessage = (e)=>{
                    if(window.self.onmessage) window.self.onmessage(e);
                };
            </script><script type="module" src="${script}"></script></body></html>`;
            document.body.appendChild(iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
            worker.postMessage = (data)=>{
                iframe.contentWindow.postMessage(data, '*');
            };
            window.onmessage = function(e) {
                if(typeof e.data !== 'string') return;
                if(worker.onmessage) worker.onmessage(e);
            };
            worker.terminate = ()=>{
                window.workersReady[terminateId]();
            };
            return worker;
        }else{
            return new window.Worker(script, options);
        }
    };
    ThisWorker = Worker;
}else{
    ensureRequire();
    const NodeWorker = internalRequire('web-worker');
    const Worker = function(incomingPath, options={}){
        const filePath = incomingPath[0] === '.'?
            new URL(incomingPath, options.root || import.meta.url).pathname:
            incomingPath;
        return new NodeWorker(filePath, options);
    };
    ThisWorker = Worker;
}

export const Worker = ThisWorker;