/**
 * PMPro Donations Checkout - Dynamic Payment Gateway Display
 * 
 * This script handles the dynamic display of payment gateways for free levels with donations.
 * It shows/hides the payment gateway section based on the donation amount entered.
 */

console.log('PMPro Donations Checkout script loaded');
jQuery(document).ready(function($) {

        // Only run this script if we're on the checkout page
        if (!$('#pmpro_form').length) {
            return;
        }

        // Variables to track payment and billing sections
        const $paymentSection = $('#pmpro_payment_information_fields');
        const $billingSection = $('#pmpro_billing_address_fields');
        const $donationAmount = $('#donation');
        const $donationDropdown = $('#donation_dropdown');
        const $paymentMethodSection = $('#pmpro_payment_method');
        const hiddenClass = 'pmpro-donations-hidden';

        // Check if this is a free level with donations
        let isFreeLevelWithDonations = false;
        
        // If the payment section exists and we have a donation field, we're on a free level with donations
        if ($paymentSection.length && ($donationAmount.length || $donationDropdown.length)) {
            // This will be determined by server-side logic (we'll add a class or data attribute)
            isFreeLevelWithDonations = $('body').hasClass('pmpro-free-level-with-donations');
        }

        // If this is not a free level with donations, exit early
        if (!isFreeLevelWithDonations) {
            return;
        }

        // Remove the inline display:none CSS attribute
        $paymentMethodSection.show();
        // $paymentMethodSection.css('display', 'block');

        // Hide payment sections initially
        hidePaymentSections();

        // Functions to handle the showing/hiding of payment sections
        function hidePaymentSections() {
            $paymentSection.addClass(hiddenClass);
            $billingSection.addClass(hiddenClass);
            $paymentMethodSection.addClass(hiddenClass);

            // Set PMPro's internal billing requirement flag
            if (typeof pmpro_require_billing !== 'undefined') {
                pmpro_require_billing = false;
            }
        }

        function showPaymentSections() {
            $paymentSection.removeClass(hiddenClass);
            $billingSection.removeClass(hiddenClass);
            $paymentMethodSection.removeClass(hiddenClass);

            // Set PMPro's internal billing requirement flag
            if (typeof pmpro_require_billing !== 'undefined') {
                pmpro_require_billing = true;
            }
        }

        function updatePaymentVisibility() {
            let donationValue = 0;

            // If we have a dropdown and it's not set to "other", use its value
            if ($donationDropdown.length && $donationDropdown.val() !== 'other') {
                donationValue = parseFloat($donationDropdown.val()) || 0;
            } 
            // Otherwise, use the text input value
            else if ($donationAmount.length) {
                donationValue = parseFloat($donationAmount.val()) || 0;
            }

            // Show/hide payment sections based on donation value
            if (donationValue > 0) {
                showPaymentSections();
            } else {
                hidePaymentSections();
            }
        }

        // Set up event listeners
        if ($donationAmount.length) {
            $donationAmount.on('input change keyup', updatePaymentVisibility);
        }
        
        if ($donationDropdown.length) {
            $donationDropdown.on('change', function() {
                // Handle the "other" option if it exists
                if ($(this).val() === 'other') {
                    // When "other" is selected, we need to check the text input
                    updatePaymentVisibility();
                } else {
                    updatePaymentVisibility();
                }
            });
        }

        // Initial check
        updatePaymentVisibility();

});
