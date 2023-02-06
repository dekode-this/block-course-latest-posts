<?php
/**
 * Plugin Name:       Latest Posts Block
 * Description:       Display and filter latest posts..
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Dan
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       latest-posts
 *
 * @package           blocks-course
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */

function blocks_course_render_latest_posts_block($attributes) {
	$args = array (
		'posts_per_page' => $attributes['numberOfPosts'], // will access the numberOfPosts attribute from the block.json file
		'post_status' => 'publish', // will only show published posts
	);
	$recent_posts = get_posts($args);

	//var_dump($recent_posts); // this will render the array of posts to the screen.
	
	$posts = '<ul ' . get_block_wrapper_attributes() .'>';
	foreach ($recent_posts as $post) { // will loop through the array of posts and display them in a list. See https://www.w3schools.com/php/php_looping_foreach.asp
		$title = get_the_title($post); // will get the title of the post
		$title = $title ? $title : __('(No title)', 'latest-posts'); // if the post doesn't have a title, it will display (no title)
		$permalink = get_permalink($post); // will get the permalink of the post
		$excerpt = get_the_excerpt($post); // will get the excerpt of the post // $post is an object, so we can access the properties of the object
		//$posts .= '<li><a href="' . get_permalink($post->ID) . '">' . $post->post_title . '</a></li>';

		$posts .= '<li>';
		if($attributes["displayFeaturedImage"] && has_post_thumbnail( $post )) {
			$posts .= get_the_post_thumbnail( $post, 'large' );
		}
		//$posts .= '<img src="' . esc_url($attributes['url']) . '" alt="' . esc_attr($attributes['url']) . '" />';
		$posts .= '<h5><a href="' . esc_url($permalink) . '">' . $title . '</a></h5>';
		$posts .= '<time datetime="' . esc_attr(get_the_date('c', $post)) . '">' . esc_html(get_the_date('', $post)) . '</time>'; // will get the date of the post // passing an empty string to get_the_date() will return the date in the format set in the WordPress settings
		if(!empty($excerpt)) { // if the post has an excerpt, it will display it
			$posts .= '<p>' . $excerpt . '</p>'; // will display the excerpt of the post
		}
		$posts .= '</li>';
	}
	$posts .= '</ul>';

	// in the above code, between lines 31 and 35 explain to me why we have to decalre $posts on multiple lines?
	// why can't we just do $posts = '<ul ' . get_block_wrapper_attributes() .'><li><a href="' . get_permalink($post->ID) . '">' . $post->post_title . '</a></li></ul>';?
	//  I'm guessing it's because we want to be able to add more posts to the list, but I'm not sure why we would want to do that.
	// answer: we want to be able to add more posts to the list, but we also want to be able to add more attributes to the list, like the class name, etc.

	return $posts;
}

function blocks_course_latest_posts_block_init() {
	register_block_type_from_metadata( __DIR__, array(
		'render_callback' => 'blocks_course_render_latest_posts_block',
	));
}
add_action( 'init', 'blocks_course_latest_posts_block_init' );
