/* global describe:false */
import { chai } from '@environment-safe/chai';
import { it } from '@open-automaton/moka';
import { Worker } from '../src/index.mjs';
const should = chai.should();

describe('module', ()=>{
    describe('performs a simple test suite', ()=>{
        it('loads', async ()=>{
            const worker = new Worker('./test-worker-script.mjs', {
                type:'module',
                root: import.meta.url,
                inheritMap: true
            });
            await worker.ready;
            let data = null;
            const responsePromise = new Promise((resolve)=>{
                worker.onmessage = (e)=>{
                    if(
                        e.data && 
                        e.data.source && 
                        e.data.source === 'react-devtools-content-script'
                    ){ // react browser plug safety :P
                        return;
                    }
                    data = JSON.parse(e.data);
                    resolve();
                };
            });
            worker.postMessage(JSON.stringify({
                message: 'ping'
            }));
            await responsePromise;
            should.exist(data);
            should.exist(data.message);
            data.message.should.equal('pong');
            worker.terminate();
        });
    });
});

