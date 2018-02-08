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
                    <a href="<?php echo esc_url( __( 'https://wordpress.org/', 'bg-photo-frame' ) ); ?>"><?php printf( esc_html__( 'Powered by %s', 'bg-photo-frame' ), 'WordPress' ); ?></a>
                    <span class="sep"> | </span>
                    <?php printf( esc_html__( 'Based on Theme: %1$s', 'bg-photo-frame' ), 'BG Photo Frame' ); ?>
                    <span class="sep"> | </span>
                    <a href="http://www.miitbeian.gov.cn/" rel="external nofollow" target="_blank">
                    <?php echo get_option( 'zh_cn_l10n_icp_num' );?></a>
                    <span class="sep">|</span>
                    <?php printf(esc_html__( '© %1$s ', 'bg-photo-frame' ), date("Y")); bloginfo( 'name' )?>
                </div><!-- .site-info -->
            </footer><!-- #colophon -->
        </div><!-- #site-wrapper_inner -->
    </div><!-- #site-wrapper -->
</div><!-- #page -->
<?php wp_footer(); ?>

</body>
</html>
