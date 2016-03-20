<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package BG_Photo_Frame
 */

?>

            </div><!-- #content -->
        
            <footer id="colophon" class="site-footer" role="contentinfo">
                <div class="site-info">
                    <a href="<?php echo esc_url( __( 'https://wordpress.org/', 'bg-photo-frame' ) ); ?>"><?php printf( esc_html__( 'Proudly powered by %s', 'bg-photo-frame' ), 'WordPress' ); ?></a>
                    <span class="sep"> | </span>
                    <?php printf( esc_html__( 'Theme: %1$s by %2$s.', 'bg-photo-frame' ), 'bg-photo-frame', '<a href="http://underscores.me/" rel="designer">Underscores.me</a>' ); ?>
                </div><!-- .site-info -->
            </footer><!-- #colophon -->
        </div><!-- #site-wrapper_inner -->
    </div><!-- #site-wrapper -->
</div><!-- #page -->
<?php wp_footer(); ?>

</body>
</html>
