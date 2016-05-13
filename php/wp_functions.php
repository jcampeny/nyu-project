<?php
/**
 * Twenty Sixteen functions and definitions
 *
 * Set up the theme and provides some helper functions, which are used in the
 * theme as custom template tags. Others are attached to action and filter
 * hooks in WordPress to change core functionality.
 *
 * When using a child theme you can override certain functions (those wrapped
 * in a function_exists() call) by defining them first in your child theme's
 * functions.php file. The child theme's functions.php file is included before
 * the parent theme's file, so the child theme functions would be used.
 *
 * @link https://codex.wordpress.org/Theme_Development
 * @link https://codex.wordpress.org/Child_Themes
 *
 * Functions that are not pluggable (not wrapped in function_exists()) are
 * instead attached to a filter or action hook.
 *
 * For more information on hooks, actions, and filters,
 * {@link https://codex.wordpress.org/Plugin_API}
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */

/**
 * Twenty Sixteen only works in WordPress 4.4 or later.
 */
if ( version_compare( $GLOBALS['wp_version'], '4.4-alpha', '<' ) ) {
	require get_template_directory() . '/inc/back-compat.php';
}

if ( ! function_exists( 'twentysixteen_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 *
 * Create your own twentysixteen_setup() function to override in a child theme.
 *
 * @since Twenty Sixteen 1.0
 */
function twentysixteen_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on Twenty Sixteen, use a find and replace
	 * to change 'twentysixteen' to the name of your theme in all the template files
	 */
	load_theme_textdomain( 'twentysixteen', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for custom logo.
	 *
	 *  @since Twenty Sixteen 1.2
	 */
	add_theme_support( 'custom-logo', array(
		'height'      => 240,
		'width'       => 240,
		'flex-height' => true,
	) );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 1200, 9999 );

	// This theme uses wp_nav_menu() in two locations.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'twentysixteen' ),
		'social'  => __( 'Social Links Menu', 'twentysixteen' ),
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 *
	 * See: https://codex.wordpress.org/Post_Formats
	 */
	add_theme_support( 'post-formats', array(
		'aside',
		'image',
		'video',
		'quote',
		'link',
		'gallery',
		'status',
		'audio',
		'chat',
	) );

	/*
	 * This theme styles the visual editor to resemble the theme style,
	 * specifically font, colors, icons, and column width.
	 */
	add_editor_style( array( 'css/editor-style.css', twentysixteen_fonts_url() ) );

	// Indicate widget sidebars can use selective refresh in the Customizer.
	add_theme_support( 'customize-selective-refresh-widgets' );
}
endif; // twentysixteen_setup
add_action( 'after_setup_theme', 'twentysixteen_setup' );

/**
 * Sets the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 *
 * @since Twenty Sixteen 1.0
 */
function twentysixteen_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'twentysixteen_content_width', 840 );
}
add_action( 'after_setup_theme', 'twentysixteen_content_width', 0 );

/**
 * Registers a widget area.
 *
 * @link https://developer.wordpress.org/reference/functions/register_sidebar/
 *
 * @since Twenty Sixteen 1.0
 */
function twentysixteen_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'twentysixteen' ),
		'id'            => 'sidebar-1',
		'description'   => __( 'Add widgets here to appear in your sidebar.', 'twentysixteen' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => __( 'Content Bottom 1', 'twentysixteen' ),
		'id'            => 'sidebar-2',
		'description'   => __( 'Appears at the bottom of the content on posts and pages.', 'twentysixteen' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => __( 'Content Bottom 2', 'twentysixteen' ),
		'id'            => 'sidebar-3',
		'description'   => __( 'Appears at the bottom of the content on posts and pages.', 'twentysixteen' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'twentysixteen_widgets_init' );

if ( ! function_exists( 'twentysixteen_fonts_url' ) ) :
/**
 * Register Google fonts for Twenty Sixteen.
 *
 * Create your own twentysixteen_fonts_url() function to override in a child theme.
 *
 * @since Twenty Sixteen 1.0
 *
 * @return string Google fonts URL for the theme.
 */
function twentysixteen_fonts_url() {
	$fonts_url = '';
	$fonts     = array();
	$subsets   = 'latin,latin-ext';

	/* translators: If there are characters in your language that are not supported by Merriweather, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Merriweather font: on or off', 'twentysixteen' ) ) {
		$fonts[] = 'Merriweather:400,700,900,400italic,700italic,900italic';
	}

	/* translators: If there are characters in your language that are not supported by Montserrat, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Montserrat font: on or off', 'twentysixteen' ) ) {
		$fonts[] = 'Montserrat:400,700';
	}

	/* translators: If there are characters in your language that are not supported by Inconsolata, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Inconsolata font: on or off', 'twentysixteen' ) ) {
		$fonts[] = 'Inconsolata:400';
	}

	if ( $fonts ) {
		$fonts_url = add_query_arg( array(
			'family' => urlencode( implode( '|', $fonts ) ),
			'subset' => urlencode( $subsets ),
		), 'https://fonts.googleapis.com/css' );
	}

	return $fonts_url;
}
endif;

/**
 * Handles JavaScript detection.
 *
 * Adds a `js` class to the root `<html>` element when JavaScript is detected.
 *
 * @since Twenty Sixteen 1.0
 */
function twentysixteen_javascript_detection() {
	echo "<script>(function(html){html.className = html.className.replace(/\bno-js\b/,'js')})(document.documentElement);</script>\n";
}
add_action( 'wp_head', 'twentysixteen_javascript_detection', 0 );

/**
 * Enqueues scripts and styles.
 *
 * @since Twenty Sixteen 1.0
 */
function twentysixteen_scripts() {
	// Add custom fonts, used in the main stylesheet.
	wp_enqueue_style( 'twentysixteen-fonts', twentysixteen_fonts_url(), array(), null );

	// Add Genericons, used in the main stylesheet.
	wp_enqueue_style( 'genericons', get_template_directory_uri() . '/genericons/genericons.css', array(), '3.4.1' );

	// Theme stylesheet.
	wp_enqueue_style( 'twentysixteen-style', get_stylesheet_uri() );

	// Load the Internet Explorer specific stylesheet.
	wp_enqueue_style( 'twentysixteen-ie', get_template_directory_uri() . '/css/ie.css', array( 'twentysixteen-style' ), '20160412' );
	wp_style_add_data( 'twentysixteen-ie', 'conditional', 'lt IE 10' );

	// Load the Internet Explorer 8 specific stylesheet.
	wp_enqueue_style( 'twentysixteen-ie8', get_template_directory_uri() . '/css/ie8.css', array( 'twentysixteen-style' ), '20160412' );
	wp_style_add_data( 'twentysixteen-ie8', 'conditional', 'lt IE 9' );

	// Load the Internet Explorer 7 specific stylesheet.
	wp_enqueue_style( 'twentysixteen-ie7', get_template_directory_uri() . '/css/ie7.css', array( 'twentysixteen-style' ), '20160412' );
	wp_style_add_data( 'twentysixteen-ie7', 'conditional', 'lt IE 8' );

	// Load the html5 shiv.
	wp_enqueue_script( 'twentysixteen-html5', get_template_directory_uri() . '/js/html5.js', array(), '3.7.3' );
	wp_script_add_data( 'twentysixteen-html5', 'conditional', 'lt IE 9' );

	wp_enqueue_script( 'twentysixteen-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20160412', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	if ( is_singular() && wp_attachment_is_image() ) {
		wp_enqueue_script( 'twentysixteen-keyboard-image-navigation', get_template_directory_uri() . '/js/keyboard-image-navigation.js', array( 'jquery' ), '20160412' );
	}

	wp_enqueue_script( 'twentysixteen-script', get_template_directory_uri() . '/js/functions.js', array( 'jquery' ), '20160412', true );

	wp_localize_script( 'twentysixteen-script', 'screenReaderText', array(
		'expand'   => __( 'expand child menu', 'twentysixteen' ),
		'collapse' => __( 'collapse child menu', 'twentysixteen' ),
	) );
}
add_action( 'wp_enqueue_scripts', 'twentysixteen_scripts' );

/**
 * Adds custom classes to the array of body classes.
 *
 * @since Twenty Sixteen 1.0
 *
 * @param array $classes Classes for the body element.
 * @return array (Maybe) filtered body classes.
 */
function twentysixteen_body_classes( $classes ) {
	// Adds a class of custom-background-image to sites with a custom background image.
	if ( get_background_image() ) {
		$classes[] = 'custom-background-image';
	}

	// Adds a class of group-blog to sites with more than 1 published author.
	if ( is_multi_author() ) {
		$classes[] = 'group-blog';
	}

	// Adds a class of no-sidebar to sites without active sidebar.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	return $classes;
}
add_filter( 'body_class', 'twentysixteen_body_classes' );

/**
 * Converts a HEX value to RGB.
 *
 * @since Twenty Sixteen 1.0
 *
 * @param string $color The original color, in 3- or 6-digit hexadecimal form.
 * @return array Array containing RGB (red, green, and blue) values for the given
 *               HEX code, empty array otherwise.
 */
function twentysixteen_hex2rgb( $color ) {
	$color = trim( $color, '#' );

	if ( strlen( $color ) === 3 ) {
		$r = hexdec( substr( $color, 0, 1 ).substr( $color, 0, 1 ) );
		$g = hexdec( substr( $color, 1, 1 ).substr( $color, 1, 1 ) );
		$b = hexdec( substr( $color, 2, 1 ).substr( $color, 2, 1 ) );
	} else if ( strlen( $color ) === 6 ) {
		$r = hexdec( substr( $color, 0, 2 ) );
		$g = hexdec( substr( $color, 2, 2 ) );
		$b = hexdec( substr( $color, 4, 2 ) );
	} else {
		return array();
	}

	return array( 'red' => $r, 'green' => $g, 'blue' => $b );
}

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Add custom image sizes attribute to enhance responsive image functionality
 * for content images
 *
 * @since Twenty Sixteen 1.0
 *
 * @param string $sizes A source size value for use in a 'sizes' attribute.
 * @param array  $size  Image size. Accepts an array of width and height
 *                      values in pixels (in that order).
 * @return string A source size value for use in a content image 'sizes' attribute.
 */
function twentysixteen_content_image_sizes_attr( $sizes, $size ) {
	$width = $size[0];

	840 <= $width && $sizes = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 62vw, 840px';

	if ( 'page' === get_post_type() ) {
		840 > $width && $sizes = '(max-width: ' . $width . 'px) 85vw, ' . $width . 'px';
	} else {
		840 > $width && 600 <= $width && $sizes = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 61vw, (max-width: 1362px) 45vw, 600px';
		600 > $width && $sizes = '(max-width: ' . $width . 'px) 85vw, ' . $width . 'px';
	}

	return $sizes;
}
add_filter( 'wp_calculate_image_sizes', 'twentysixteen_content_image_sizes_attr', 10 , 2 );

/**
 * Add custom image sizes attribute to enhance responsive image functionality
 * for post thumbnails
 *
 * @since Twenty Sixteen 1.0
 *
 * @param array $attr Attributes for the image markup.
 * @param int   $attachment Image attachment ID.
 * @param array $size Registered image size or flat array of height and width dimensions.
 * @return string A source size value for use in a post thumbnail 'sizes' attribute.
 */
function twentysixteen_post_thumbnail_sizes_attr( $attr, $attachment, $size ) {
	if ( 'post-thumbnail' === $size ) {
		is_active_sidebar( 'sidebar-1' ) && $attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 60vw, (max-width: 1362px) 62vw, 840px';
		! is_active_sidebar( 'sidebar-1' ) && $attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 88vw, 1200px';
	}
	return $attr;
}
add_filter( 'wp_get_attachment_image_attributes', 'twentysixteen_post_thumbnail_sizes_attr', 10 , 3 );

/**
 * Modifies tag cloud widget arguments to have all tags in the widget same font size.
 *
 * @since Twenty Sixteen 1.1
 *
 * @param array $args Arguments for tag cloud widget.
 * @return array A new modified arguments.
 */
function twentysixteen_widget_tag_cloud_args( $args ) {
	$args['largest'] = 1;
	$args['smallest'] = 1;
	$args['unit'] = 'em';
	return $args;
}
add_filter( 'widget_tag_cloud_args', 'twentysixteen_widget_tag_cloud_args' );

/**
 *
 *
 *Custom post type Message
 *
 *
 */

function Custom_post_Message() {
    $labels = array(
        'name'                  => _x( 'Messages', 'Post Type General Name', 'text_domain' ),
        'singular_name'         => _x( 'Message', 'Post Type Singular Name', 'text_domain' ),
        'menu_name'             => __( 'Message', 'text_domain' ),
        'name_admin_bar'        => __( 'Message', 'text_domain' ),
        'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
        'all_items'             => __( 'All Items', 'text_domain' ),
        'add_new_item'          => __( 'Message', 'text_domain' ),
        'add_new'               => __( 'Add New', 'text_domain' ),
        'new_item'              => __( 'New Item', 'text_domain' ),
        'edit_item'             => __( 'Message information', 'text_domain' ),
        'update_item'           => __( 'Update Item', 'text_domain' ),
        'view_item'             => __( 'View Item', 'text_domain' ),
        'search_items'          => __( 'Search Item', 'text_domain' ),
        'not_found'             => __( 'Not found', 'text_domain' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
        'items_list'            => __( 'Items list', 'text_domain' ),
        'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
        'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
    );
    $args = array(
        'label'                 => __( 'Message', 'text_domain' ),
        'description'           => __( 'Custom post Message', 'text_domain' ),
        'labels'                => $labels,
        'supports'              => array(  ),
        'hierarchical'          => false,
        'public'                => true,
        'menu_icon'				=> 'dashicons-email-alt',
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 28,
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,        
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'page', 
        'capabilities' => array(
		    'create_posts' => false // Removes support for the "Add New" function ( use 'do_not_allow' instead of false for multisite set ups )
		  ),
  		'map_meta_cap' => true
    );
    register_post_type('message', $args );

}
add_action( 'init', 'Custom_post_Message', 0 );
add_action("admin_init", "admin_init_message");
add_action('save_post', 'save_details_message');

function admin_init_message(){
  add_meta_box("metaBox_message", "Details", "metaBox_message", "message", "normal", "low");
}

function metaBox_message() {
  global $post;
  $custom = get_post_custom($post->ID);
  $name_message = $custom["name_message"][0];
  $email_message = $custom["email_message"][0];
  $company_message = $custom["company_message"][0];
  $interest_message = $custom["interest_message"][0];
  $content_message = $custom["content_message"][0];
  $note_message = $custom["note_message"][0];

  $settings = array(
    'media_buttons' => false,
    'teeny' => true
    );
  ?>
  <p><label>Notes:</label><br />
  <?php wp_editor( $note_message, "note_message", $settings);?>
  <div style="display: none;">
  <style type="text/css">
  	#wp-content-wrap,
  	#post-body-content/*,
  	#publishing-action*/{
  		display: none;
  	}

  </style>
  <p><label>Analytics:</label><br />
  <?php wp_editor( $name_message, "name_message", $settings);?>
  <p><label>Technology:</label><br />
  <?php wp_editor( $email_message, "email_message", $settings);?>
  <p><label>Bussines:</label><br />
  <?php wp_editor( $company_message, "company_message", $settings);?>
  <p><label>Technology:</label><br />
  <?php wp_editor( $interest_message, "interest_message", $settings);?>
  <p><label>Bussines:</label><br />
  <?php wp_editor( $content_message, "content_message", $settings);?>
  </div>
    <p><label>Name:</label><input style="width: 100%; min-height: 30px;" type="text" name="name" value="<?php echo $name_message?>" readonly></p>
    <p><label>Email:</label><input style="width: 100%; min-height: 30px;" type="text" name="email" value="<?php echo $email_message ?>" readonly></p>
	<p><label>Company:</label><input style="width: 100%; min-height: 30px;" type="text" name="company" value="<?php echo $company_message ?>" readonly></p>
	<p><label>Interest:</label><input style="width: 100%; min-height: 30px;" type="text" name="interest" value="<?php echo $interest_message ?>" readonly></p>
	<p><label>Content:</label><input style="width: 100%; min-height: 50px;" type="text" name="content" value="<?php echo $content_message ?>" readonly></p>
  <?php
}
function save_details_message(){
  global $post;

  update_post_meta($post->ID, "note_message", $_POST["note_message"]);
  update_post_meta($post->ID, "name_message", $_POST["name_message"]);
  update_post_meta($post->ID, "email_message", $_POST["email_message"]);
  update_post_meta($post->ID, "company_message", $_POST["company_message"]);
  update_post_meta($post->ID, "interest_message", $_POST["interest_message"]);
  update_post_meta($post->ID, "content_message", $_POST["content_message"]);
  
}

/**
 *
 *
 * MetaBox for Custom post
 *
 *
 */

//Custom Posts that use this metabox
$custom_posts = array(
		'book',
		'article'
	);

function admin_init_metabox(){
	global $custom_posts;
    add_meta_box("metaBox_custom_post", "Other information", "metaBox_custom_post",$custom_posts , "normal", "low");
}
add_action("admin_init", "admin_init_metabox");

//Content Metabox
function metaBox_custom_post() {
  global $post;

  $custom = get_post_custom($post->ID);
  $publication_appear = $custom["publication_appear"][0];
  $identifier = $custom["identifier"][0];

  $settings = array(
    'media_buttons' => false,
    'teeny' => true,
    'editor_height' => 15
  );

  ?>
  <p><label>Publication within which it appears:</label><br>
  	<?php wp_editor( $publication_appear, "publication_appear", $settings);?>
  <p><label>Identifier:</label><br>
  	<?php wp_editor( $identifier, "identifier", $settings);?>
  <?php

}

//Update DB
function save_details(){
  global $post;

  update_post_meta($post->ID, "publication_appear", $_POST["publication_appear"]);
  update_post_meta($post->ID, "identifier", $_POST["identifier"]);
}

add_action('save_post', 'save_details');

//send it with WP RESTAPI
function wpsd_add_custom_posts_args() {
    global $wp_post_types;
    global $custom_posts;
    
    foreach ($custom_posts as $value) {
        $wp_post_types[$value]->show_in_rest = true;
    	$wp_post_types[$value]->rest_base = $value;
    	$wp_post_types[$value]->rest_controller_class = 'WP_REST_Posts_Controller';	
    }
}
add_action( 'init', 'wpsd_add_custom_posts_args', 30 );

/**
 *
 *
 *Custom taxonomy Author
 *
 *
 */

add_action( 'init', 'create_author_taxonomy', 0 );

// create taxonomy, genres and writers for the post type "book"
function create_author_taxonomy() {
	global $custom_posts;
	// Add new taxonomy called Author, make it hierarchical (like categories)
	$labels = array(
		'name'                       => _x( 'Authors', 'taxonomy general name' ),
		'singular_name'              => _x( 'Author', 'taxonomy singular name' ),
		'search_items'               => __( 'Search Authors' ),
		'popular_items'              => __( 'Popular Authors' ),
		'all_items'                  => __( 'All Authors' ),
		'parent_item'                => null,
		'parent_item_colon'          => null,
		'edit_item'                  => __( 'Edit Author' ),
		'update_item'                => __( 'Update Author' ),
		'add_new_item'               => __( 'Add New Author' ),
		'new_item_name'              => __( 'New Author Name' ),
		'separate_items_with_commas' => __( 'Separate authors with commas' ),
		'add_or_remove_items'        => __( 'Add or remove authors' ),
		'choose_from_most_used'      => __( 'Choose from the most used authors' ),
		'not_found'                  => __( 'No authors found.' ),
		'menu_name'                  => __( 'Authors' ),
	);

	//Hierarchical (false -> tag / true -> category)
	$args = array(
		'hierarchical'          => true, 
		'labels'                => $labels,
		'show_ui'               => true,
		'show_admin_column'     => true,
		'update_count_callback' => '_update_post_term_count',
		'query_var'             => true,
		'rewrite'               => array( 'slug' => 'author' ),
	);
	
	register_taxonomy( 'author', $custom_posts, $args );
}

/**
 *
 *
 *Create Custom Post from the array ($custom_posts_list)
 *
 *
 */
$custom_posts_list = array(
	array('Article','dashicons-format-aside'),
	array('Book','dashicons-book-alt')
);

create_Custom_post($custom_posts_list);

function create_Custom_post($custom_posts_list){
	foreach ($custom_posts_list as $custom_post) {
		$custom_post_creator = new CustomPost($custom_post[0], $custom_post[1]);
	}	
}


/**
 *Class to create Custom Post Type
 *
 *$obj = new CustomPost('the_name', 'the_icon');
 *
 *
 */

class CustomPost {
    private $name;  // name that appear in labels (and identifier)
	private $icon; // Icon that appear in admin menu

	//constructor
	function __construct($name, $icon){
		$this->name = $name;
        $this->icon = $icon;

        $this->add();
	}

	//call add_action to creat the Custom Post
    private function add(){
		add_action( 'init', $this->creat_custom_post(), 0 );
    }

    //set labels and arguments to create the Custom Post
	private function creat_custom_post() {
	    $args = $this->set_labels($this->name, $this->icon);
	    register_post_type($this->name, $args );
	}

	//Set labels and arg for Custom Post Type
    private function set_labels(){
    	$name = $this->name;
    	$icon = $this->icon;

		$labels = array(
	        'name'                  => _x( $name.'s', 'Post Type General Name', 'text_domain' ),
	        'singular_name'         => _x( $name, 'Post Type Singular Name', 'text_domain' ),
	        'menu_name'             => __( $name, 'text_domain' ),
	        'name_admin_bar'        => __( $name, 'text_domain' ),
	        'parent_item_colon'     => __( 'Parent '.$name.':', 'text_domain' ),
	        'all_items'             => __( 'All '.$name.'s', 'text_domain' ),
	        'add_new_item'          => __( $name, 'text_domain' ),
	        'add_new'               => __( 'Add New', 'text_domain' ),
	        'new_item'              => __( 'New'.$name, 'text_domain' ),
	        'edit_item'             => __( 'Edit '.$name, 'text_domain' ),
	        'update_item'           => __( 'Update'.$name, 'text_domain' ),
	        'view_item'             => __( 'View'.$name, 'text_domain' ),
	        'search_items'          => __( 'Search'.$name, 'text_domain' ),
	        'not_found'             => __( 'Not found', 'text_domain' ),
	        'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
	        'items_list'            => __( $name.'s list', 'text_domain' ),
	        'items_list_navigation' => __( $name.'s list navigation', 'text_domain' ),
	        'filter_items_list'     => __( 'Filter '.$name.'s list', 'text_domain' ),
	    );

	    $args = array(
	        'label'                 => __( $name, 'text_domain' ),
	        'description'           => __( 'Custom post '.$name, 'text_domain' ),
	        'labels'                => $labels,
	        'supports'              => array( 'title', 'editor', 'thumbnail', 'revisions' ),
	        'hierarchical'          => false,
	        'public'                => true,
	        'menu_icon'				=> $icon,
	        'show_ui'               => true,
	        'show_in_menu'          => true,
	        'menu_position'         => 26,
	        'show_in_admin_bar'     => true,
	        'show_in_nav_menus'     => true,
	        'can_export'            => true,
	        'has_archive'           => true,        
	        'exclude_from_search'   => false,
	        'publicly_queryable'    => true,
	        'capability_type'       => 'post', 
	    );

	    return $args;
    }
}

?>