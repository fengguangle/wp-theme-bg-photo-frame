<?php

//Load Script Files
function bg_photo_frame_custom_sctipt() {
	$theme_color = get_theme_mod( 'color_option' ,'light');
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
  	wp_enqueue_style('easySlideshowFade', get_template_directory_uri()   . '/custom/css/jquery.easySlideshowFade.css');
	wp_enqueue_script('easy-slideshow-fade', get_template_directory_uri() . '/custom/js/jquery.easySlideshowFade.js', array(), '1.0.0', true);
	
		
	//Master
	wp_enqueue_script('master', get_template_directory_uri() . '/custom/js/bg-photo-frame-master.js', array(), '1.0.0', true);
	
}
add_action( 'wp_enqueue_scripts', 'bg_photo_frame_custom_sctipt' );

 



/**
 * Add control in theme custmizer
 */
function bg_photo_frame_theme_color_customize_register($wp_customize){

	$wp_customize->add_section( 'bg_photo_frame_setting', array(
        'title'          => esc_html__('Theme Setting', 'bg-photo-frame'),
        'priority'       => 20,
    ));
		
	$wp_customize->add_setting('color_option', array(
        'default'        => 'light',
		'capability' => 'manage_options',
		'type' => 'theme_mod',
		'transport' => 'refresh',
		'sanitize_callback' => 'wpforge_sanitize_teheme_color',
    ));
	
    $wp_customize->add_control('bg_photo_frame_setting_color_scheme', array(
        'label'      => esc_html__('Theme Color', 'bg-photo-frame'),
        'section'    => 'bg_photo_frame_setting',
        'settings'   => 'color_option',
		'type' => 'radio',
		'choices' => array(
            'light' => esc_html__('Light Side', 'bg-photo-frame'),
            'dark' => esc_html__('Dark Side', 'bg-photo-frame'),
        ),

    ));
	
	
	$wp_customize->add_setting('image_order', array(
        'default'        => 'in_order',
		'capability' => 'manage_options',
		'type' => 'theme_mod',
		'transport' => 'refresh',
		'sanitize_callback' => 'wpforge_sanitize_image_order',
    ));
	
    $wp_customize->add_control('bg_photo_frame_setting_image_order', array(
        'label'      => esc_html__('Order of images', 'bg-photo-frame'),
        'section'    => 'bg_photo_frame_setting',
        'settings'   => 'image_order',
		'type' => 'radio',
		'choices' => array(
            'in_order' => esc_html__('In order', 'bg-photo-frame'),
            'shuffle' => esc_html__('Shuffle', 'bg-photo-frame'),
        ),

    ));

}
function wpforge_sanitize_teheme_color( $input ) {
    $valid = array(
		'light' => esc_html__('Light Side', 'bg-photo-frame'),
		'dark' => esc_html__('Dark Side', 'bg-photo-frame'),
     );

     if ( array_key_exists( $input, $valid ) ) {
        return $input;
     } else {
        return '';
     }
}

function wpforge_sanitize_image_order( $input ) {
    $valid = array(
		'in_order' => esc_html__('In order', 'bg-photo-frame'),
		'shuffle' => esc_html__('Shuffle', 'bg-photo-frame'),
     );

     if ( array_key_exists( $input, $valid ) ) {
        return $input;
     } else {
        return '';
     }
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





?>
