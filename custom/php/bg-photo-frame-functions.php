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
	wp_enqueue_script('easy-slideshow-fade', get_template_directory_uri() . '/custom/js/jquery.easySlideshowFade.js', array(), '1.0.0', true);
	//Master
	wp_enqueue_script('master', get_template_directory_uri() . '/custom/js/bg-photo-frame-master.js', array(), '1.0.0', true);
	
}
add_action( 'wp_enqueue_scripts', 'bg_photo_frame_custom_sctipt' );

 



/**
 * Add control in theme custmizer
 */
function bg_photo_frame_theme_color_customize_register($wp_customize){

	$wp_customize->add_section( 'bg_photo_frame_color', array(
        'title'          => esc_html__('Theme Color', 'bg-photo-frame'),
        'priority'       => 20,
    ));
		
	$wp_customize->add_setting('color_option', array(
        'default'        => 'light',
		'capability' => 'manage_options',
		'type' => 'theme_mod',
		'transport' => 'refresh',
		'sanitize_callback' => 'wpforge_sanitize_teheme_color',
    ));
	
    $wp_customize->add_control('bg_photo_frame_color_scheme', array(
        'label'      => esc_html__('Theme Color', 'bg-photo-frame'),
        'section'    => 'bg_photo_frame_color',
        'settings'   => 'color_option',
		'type' => 'radio',
		'choices' => array(
            'light' => esc_html__('Light Side', 'bg-photo-frame'),
            'dark' => esc_html__('Dark Side', 'bg-photo-frame'),
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
