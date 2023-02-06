import { __ } from '@wordpress/i18n';
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
	TextareaControl,
	SelectControl,
	Icon,
	Tooltip,
	TextControl,
	Button,
} from "@wordpress/components";
import './editor.scss';

export function Edit({ attributes, noticeUI, noticeOperations, setAttributes, isSelected }) {
	const { id, url, alt, numberOfPosts } = attributes;

	const posts = useSelect((select) => {
		return select('core').getEntityRecords('postType', 'post', {
			per_page: numberOfPosts,
			_embed: true
		});
	}, [numberOfPosts]); //When the number of posts changes we want to update the posts array. So we pass the numberOfPosts as the second arrgument to useSelect.
	console.log(posts);
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

	return (
		<>
			<InspectorControls>
				<PanelBody>
					{url && !isBlobURL(url) && ( //if url of the image is true and it is not a blobURL then display the Alt Text box
						<TextareaControl
							label={__('Alt Text', 'team-merbers')}
							value={alt}
							onChange={onChangeAlt}
							help={__(
								"Alternative text describes your image to people can't see it. Add a short description with its key details.",
								'team-members'
							)}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			{url && ( // if there is an image (if url is true) display the block controls else don't
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__("Replace Image", "team-members")}
						onSelect={onSelectImage} // this handles both upload and insert from media library
						onSelectURL={onSelectURL}
						onError={onUploadError}
						accept="image/*"
						allowedTypes={['image']}
						mediaId={id} // these 2 lines will ensure the current image is selected when the media library is opened
						mediaURL={url}
					/>
					<ToolbarButton onClick={removeImage}>
						{__("Remove Image", "team-members")}
					</ToolbarButton>
				</BlockControls>
			)}
			<ul {...useBlockProps()}>
				{posts && posts.map((posts) => { // this is where we loop through the posts and display them if posts returns true. .map() is a built in array method that loops through an array and returns a new array with the same number of items.
					return (
						<li key={posts.id}> {/* this is the key prop that react needs to know which item in the array is which. It needs to be unique so we use the post id. If you run wp.select('core').getEntityRecords('postType', 'post', { per_page: numberOfPosts, _embed: true }); in the console this is where you get post.id from, it's the REST API */}
							<h5>
								<a href={posts.link}>
									{posts.title.rendered ? posts.title.rendered : 'No title'}
								</a> {/* again these are from the REST API, you can see them in the console when you run the above code */}
							</h5>
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
