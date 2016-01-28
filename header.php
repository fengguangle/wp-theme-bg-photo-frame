<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package BG_Photo_Frame
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<div id="page" class="hfeed site">
	<div id="header-image">
    	<ul>
		<?php if ( get_header_image() ) : ?>
			<?php
            $images = get_uploaded_header_images();
            if($images):
            ?>
				<?php foreach($images as $image):?>
                <li><img src="<?php echo esc_html($image['url']); ?>"></li>
                <?php endforeach;?>
            <?php endif; ?>
        <?php else : ?>
        	<?php $theme_color = get_theme_mod( 'color_option' ,'light'); ?>
        	<?php for($i = 0; $i < 3; $i++) : ?>
			<li><img src="<?php echo get_template_directory_uri() . '/custom/img/bg-default-' . $theme_color . '-' . $i .'.jpg' ?>"></li>
			<?php endfor; ?>
        	
		<?php endif; ?>
        </ul>
	</div>
    
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'bg-photo-frame' ); ?></a>

	<div id="site-wrapper">
    	<div id="site-wrapper-inner">
            <header id="masthead" class="site-header" role="banner">
                <div class="site-branding">
                    <?php if ( is_front_page() && is_home() ) : ?>
                        <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
                    <?php else : ?>
                        <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
                    <?php endif; ?>
                    <p class="site-description"><?php bloginfo( 'description' ); ?></p>
                </div><!-- .site-branding -->
        
                <nav id="site-navigation" class="main-navigation" role="navigation">
                    <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'bg-photo-frame' ); ?></button>
                    <?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu', 'menu_class' => 'nav navbar-nav' ) ); ?>
                </nav><!-- #site-navigation -->
            </header><!-- #masthead -->
        
            <div id="content" class="site-content row">
