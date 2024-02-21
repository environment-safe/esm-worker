//imports that are available in this module
import { chai } from '@environment-safe/chai';
self.onmessage = (e)=>{
    chai;
    self.postMessage(JSON.stringify({
        message: 'pong'
    }));
};