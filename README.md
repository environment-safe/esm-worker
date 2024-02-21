esm-worker
==========
It seems the powers that be [have no plans to support](https://github.com/WICG/import-maps/issues/2) [importmaps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) in [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API), so this is a shim to use [iframes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) as workers until some large company prioritizes paying developers to implement features that should already be complete.

The price for this early compatibility will mean a decrease in performance as the iframe competes with the main thread for CPU resources, in exchange for being able to use modern standards which can eventually be mainlined into worker esm support with full performance, when our browser overlords deem it so. 

It will still prevent hundreds of megabytes of loaded resources that a traditional build processes will cause as well as have better caching characteristics over time while still remaining build compatible.

Usage
-----

In your main:
```js
const worker = new Worker('./worker-script.mjs', {
    //ESM only works in module mode
    type:'module',
    //so relative URLs are symmetric
    root: import.meta.url,
    //grab the importmap from the page we execute on
    inheritMap: true
    // or map: <importmap>
});
worker.postMessage(JSON.stringify({
    foo: 'bar'
}));

//sometime later:
worker.terminate();
```

In your worker script

```js
// import things from your importmap static or dynamically
self.onmessage = (e)=>{
    self.postMessage(JSON.stringify({
        baz: 'bat'
    }));
}
```

This works in client & server, buildless.

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```

Development
-----------
Browser tests are run interactively as above, please run them before issuing a PR.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

