/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/edit.js":
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Edit": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/blob */ "@wordpress/blob");
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blob__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./editor.scss */ "./src/editor.scss");


 // eslint-disable-next-line @wordpress/no-unsafe-wp-apis



 // store is the store that contains the block editor data. Here I have renamed it to blockEditorStore.

 // Import useSelect hook from @wordpress/data which allows us to retrieve data from the store.





function Edit(_ref) {
  let {
    attributes,
    noticeUI,
    noticeOperations,
    setAttributes,
    isSelected
  } = _ref;
  const {
    id,
    url,
    alt,
    numberOfPosts,
    displayFeaturedImage,
    order,
    orderBy
  } = attributes;
  const posts = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    return select('core').getEntityRecords('postType', 'post', {
      // we are using the core store and we are using the getEntityRecords function.
      per_page: numberOfPosts,
      _embed: true,
      order,
      orderby: orderBy
    });
  }, [numberOfPosts, order, orderBy]); //When the number of posts changes we want to update the posts array. So we pass the numberOfPosts as the second arrgument to useSelect.

  const [blobURL, setBlobURL] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(); // the second arrgument is the setter for the state, The useState() function is left with an empty argument to set it as underfined to beggin.

  const prevURL = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__.usePrevious)(url);
  const prevIsSelected = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__.usePrevious)(isSelected); // this is how we get the previous value of 'isSelected'

  const imageObject = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    // we set a constant thats value is the useSelect function. This function accepts and argument that is a function.
    const {
      getMedia
    } = select('core'); // we select the core store and from the core store we want to use the getMedia function. We do this by destructuring.

    return id ? getMedia(id) : null; // we return the value of the image object. 
    //We are passing the id of our image from the block attributes const { name, bio, url, id, alt } = attributes;
    // This is an if statement id ? getMedia(id) : null. If id is true then return the media object for our image else retunr null.
  }, [id]); // useSelect accepts and second arrgument which is an array of dependencies (any value we depend on in our useSelect, which is this case is the image id)
  // we pass the id as the second arrguement becuase if we change the image we need to update the imageObject, we tell useSelect to update the object by passing it the id as the second arrgument 
  //console.log(imageObject);
  //console.log(imageObject)

  const imageSizes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    return select("core/block-editor").getSettings().imageSizes; // Here I am using the store that I have renamed to blockEditorStore.
  }, []); //console.log(imageSizes) // this will return an array of objects with the image sizes of the current theme.
  // why does the above console.log return undefined? I have imported the store as blockEditorStore and I am using it as blockEditorStore.
  // answer: I have to use the store name as it is defined in the store. In this case, it is 'core/block-editor'.

  const onSelectImage = image => {
    if (!image || !image.url) {
      setAttributes({
        url: undefined,
        id: undefined,
        alt: ''
      });
      return;
    }

    setAttributes({
      url: image.url,
      id: image.id,
      alt: image.alt
    }); //console.log(blobURL)
    //console.log(id)
  };

  const onSelectURL = newURL => {
    setAttributes({
      url: newURL,
      id: undefined,
      alt: ''
    });
  };

  const onUploadError = message => {
    noticeOperations.removeAllNotices(); // this clears the exisiting notices to avoid stacking when the isers attempts a new not allowed file type.

    noticeOperations.createErrorNotice(message); // create error notice is a function that is inside the Object noticeOperations.
  }; // Edge case if the user refreshes the browser while the image is still in blobURL status to prevent the spinner from endlessly spinning.


  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!id && (0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_6__.isBlobURL)(url)) {
      // if there is not id which indicates the image is not uploaded to the media library && and there is a blobURL then run this function.
      setAttributes({
        url: undefined,
        // clear the image url
        alt: '' // set the alt tag to be an empty string

      });
    }
  }, []); // passing an empty array of dependencies will prevent useEffect from running on every render. We only want to check for blobURLs when the component mounts for the first time aftet the user has refreshed the browser, so on first load this function clears any blobURL content.

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if ((0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_6__.isBlobURL)(url)) {
      // this if statement checks if the url is a blob url. If ture it will run the function
      setBlobURL(url); // so now stored in our 'state' we have a reference to the blob url even after it has left the DOM.
    } else {
      // once the state changes and the url is no longer a blob url but is an actual url we need to revoke the blob url to prevent a memory leak.
      (0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_6__.revokeBlobURL)(blobURL); // blobURL is the one we have store in the 'state'. See previous lines -> const [blobURL, setBlobURL] = useState();

      setBlobURL(undefined); // this clears url we stored out of the current 'state'
    }
  }, [url]); // this useEffect will run every time our url attribute changes, e.g. between blob url to actual url.

  const getImageSizeOptions = () => {
    if (!imageObject) return []; // if we don't have an image object just return an empty array

    const options = []; // otherwise define a new array options and this array we are going to populate options with label and values

    const sizes = imageObject.media_details.sizes;

    for (const key in sizes) {
      // https://www.w3schools.com/js/js_loop_forin.asp
      const size = sizes[key];
      const imageSize = imageSizes.find(s => s.slug === key); // using .find to check if the size title is in the theme image sizes as a slug

      if (imageSize) {
        // if imageSize is true, i.e. if the image size was found in the slugs
        options.push({
          //push to the options array
          label: imageSize.name,
          value: size.source_url
        }); // options will now be returned as an array of objects, 1 object for each image size that was found in the theme image sizes
        // the label will  be the size name and the value will be the specific image source url for that size image.
        // I can test this using console.log(options) and then running the getImageSizeOptions() function.
      }
    }

    return options;
  };

  const onChangeImageSize = newURL => {
    // this function is called in the image size select menu, it sets the image url to the new image size url when a new image size is selected in the select menu
    setAttributes({
      url: newURL
    });
  };

  const onChangeAlt = newAlt => {
    setAttributes({
      alt: newAlt
    });
  };

  const removeImage = () => {
    setAttributes({
      url: undefined,
      alt: '',
      id: undefined
    });
  };

  const allCats = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    // useSelect allows us to access the store and get data from it. In this case we are getting all the categories from the store.
    return select("core").getEntityRecords("taxonomy", "category", {
      per_page: -1
    });
  }, []); // allCats will never change so we pass an empty array as the second argument to useEffect. 
  //console.log(allCats)

  const catSuggestions = {}; // set up an empty object to store the categories in

  if (allCats) {
    // if allCats is true, i.e. if there are categories in the store
    for (let i = 0; i < allCats.length; i++) {
      // loop through the categories and increment i by 1 each time
      const cat = allCats[i]; // set cat to be the current category, this uses the index to access the category at each position in the allCats array
      //console.log(cat) // becuase allCats is an array of objects we can access and we have accessed each object using it's index this will log each category as a separate object

      catSuggestions[cat.name] = cat; // add the category name as a key and the category object as the value to the catSuggestions object

      console.log(catSuggestions);
    }
  } // this will log an object with the category names as keys and the category objects as values
  // how does the above function work?
  // we are looping through the categories and adding the category name as a key and the category object as the value to the catSuggestions object.


  const onCategoryChange = values => {
    // values is an array of the selected categories
    const hasNoSuggestions = values.some(value => typeof value === 'string' && !catSuggestions[value]); // check if the value typed has no suggestions. .some() will accept a callback function and will return true if any of the values in the array pass the test in the callback function. If true was returned for any iteration on the values array then hasNoSuggestions will be true. We use typeof to check if the value is a string and then we check if the value is not in the catSuggestions object.

    if (hasNoSuggestions) return; // if hasNoSuggestions is true then return which will stop the function from running.

    const updatedCats = values.map(token => {
      // map through the values array and return a new array of updated categories
      return typeof token === 'string' ? catSuggestions[token] : token; // if the token is a string then return the category object from the catSuggestions object. If the token is not a string then return the token.
    }); //console.log(updatedCats);
  };

  const onDisplayFeaturedImageChange = value => {
    setAttributes({
      displayFeaturedImage: value
    });
  };

  const onNumberOfItemsChange = value => {
    setAttributes({
      numberOfPosts: value
    });
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.PanelBody, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Display Featired Image", "latest-posts"),
    checked: displayFeaturedImage // this is the state of the toggle control. If it is true then the toggle control will be checked.
    ,
    onChange: onDisplayFeaturedImageChange // this is the function that will run when the toggle control is clicked. It will toggle the state of the toggle control.

  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.QueryControls, {
    numberOfItems: numberOfPosts,
    onNumberOfItemsChange: onNumberOfItemsChange,
    maxItems: 10,
    minItems: 1,
    orderBy: "orderBy",
    onOrderByChange: value => setAttributes({
      orderBy: value
    }) // inline function to set the order by attribute to the value of the select menu
    ,
    order: "order",
    onOrderChange: value => setAttributes({
      order: value
    }) // inline function to set the order attribute to the value of the select menu
    ,
    categorySuggestions: catSuggestions // this is the object of categories we created above
    ,
    selectedCategories: [],
    onCategoryChange: onCategoryChange
  }), url && !(0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_6__.isBlobURL)(url) && //if url of the image is true and it is not a blobURL then display the Alt Text box
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.TextareaControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Alt Text', 'latest-posts'),
    value: alt,
    onChange: onChangeAlt,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Alternative text describes your image to people can't see it. Add a short description with its key details.", 'latest-posts')
  }))), url && // if there is an image (if url is true) display the block controls else don't
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, {
    group: "inline"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaReplaceFlow, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Replace Image", "latest-posts"),
    onSelect: onSelectImage // this handles both upload and insert from media library
    ,
    onSelectURL: onSelectURL,
    onError: onUploadError,
    accept: "image/*",
    allowedTypes: ['image'],
    mediaId: id // these 2 lines will ensure the current image is selected when the media library is opened
    ,
    mediaURL: url
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.ToolbarButton, {
    onClick: removeImage
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Remove Image", "latest-posts"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)(), posts && posts.map(post => {
    // this is where we loop through the posts and display them if posts returns true. .map() is a built in array method that loops through an array and returns a new array with the same number of items.
    const featuredImage = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0 && post._embedded['wp:featuredmedia'][0];
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      key: post.id
    }, " ", displayFeaturedImage && featuredImage && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: featuredImage.media_details.sizes.large.source_url,
      alt: featuredImage.alt_text
    }), " ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h5", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: post.link
    }, post.title.rendered ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.RawHTML, null, post.title.rendered) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('(No title)', 'latest-posts'))), post.date_gmt && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("time", {
      dateTime: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_2__.format)('c', post.date_gmt)
    }, (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_2__.dateI18n)((0,_wordpress_date__WEBPACK_IMPORTED_MODULE_2__.__experimentalGetSettings)().formats.date, post.date_gmt)), post.excerpt.rendered && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.RawHTML, null, post.excerpt.rendered));
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)(), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Boilerplate – hello from the editor!', 'boilerplate'), url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `wp-block-blocks-course-team-member-img${(0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_6__.isBlobURL)(url) ? ' is-loading' : ''}` // note the space, it will add it as a separate class instead of appending it.

  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: url,
    alt: alt
  }), (0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_6__.isBlobURL)(url) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.Spinner, null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaPlaceholder, {
    icon: "admin-users",
    onSelect: onSelectImage // this handles both upload and insert from media library
    ,
    onSelectURL: onSelectURL,
    onError: onUploadError,
    accept: "image/*",
    allowedTypes: ['image'],
    disableMediaButtons: url,
    notices: noticeUI // this is the prop to display the error message using withNotices Higher Order Component

  })));
}
/* harmony default export */ __webpack_exports__["default"] = ((0,_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.withNotices)(Edit));

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/save.js");




(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('blocks-course/latest-posts', {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/save.js":
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ save; }
/* harmony export */ });
function save() {
  return null;
}

/***/ }),

/***/ "./src/editor.scss":
/*!*************************!*\
  !*** ./src/editor.scss ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/blob":
/*!******************************!*\
  !*** external ["wp","blob"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["blob"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/date":
/*!******************************!*\
  !*** external ["wp","date"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["date"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["i18n"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkboilerplate"] = self["webpackChunkboilerplate"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["style-index"], function() { return __webpack_require__("./src/index.js"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map