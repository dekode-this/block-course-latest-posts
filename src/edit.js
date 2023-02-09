import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { format, dateI18n, __experimentalGetSettings } from '@wordpress/date';
import { useEffect, useState, useRef } from '@wordpress/element';
import {
	useBlockProps,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	store as blockEditorStore
} from '@wordpress/block-editor'; // store is the store that contains the block editor data. Here I have renamed it to blockEditorStore.
import { useSelect } from '@wordpress/data'; // Import useSelect hook from @wordpress/data which allows us to retrieve data from the store.
import { usePrevious } from '@wordpress/compose';
import { isBlobURL, revokeBlobURL } from "@wordpress/blob";
import {
	Spinner,
	withNotices,
	ToolbarButton,
	PanelBody,
	ToggleControl,
	QueryControls,
	TextareaControl,
	SelectControl,
	Icon,
	Tooltip,
	TextControl,
	Button,
} from "@wordpress/components";
import './editor.scss';

export function Edit({ attributes, noticeUI, noticeOperations, setAttributes, isSelected }) {
	const { id, url, alt, numberOfPosts, displayFeaturedImage, order, orderBy, categories } = attributes; // categories is an array of category objects and needs to be converted into an array of category IDs. see function below.

	const catIDs = categories && categories.length > 0 ? categories.map((cat) => cat.id) : []; // we are mapping over the categories array and returning the ID of each category object. This is an array of category IDs. First we check if categories is true, then we use .length to check if the array has any items. If it does we map over the array and return the ID of each category object. If the array is empty we return an empty array.

	const posts = useSelect((select) => {
		return select('core').getEntityRecords('postType', 'post', { // we are using the core store and we are using the getEntityRecords function.
			per_page: numberOfPosts,
			_embed: true,
			order,
			orderby: orderBy,
			categories: catIDs // we are passing the categories attribute to the getEntityRecords function. This will filter the posts by category.
		});
	}, [numberOfPosts, order, orderBy, categories]); //When the number of posts changes we want to update the posts array. So we pass the numberOfPosts as the second arrgument to useSelect.

	const [blobURL, setBlobURL] = useState(); // the second arrgument is the setter for the state, The useState() function is left with an empty argument to set it as underfined to beggin.
	const prevURL = usePrevious(url);
	const prevIsSelected = usePrevious(isSelected); // this is how we get the previous value of 'isSelected'

	const imageObject = useSelect((select) => { // we set a constant thats value is the useSelect function. This function accepts and argument that is a function.
		const { getMedia } = select('core'); // we select the core store and from the core store we want to use the getMedia function. We do this by destructuring.
		return id ? getMedia(id) : null // we return the value of the image object. 
		//We are passing the id of our image from the block attributes const { name, bio, url, id, alt } = attributes;
		// This is an if statement id ? getMedia(id) : null. If id is true then return the media object for our image else retunr null.
	}, [id]); // useSelect accepts and second arrgument which is an array of dependencies (any value we depend on in our useSelect, which is this case is the image id)
	// we pass the id as the second arrguement becuase if we change the image we need to update the imageObject, we tell useSelect to update the object by passing it the id as the second arrgument 
	//console.log(imageObject);

	//console.log(imageObject)

	const imageSizes = useSelect((select) => {
		return select("core/block-editor").getSettings().imageSizes; // Here I am using the store that I have renamed to blockEditorStore.
	}, []);

	//console.log(imageSizes) // this will return an array of objects with the image sizes of the current theme.
	// why does the above console.log return undefined? I have imported the store as blockEditorStore and I am using it as blockEditorStore.
	// answer: I have to use the store name as it is defined in the store. In this case, it is 'core/block-editor'.

	const onSelectImage = (image) => {
		if (!image || !image.url) {
			setAttributes({ url: undefined, id: undefined, alt: '' });
			return;
		}
		setAttributes({ url: image.url, id: image.id, alt: image.alt });
		//console.log(blobURL)
		//console.log(id)
	};

	const onSelectURL = (newURL) => {
		setAttributes({
			url: newURL,
			id: undefined,
			alt: '',
		});
	};

	const onUploadError = (message) => {
		noticeOperations.removeAllNotices(); // this clears the exisiting notices to avoid stacking when the isers attempts a new not allowed file type.
		noticeOperations.createErrorNotice(message) // create error notice is a function that is inside the Object noticeOperations.
	};

	// Edge case if the user refreshes the browser while the image is still in blobURL status to prevent the spinner from endlessly spinning.
	useEffect(() => {
		if (!id && isBlobURL(url)) { // if there is not id which indicates the image is not uploaded to the media library && and there is a blobURL then run this function.
			setAttributes({
				url: undefined, // clear the image url
				alt: '' // set the alt tag to be an empty string
			})
		}
	}, []) // passing an empty array of dependencies will prevent useEffect from running on every render. We only want to check for blobURLs when the component mounts for the first time aftet the user has refreshed the browser, so on first load this function clears any blobURL content.

	useEffect(() => {
		if (isBlobURL(url)) { // this if statement checks if the url is a blob url. If ture it will run the function
			setBlobURL(url); // so now stored in our 'state' we have a reference to the blob url even after it has left the DOM.
		} else { // once the state changes and the url is no longer a blob url but is an actual url we need to revoke the blob url to prevent a memory leak.
			revokeBlobURL(blobURL); // blobURL is the one we have store in the 'state'. See previous lines -> const [blobURL, setBlobURL] = useState();
			setBlobURL(undefined); // this clears url we stored out of the current 'state'
		}
	}, [url]) // this useEffect will run every time our url attribute changes, e.g. between blob url to actual url.

	const getImageSizeOptions = () => {
		if (!imageObject) return [] // if we don't have an image object just return an empty array
		const options = []; // otherwise define a new array options and this array we are going to populate options with label and values
		const sizes = imageObject.media_details.sizes;
		for (const key in sizes) { // https://www.w3schools.com/js/js_loop_forin.asp
			const size = sizes[key];
			const imageSize = imageSizes.find(s => s.slug === key); // using .find to check if the size title is in the theme image sizes as a slug
			if (imageSize) { // if imageSize is true, i.e. if the image size was found in the slugs
				options.push({ //push to the options array
					label: imageSize.name,
					value: size.source_url,
				});
				// options will now be returned as an array of objects, 1 object for each image size that was found in the theme image sizes
				// the label will  be the size name and the value will be the specific image source url for that size image.
				// I can test this using console.log(options) and then running the getImageSizeOptions() function.
			}
		}
		return options;
	};

	const onChangeImageSize = (newURL) => { // this function is called in the image size select menu, it sets the image url to the new image size url when a new image size is selected in the select menu
		setAttributes({ url: newURL });
	}

	const onChangeAlt = (newAlt) => {
		setAttributes({ alt: newAlt });
	}

	const removeImage = () => {
		setAttributes({
			url: undefined,
			alt: '',
			id: undefined
		})
	};

	const allCats = useSelect((select) => { // useSelect allows us to access the store and get data from it. In this case we are getting all the categories from the store.
		return select("core").getEntityRecords("taxonomy", "category", {
			per_page: -1,
		});
	}, []); // allCats will never change so we pass an empty array as the second argument to useSelect to prevent it from running on every render.

	//console.log(allCats)

	const catSuggestions = {}; // set up an empty object to store the categories in
	if (allCats) { // if allCats is true, i.e. if there are categories in the store
		for (let i = 0; i < allCats.length; i++) { // loop through the categories and increment i by 1 each time
			const cat = allCats[i]; // set cat to be the current category, this uses the index to access the category at each position in the allCats array
			//console.log(cat) // becuase allCats is an array of objects we can access and we have accessed each object using it's index this will log each category as a separate object
			catSuggestions[cat.name] = cat; // add the category name as a key and the category object as the value to the catSuggestions object
			//console.log(catSuggestions) // will log an object with the category names as keys and the category objects as values
			// why does the above console.log run every time I scroll? Because the for loop is running every time I scroll and the catSuggestions object is being updated each time.
			// why does the for loop run every time I scroll? Because the allCats array is being updated each time I scroll.
			// why is the allCats array being updated each time I scroll? Because the useSelect hook is running on every render. Why is the useSelect hook running on every render? Because we are not passing an empty array as the second argument to useSelect. We need to pass an empty array as the second argument to useSelect to prevent it from running on every render.
		}
	}

	// this will log an object with the category names as keys and the category objects as values

	// how does the above function work?
	// we are looping through the categories and adding the category name as a key and the category object as the value to the catSuggestions object.

	const onCategoryChange = (values) => { // values is an array of the selected categories
		const hasNoSuggestions = values.some(
			(value) => typeof value === 'string' && !catSuggestions[value]
		); // check if the value typed has no suggestions. .some() will accept a callback function and will return true if any of the values in the array pass the test in the callback function. If true was returned for any iteration on the values array then hasNoSuggestions will be true. We use typeof to check if the value is a string and then we check if the value is not in the catSuggestions object.
		if (hasNoSuggestions) return; // if hasNoSuggestions is true then return which will stop the function from running.

		const updatedCats = values.map((token) => { // map through the values array and return a new array of updated categories
			return typeof token === 'string' ? catSuggestions[token] : token; // if the token is a string then return the category object from the catSuggestions object. If the token is not a string then return the token.
		});

		setAttributes({ categories: updatedCats }); // set the categories attribute to the updatedCats array
	};

	const onDisplayFeaturedImageChange = (value) => {
		setAttributes({ displayFeaturedImage: value });
	}

	const onNumberOfItemsChange = (value) => {
		setAttributes({ numberOfPosts: value });
	}

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleControl label={__("Display Featired Image", "latest-posts")}
						checked={displayFeaturedImage} // this is the state of the toggle control. If it is true then the toggle control will be checked.
						onChange={onDisplayFeaturedImageChange} // this is the function that will run when the toggle control is clicked. It will toggle the state of the toggle control.
					/>
					<QueryControls
						numberOfItems={numberOfPosts}
						onNumberOfItemsChange={onNumberOfItemsChange}
						maxItems={10}
						minItems={1}
						orderBy={orderBy}
						onOrderByChange={(value) =>
							setAttributes({ orderBy: value })
						} // inline function to set the order by attribute to the value of the select menu
						order={order}
						onOrderChange={(value) =>
							setAttributes({ order: value })
						} // inline function to set the order attribute to the value of the select menu
						categorySuggestions={catSuggestions} // this is the object of categories we created above
						selectedCategories={categories} // this is the array of selected categories that comes from the onCategoryChange function
						onCategoryChange={onCategoryChange}
						values={categories}
					/>
					{url && !isBlobURL(url) && ( //if url of the image is true and it is not a blobURL then display the Alt Text box
						<TextareaControl
							label={__('Alt Text', 'latest-posts')}
							value={alt}
							onChange={onChangeAlt}
							help={__(
								"Alternative text describes your image to people can't see it. Add a short description with its key details.",
								'latest-posts'
							)}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			{url && ( // if there is an image (if url is true) display the block controls else don't
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__("Replace Image", "latest-posts")}
						onSelect={onSelectImage} // this handles both upload and insert from media library
						onSelectURL={onSelectURL}
						onError={onUploadError}
						accept="image/*"
						allowedTypes={['image']}
						mediaId={id} // these 2 lines will ensure the current image is selected when the media library is opened
						mediaURL={url}
					/>
					<ToolbarButton onClick={removeImage}>
						{__("Remove Image", "latest-posts")}
					</ToolbarButton>
				</BlockControls>
			)}
			<ul {...useBlockProps()}>
				{posts &&
					posts.map((post) => { // this is where we loop through the posts and display them if posts returns true. .map() is a built in array method that loops through an array and returns a new array with the same number of items.
						const featuredImage =
							post._embedded &&
							post._embedded['wp:featuredmedia'] &&
							post._embedded['wp:featuredmedia'].length > 0 &&
							post._embedded['wp:featuredmedia'][0];
						return (
							<li key={post.id}> {/* this is the key prop that react needs to know which item in the array is which. It needs to be unique so we use the post id. If you run wp.select('core').getEntityRecords('postType', 'post', { per_page: numberOfPosts, _embed: true }); in the console this is where you get post.id from, it's the REST API */}
								{displayFeaturedImage && featuredImage && (
									<img
										src={
											featuredImage.media_details.sizes
												.large.source_url
										}
										alt={featuredImage.alt_text}
									/>
								)} {/* this is the featured image, if displayFeaturedImage is true then display the image, otherwise don't. The image is from the REST API, you can see it in the console when you run the above code */}
								<h5>
									<a href={post.link}>
										{post.title.rendered ? (
											<RawHTML>
												{post.title.rendered}
											</RawHTML>
										) : (
											__('(No title)', 'latest-posts')
										)}
									</a>
								</h5>
								{post.date_gmt && (
									<time dateTime={format('c', post.date_gmt)}>
										{dateI18n(
											__experimentalGetSettings().formats
												.date,
											post.date_gmt
										)}
									</time>
								)}
								{post.excerpt.rendered && (
									<RawHTML>{post.excerpt.rendered}</RawHTML>
								)}
							</li>
						)
					})}
			</ul>
			<div {...useBlockProps()}>
				{__('Boilerplate – hello from the editor!', 'boilerplate')}
				{url && (
					<div className={`wp-block-blocks-course-team-member-img${isBlobURL(url) ? ' is-loading' : ''}`} // note the space, it will add it as a separate class instead of appending it.
					>
						<img src={url} alt={alt} />
						{isBlobURL(url) && <Spinner />}
					</div>
				)}
				<MediaPlaceholder
					icon="admin-users"
					onSelect={onSelectImage} // this handles both upload and insert from media library
					onSelectURL={onSelectURL}
					onError={onUploadError}
					accept="image/*"
					allowedTypes={['image']}
					disableMediaButtons={url}
					notices={noticeUI} // this is the prop to display the error message using withNotices Higher Order Component
				/>
			</div>
		</>
	);
}

export default withNotices(Edit);
