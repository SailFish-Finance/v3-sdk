"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/wagmi.js":
/*!**********************!*\
  !*** ./lib/wagmi.js ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   chains: () => (/* binding */ chains),\n/* harmony export */   wagmiConfig: () => (/* binding */ wagmiConfig)\n/* harmony export */ });\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"@rainbow-me/rainbowkit\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wagmi/chains */ \"wagmi/chains\");\n/* harmony import */ var wagmi_providers_public__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wagmi/providers/public */ \"wagmi/providers/public\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_0__, wagmi__WEBPACK_IMPORTED_MODULE_1__, wagmi_chains__WEBPACK_IMPORTED_MODULE_2__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_3__]);\n([_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_0__, wagmi__WEBPACK_IMPORTED_MODULE_1__, wagmi_chains__WEBPACK_IMPORTED_MODULE_2__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n// Define EDUCHAIN as a custom chain\nconst educhain = {\n    id: 41923,\n    name: \"EDUCHAIN\",\n    network: \"educhain\",\n    nativeCurrency: {\n        decimals: 18,\n        name: \"EDU\",\n        symbol: \"EDU\"\n    },\n    rpcUrls: {\n        public: {\n            http: [\n                \"https://rpc.edu-chain.raas.gelato.cloud\"\n            ]\n        },\n        default: {\n            http: [\n                \"https://rpc.edu-chain.raas.gelato.cloud\"\n            ]\n        }\n    },\n    blockExplorers: {\n        default: {\n            name: \"BlockScout\",\n            url: \"https://educhain.blockscout.com\"\n        }\n    }\n};\n// Configure chains & providers\nconst { chains, publicClient } = (0,wagmi__WEBPACK_IMPORTED_MODULE_1__.configureChains)([\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_2__.bsc,\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_2__.arbitrum,\n    educhain\n], [\n    (0,wagmi_providers_public__WEBPACK_IMPORTED_MODULE_3__.publicProvider)()\n]);\n// Set up connectors\nconst { connectors } = (0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_0__.getDefaultWallets)({\n    appName: \"SailFish DEX Bridge\",\n    projectId: \"e906359052f14dc91a63a2b14221e22e\",\n    chains\n});\n// Create wagmi config\nconst wagmiConfig = (0,wagmi__WEBPACK_IMPORTED_MODULE_1__.createConfig)({\n    autoConnect: true,\n    connectors,\n    publicClient\n});\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvd2FnbWkuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQTJEO0FBQ0w7QUFDVDtBQUNXO0FBRXhELG9DQUFvQztBQUNwQyxNQUFNTSxXQUFXO0lBQ2ZDLElBQUk7SUFDSkMsTUFBTTtJQUNOQyxTQUFTO0lBQ1RDLGdCQUFnQjtRQUNkQyxVQUFVO1FBQ1ZILE1BQU07UUFDTkksUUFBUTtJQUNWO0lBQ0FDLFNBQVM7UUFDUEMsUUFBUTtZQUFFQyxNQUFNO2dCQUFDO2FBQTBDO1FBQUM7UUFDNURDLFNBQVM7WUFBRUQsTUFBTTtnQkFBQzthQUEwQztRQUFDO0lBQy9EO0lBQ0FFLGdCQUFnQjtRQUNkRCxTQUFTO1lBQUVSLE1BQU07WUFBY1UsS0FBSztRQUFrQztJQUN4RTtBQUNGO0FBRUEsK0JBQStCO0FBQy9CLE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxZQUFZLEVBQUUsR0FBR25CLHNEQUFlQSxDQUM5QztJQUFDRSw2Q0FBR0E7SUFBRUMsa0RBQVFBO0lBQUVFO0NBQVMsRUFDekI7SUFBQ0Qsc0VBQWNBO0NBQUc7QUFHcEIsb0JBQW9CO0FBQ3BCLE1BQU0sRUFBRWdCLFVBQVUsRUFBRSxHQUFHckIseUVBQWlCQSxDQUFDO0lBQ3ZDc0IsU0FBUztJQUNUQyxXQUFXO0lBQ1hKO0FBQ0Y7QUFFQSxzQkFBc0I7QUFDZixNQUFNSyxjQUFjdEIsbURBQVlBLENBQUM7SUFDdEN1QixhQUFhO0lBQ2JKO0lBQ0FEO0FBQ0YsR0FBRztBQUVlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dGpzLWJyaWRnZS1leGFtcGxlLy4vbGliL3dhZ21pLmpzPzJkNTkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0RGVmYXVsdFdhbGxldHMgfSBmcm9tICdAcmFpbmJvdy1tZS9yYWluYm93a2l0JztcbmltcG9ydCB7IGNvbmZpZ3VyZUNoYWlucywgY3JlYXRlQ29uZmlnIH0gZnJvbSAnd2FnbWknO1xuaW1wb3J0IHsgYnNjLCBhcmJpdHJ1bSB9IGZyb20gJ3dhZ21pL2NoYWlucyc7XG5pbXBvcnQgeyBwdWJsaWNQcm92aWRlciB9IGZyb20gJ3dhZ21pL3Byb3ZpZGVycy9wdWJsaWMnO1xuXG4vLyBEZWZpbmUgRURVQ0hBSU4gYXMgYSBjdXN0b20gY2hhaW5cbmNvbnN0IGVkdWNoYWluID0ge1xuICBpZDogNDE5MjMsXG4gIG5hbWU6ICdFRFVDSEFJTicsXG4gIG5ldHdvcms6ICdlZHVjaGFpbicsXG4gIG5hdGl2ZUN1cnJlbmN5OiB7XG4gICAgZGVjaW1hbHM6IDE4LFxuICAgIG5hbWU6ICdFRFUnLFxuICAgIHN5bWJvbDogJ0VEVScsXG4gIH0sXG4gIHJwY1VybHM6IHtcbiAgICBwdWJsaWM6IHsgaHR0cDogWydodHRwczovL3JwYy5lZHUtY2hhaW4ucmFhcy5nZWxhdG8uY2xvdWQnXSB9LFxuICAgIGRlZmF1bHQ6IHsgaHR0cDogWydodHRwczovL3JwYy5lZHUtY2hhaW4ucmFhcy5nZWxhdG8uY2xvdWQnXSB9LFxuICB9LFxuICBibG9ja0V4cGxvcmVyczoge1xuICAgIGRlZmF1bHQ6IHsgbmFtZTogJ0Jsb2NrU2NvdXQnLCB1cmw6ICdodHRwczovL2VkdWNoYWluLmJsb2Nrc2NvdXQuY29tJyB9LFxuICB9LFxufTtcblxuLy8gQ29uZmlndXJlIGNoYWlucyAmIHByb3ZpZGVyc1xuY29uc3QgeyBjaGFpbnMsIHB1YmxpY0NsaWVudCB9ID0gY29uZmlndXJlQ2hhaW5zKFxuICBbYnNjLCBhcmJpdHJ1bSwgZWR1Y2hhaW5dLFxuICBbcHVibGljUHJvdmlkZXIoKV1cbik7XG5cbi8vIFNldCB1cCBjb25uZWN0b3JzXG5jb25zdCB7IGNvbm5lY3RvcnMgfSA9IGdldERlZmF1bHRXYWxsZXRzKHtcbiAgYXBwTmFtZTogJ1NhaWxGaXNoIERFWCBCcmlkZ2UnLFxuICBwcm9qZWN0SWQ6ICdlOTA2MzU5MDUyZjE0ZGM5MWE2M2EyYjE0MjIxZTIyZScsXG4gIGNoYWlucyxcbn0pO1xuXG4vLyBDcmVhdGUgd2FnbWkgY29uZmlnXG5leHBvcnQgY29uc3Qgd2FnbWlDb25maWcgPSBjcmVhdGVDb25maWcoe1xuICBhdXRvQ29ubmVjdDogdHJ1ZSxcbiAgY29ubmVjdG9ycyxcbiAgcHVibGljQ2xpZW50LFxufSk7XG5cbmV4cG9ydCB7IGNoYWlucyB9O1xuIl0sIm5hbWVzIjpbImdldERlZmF1bHRXYWxsZXRzIiwiY29uZmlndXJlQ2hhaW5zIiwiY3JlYXRlQ29uZmlnIiwiYnNjIiwiYXJiaXRydW0iLCJwdWJsaWNQcm92aWRlciIsImVkdWNoYWluIiwiaWQiLCJuYW1lIiwibmV0d29yayIsIm5hdGl2ZUN1cnJlbmN5IiwiZGVjaW1hbHMiLCJzeW1ib2wiLCJycGNVcmxzIiwicHVibGljIiwiaHR0cCIsImRlZmF1bHQiLCJibG9ja0V4cGxvcmVycyIsInVybCIsImNoYWlucyIsInB1YmxpY0NsaWVudCIsImNvbm5lY3RvcnMiLCJhcHBOYW1lIiwicHJvamVjdElkIiwid2FnbWlDb25maWciLCJhdXRvQ29ubmVjdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/wagmi.js\n");

/***/ }),

/***/ "./pages/_app.jsx":
/*!************************!*\
  !*** ./pages/_app.jsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @rainbow-me/rainbowkit/styles.css */ \"./node_modules/@rainbow-me/rainbowkit/dist/index.css\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"@rainbow-me/rainbowkit\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ethers */ \"ethers\");\n/* harmony import */ var _lib_wagmi__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/wagmi */ \"./lib/wagmi.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_2__, wagmi__WEBPACK_IMPORTED_MODULE_3__, ethers__WEBPACK_IMPORTED_MODULE_5__, _lib_wagmi__WEBPACK_IMPORTED_MODULE_6__]);\n([_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_2__, wagmi__WEBPACK_IMPORTED_MODULE_3__, ethers__WEBPACK_IMPORTED_MODULE_5__, _lib_wagmi__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const [signer, setSigner] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(null);\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);\n    // Only show the UI after mounting to prevent hydration errors\n    (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(()=>{\n        setMounted(true);\n    }, []);\n    // Initialize ethers signer when account changes in wagmi\n    (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(()=>{\n        if (!mounted) return;\n        const initSigner = async ()=>{\n            if (false) {}\n        };\n        // Listen for account changes\n        if (false) {}\n        // Cleanup listeners on unmount\n        return ()=>{\n            if (window.ethereum) {\n                window.ethereum.removeListener(\"accountsChanged\", initSigner);\n                window.ethereum.removeListener(\"chainChanged\", initSigner);\n            }\n        };\n    }, [\n        mounted\n    ]);\n    // Prevent hydration errors by not rendering until mounted\n    if (!mounted) return null;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_3__.WagmiConfig, {\n        config: _lib_wagmi__WEBPACK_IMPORTED_MODULE_6__.wagmiConfig,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_2__.RainbowKitProvider, {\n            chains: _lib_wagmi__WEBPACK_IMPORTED_MODULE_6__.chains,\n            coolMode: true,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps,\n                signer: signer\n            }, void 0, false, {\n                fileName: \"/Users/olu.sail/Desktop/Workplace/Blockchain/sailfish-v3-sdk/examples/nextjs-bridge-example/pages/_app.jsx\",\n                lineNumber: 57,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/olu.sail/Desktop/Workplace/Blockchain/sailfish-v3-sdk/examples/nextjs-bridge-example/pages/_app.jsx\",\n            lineNumber: 56,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/olu.sail/Desktop/Workplace/Blockchain/sailfish-v3-sdk/examples/nextjs-bridge-example/pages/_app.jsx\",\n        lineNumber: 55,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkM7QUFDaUI7QUFDeEI7QUFDUTtBQUNaO0FBQ21CO0FBRW5ELFNBQVNPLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDckMsTUFBTSxDQUFDQyxRQUFRQyxVQUFVLEdBQUdSLCtDQUFRQSxDQUFDO0lBQ3JDLE1BQU0sQ0FBQ1MsU0FBU0MsV0FBVyxHQUFHViwrQ0FBUUEsQ0FBQztJQUV2Qyw4REFBOEQ7SUFDOURELGdEQUFTQSxDQUFDO1FBQ1JXLFdBQVc7SUFDYixHQUFHLEVBQUU7SUFFTCx5REFBeUQ7SUFDekRYLGdEQUFTQSxDQUFDO1FBQ1IsSUFBSSxDQUFDVSxTQUFTO1FBRWQsTUFBTUUsYUFBYTtZQUNqQixJQUFJLEtBQWdELEVBQUUsRUFRckQ7UUFDSDtRQUVBLDZCQUE2QjtRQUM3QixJQUFJLEtBQWdELEVBQUUsRUFNckQ7UUFFRCwrQkFBK0I7UUFDL0IsT0FBTztZQUNMLElBQUlDLE9BQU9DLFFBQVEsRUFBRTtnQkFDbkJELE9BQU9DLFFBQVEsQ0FBQ1EsY0FBYyxDQUFDLG1CQUFtQlY7Z0JBQ2xEQyxPQUFPQyxRQUFRLENBQUNRLGNBQWMsQ0FBQyxnQkFBZ0JWO1lBQ2pEO1FBQ0Y7SUFDRixHQUFHO1FBQUNGO0tBQVE7SUFFWiwwREFBMEQ7SUFDMUQsSUFBSSxDQUFDQSxTQUFTLE9BQU87SUFFckIscUJBQ0UsOERBQUNYLDhDQUFXQTtRQUFDd0IsUUFBUXBCLG1EQUFXQTtrQkFDOUIsNEVBQUNMLHNFQUFrQkE7WUFBQ00sUUFBUUEsOENBQU1BO1lBQUVvQixRQUFRO3NCQUMxQyw0RUFBQ2xCO2dCQUFXLEdBQUdDLFNBQVM7Z0JBQUVDLFFBQVFBOzs7Ozs7Ozs7Ozs7Ozs7O0FBSTFDO0FBRUEsaUVBQWVILEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0anMtYnJpZGdlLWV4YW1wbGUvLi9wYWdlcy9fYXBwLmpzeD80Y2IzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnQHJhaW5ib3ctbWUvcmFpbmJvd2tpdC9zdHlsZXMuY3NzJztcbmltcG9ydCB7IFJhaW5ib3dLaXRQcm92aWRlciB9IGZyb20gJ0ByYWluYm93LW1lL3JhaW5ib3draXQnO1xuaW1wb3J0IHsgV2FnbWlDb25maWcgfSBmcm9tICd3YWdtaSc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJztcbmltcG9ydCB7IHdhZ21pQ29uZmlnLCBjaGFpbnMgfSBmcm9tICcuLi9saWIvd2FnbWknO1xuXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgY29uc3QgW3NpZ25lciwgc2V0U2lnbmVyXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbbW91bnRlZCwgc2V0TW91bnRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIFxuICAvLyBPbmx5IHNob3cgdGhlIFVJIGFmdGVyIG1vdW50aW5nIHRvIHByZXZlbnQgaHlkcmF0aW9uIGVycm9yc1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldE1vdW50ZWQodHJ1ZSk7XG4gIH0sIFtdKTtcbiAgXG4gIC8vIEluaXRpYWxpemUgZXRoZXJzIHNpZ25lciB3aGVuIGFjY291bnQgY2hhbmdlcyBpbiB3YWdtaVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbW91bnRlZCkgcmV0dXJuO1xuICAgIFxuICAgIGNvbnN0IGluaXRTaWduZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmV0aGVyZXVtKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgZXRoZXJzLkJyb3dzZXJQcm92aWRlcih3aW5kb3cuZXRoZXJldW0pO1xuICAgICAgICAgIGNvbnN0IGNvbm5lY3RlZFNpZ25lciA9IGF3YWl0IHByb3ZpZGVyLmdldFNpZ25lcigpO1xuICAgICAgICAgIHNldFNpZ25lcihjb25uZWN0ZWRTaWduZXIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIGV0aGVycyBzaWduZXI6JywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBMaXN0ZW4gZm9yIGFjY291bnQgY2hhbmdlc1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZXRoZXJldW0pIHtcbiAgICAgIHdpbmRvdy5ldGhlcmV1bS5vbignYWNjb3VudHNDaGFuZ2VkJywgaW5pdFNpZ25lcik7XG4gICAgICB3aW5kb3cuZXRoZXJldW0ub24oJ2NoYWluQ2hhbmdlZCcsIGluaXRTaWduZXIpO1xuICAgICAgXG4gICAgICAvLyBJbml0aWFsIHNldHVwXG4gICAgICBpbml0U2lnbmVyKCk7XG4gICAgfVxuICAgIFxuICAgIC8vIENsZWFudXAgbGlzdGVuZXJzIG9uIHVubW91bnRcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHdpbmRvdy5ldGhlcmV1bSkge1xuICAgICAgICB3aW5kb3cuZXRoZXJldW0ucmVtb3ZlTGlzdGVuZXIoJ2FjY291bnRzQ2hhbmdlZCcsIGluaXRTaWduZXIpO1xuICAgICAgICB3aW5kb3cuZXRoZXJldW0ucmVtb3ZlTGlzdGVuZXIoJ2NoYWluQ2hhbmdlZCcsIGluaXRTaWduZXIpO1xuICAgICAgfVxuICAgIH07XG4gIH0sIFttb3VudGVkXSk7XG4gIFxuICAvLyBQcmV2ZW50IGh5ZHJhdGlvbiBlcnJvcnMgYnkgbm90IHJlbmRlcmluZyB1bnRpbCBtb3VudGVkXG4gIGlmICghbW91bnRlZCkgcmV0dXJuIG51bGw7XG4gIFxuICByZXR1cm4gKFxuICAgIDxXYWdtaUNvbmZpZyBjb25maWc9e3dhZ21pQ29uZmlnfT5cbiAgICAgIDxSYWluYm93S2l0UHJvdmlkZXIgY2hhaW5zPXtjaGFpbnN9IGNvb2xNb2RlPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IHNpZ25lcj17c2lnbmVyfSAvPlxuICAgICAgPC9SYWluYm93S2l0UHJvdmlkZXI+XG4gICAgPC9XYWdtaUNvbmZpZz5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7XG4iXSwibmFtZXMiOlsiUmFpbmJvd0tpdFByb3ZpZGVyIiwiV2FnbWlDb25maWciLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsImV0aGVycyIsIndhZ21pQ29uZmlnIiwiY2hhaW5zIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJzaWduZXIiLCJzZXRTaWduZXIiLCJtb3VudGVkIiwic2V0TW91bnRlZCIsImluaXRTaWduZXIiLCJ3aW5kb3ciLCJldGhlcmV1bSIsInByb3ZpZGVyIiwiQnJvd3NlclByb3ZpZGVyIiwiY29ubmVjdGVkU2lnbmVyIiwiZ2V0U2lnbmVyIiwiZXJyb3IiLCJjb25zb2xlIiwib24iLCJyZW1vdmVMaXN0ZW5lciIsImNvbmZpZyIsImNvb2xNb2RlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.jsx\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@rainbow-me/rainbowkit":
/*!*****************************************!*\
  !*** external "@rainbow-me/rainbowkit" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = import("@rainbow-me/rainbowkit");;

/***/ }),

/***/ "ethers":
/*!*************************!*\
  !*** external "ethers" ***!
  \*************************/
/***/ ((module) => {

module.exports = import("ethers");;

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/chains":
/*!*******************************!*\
  !*** external "wagmi/chains" ***!
  \*******************************/
/***/ ((module) => {

module.exports = import("wagmi/chains");;

/***/ }),

/***/ "wagmi/providers/public":
/*!*****************************************!*\
  !*** external "wagmi/providers/public" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = import("wagmi/providers/public");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@rainbow-me"], () => (__webpack_exec__("./pages/_app.jsx")));
module.exports = __webpack_exports__;

})();