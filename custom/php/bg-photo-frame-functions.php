<?php

//Load Script Files
function bg_photo_frame_custom_sctipt() {
	$theme_color = get_theme_mod( 'theme_color' ,'light');
	wp_enqueue_style( 
		'bootstrap', 
		get_template_directory_uri()   . '/custom/css/bootstrap.min.css'
	);
	
	wp_enqueue_style( 
		'bg-photo-frame-custom-style', 
		get_template_directory_uri()   . '/custom/css/bg-photo-frame-style.css'
	);
	
	wp_enqueue_style( 
		'bg-photo-frame-custom-style-sp', 
		get_template_directory_uri()   . '/custom/css/bg-photo-frame-style-sp.css'
	);
	
	
	
	if($theme_color == 'dark'){
		wp_enqueue_style( 
			'bg-photo-frame-custom-style-dark', 
			get_template_directory_uri()   . '/custom/css/bg-photo-frame-style-dark.css'
		);
	}else{
		wp_enqueue_style( 
			'bg-photo-frame-custom-style-light', 
			get_template_directory_uri()   . '/custom/css/bg-photo-frame-style-light.css'
		);
	}
	
	
	//jQuery
	wp_enqueue_script('jquery');
	//Slide
  	wp_enqueue_style('jquery-bgPhotoFrame-css', get_template_directory_uri()   . '/custom/css/jquery.bgPhotoFrame.min.css');
	wp_enqueue_script('jquery-bgPhotoFrame-js', get_template_directory_uri() . '/custom/js/jquery.bgPhotoFrame.min.js', array(), '1.0.0', true);
	
		
	//Master
	wp_enqueue_script('master', get_template_directory_uri() . '/custom/js/bg-photo-frame-master.js', array(), '1.2.2', true);
	
}
add_action( 'wp_enqueue_scripts', 'bg_photo_frame_custom_sctipt' );

function bg_photo_frame_js_params() {
	$image_order = get_theme_mod( "image_order" ,"in_order");
	$theme_color = get_theme_mod( 'theme_color' ,'light');
	$image_opacity = get_theme_mod( "image_opacity" , "70") / 100;
	$contents_opacity = get_theme_mod( "contents_opacity" , "70") / 100;
	echo "\n";
	echo '<script type="text/javascript">//<![CDATA[';
	
	//Color
	echo "\n";
	echo "var themeColor = '" . $theme_color  . "';";
	
	//Opacity
	echo "\n";
	echo "var imageOpacity = " . $image_opacity  . ";";
	echo "\n";
	echo "var contentsOpacity = " . $contents_opacity  . ";";
	
	//Order
	echo "\n";
	if($image_order == 'in_order'){
		echo "var shuffle = false;";
	}else{
		echo "var shuffle = true;";
	}
	
	echo "//]]></script>";
	echo "\n";
}

add_action( 'wp_head', 'bg_photo_frame_js_params', 15 );

/**
 * Add control in theme custmizer
 */
function bg_photo_frame_theme_color_customize_register($wp_customize){

	$wp_customize->add_section( 'bg_photo_frame_setting', array(
        'title'          => esc_html__('Theme Setting', 'bg-photo-frame'),
        'priority'       => 20,
    ));
		
	/* Theme Color */
	$wp_customize->add_setting('theme_color', array(
        'default'        => 'light',
		'capability' => 'manage_options',
		'type' => 'theme_mod',
		'transport' => 'refresh',
		'sanitize_callback' => 'bg_photo_frame_sanitize_teheme_color',
    ));
	
    $wp_customize->add_control('bg_photo_frame_setting_theme_color', array(
        'label'      => esc_html__('Theme Color', 'bg-photo-frame'),
        'section'    => 'bg_photo_frame_setting',
        'settings'   => 'theme_color',
		'type' => 'radio',
		'choices' => array(
            'light' => esc_html__('Light Side', 'bg-photo-frame'),
            'dark' => esc_html__('Dark Side', 'bg-photo-frame'),
        ),
    ));
	
	/* Image Order */
	$wp_customize->add_setting('image_order', array(
        'default'        => 'in_order',
		'capability' => 'manage_options',
		'type' => 'theme_mod',
		'transport' => 'refresh',
		'sanitize_callback' => 'bg_photo_frame_sanitize_image_order',
    ));
	
    $wp_customize->add_control('bg_photo_frame_setting_image_order', array(
        'label'      => esc_html__('Order of Images', 'bg-photo-frame'),
        'section'    => 'bg_photo_frame_setting',
        'settings'   => 'image_order',
		'type' => 'radio',
		'choices' => array(
            'in_order' => esc_html__('In order', 'bg-photo-frame'),
            'shuffle' => esc_html__('Shuffle', 'bg-photo-frame'),
        ),
    ));
	
	$wp_customize->add_setting('image_opacity', array(
        'default'        => 70,
		'capability' => 'manage_options',
		'type' => 'theme_mod',
		'transport' => 'refresh',
		'sanitize_callback' => 'bg_photo_frame_sanitize_image_opacity',
    ));
	
	$wp_customize->add_control('bg_photo_frame_setting_image_opacity', array(
        'label'      => esc_html__('Opacity of Images', 'bg-photo-frame'),
        'section'    => 'bg_photo_frame_setting',
        'settings'   => 'image_opacity',
		'type' => 'range',
		'input_attrs' => array(
			'min' => 0,
			'max' => 100,
			'step' => 1
			//'class' => 'image-opacity',
			//'style' => 'color: #0a0',
    	),
    ));
	
	$wp_customize->add_setting('contents_opacity', array(
        'default'        => 70,
		'capability' => 'manage_options',
		'type' => 'theme_mod',
		'transport' => 'refresh',
		'sanitize_callback' => 'bg_photo_frame_sanitize_contents_opacity',
    ));
	
	$wp_customize->add_control('bg_photo_frame_setting_contents_opacity', array(
        'label'      => esc_html__('Opacity of Contents Background', 'bg-photo-frame'),
        'section'    => 'bg_photo_frame_setting',
        'settings'   => 'contents_opacity',
		'type' => 'range',
		'input_attrs' => array(
			'min' => 0,
			'max' => 100,
			'step' => 1
			//'class' => 'image-opacity',
			//'style' => 'color: #0a0',
    	),
    ));

}

function bg_photo_frame_sanitize_teheme_color( $input ) {
	 $valid = array( 'light', 'dark' );
     if ( in_array( $input, $valid, true)) {
        return $input;
     } else {
        return '';
     }
	 
}

function bg_photo_frame_sanitize_image_order( $input ) {
	 $valid = array( 'in_order', 'shuffle' );
     if ( in_array( $input, $valid, true)) {
        return $input;
     } else {
        return '';
     }
}

function bg_photo_frame_sanitize_image_opacity( $input ) {
	return absint($input);
}

function bg_photo_frame_sanitize_contents_opacity( $input ) {
	return absint($input);
}


add_action('customize_register', 'bg_photo_frame_theme_color_customize_register');



/**
 * Custom_Header_Setup
 */
function bg_photo_frame_custom_header_setup_custom() {
	add_theme_support( 'custom-header', apply_filters( 'bg_photo_frame_custom_header_args', array(
		'default-image'          => '',
		'default-text-color'     => '000000',
		'width'                  => 1280,
		'height'                 => 720,
		'flex-height'            => true,
		'wp-head-callback'       => 'bg_photo_frame_header_style',
		'admin-head-callback'    => 'bg_photo_frame_admin_header_style',
		'admin-preview-callback' => 'bg_photo_frame_admin_header_image',
	) ) );
}
add_action( 'after_setup_theme', 'bg_photo_frame_custom_header_setup_custom' );


/**
 * Custom_Comment_Form_Setup
 */
function bg_photo_frame_comment_form_before() {
    ob_start();
}
add_action( 'comment_form_before', 'bg_photo_frame_comment_form_before' );

function bg_photo_frame_comment_form_after() {
    $html = ob_get_clean();
    $html = preg_replace(
        '/<h3 id="reply-title"(.*)>(.*)<\/h3>/',
        '<h2 id="reply-title"\1>\2</h2>',
        $html
    );
    echo $html;
}
add_action( 'comment_form_after', 'bg_photo_frame_comment_form_after' );



?>
